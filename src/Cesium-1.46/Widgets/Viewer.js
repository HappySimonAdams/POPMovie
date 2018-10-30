define([
    '../Core/BoundingSphere',
    '../Core/Cartesian3',
    '../Core/Clock',
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/defineProperties',
    '../Core/destroyObject',
    '../Core/DeveloperError',
    '../Core/Event',
    '../Core/EventHelper',
    '../Core/HeadingPitchRange',
    '../Core/isArray',
    '../Core/Matrix4',
    '../Core/Rectangle',
    '../Core/ScreenSpaceEventType',
    '../DataSources/BoundingSphereState',
    '../DataSources/ConstantPositionProperty',
    '../DataSources/DataSourceCollection',
    '../DataSources/DataSourceDisplay',
    '../DataSources/Entity',
    '../DataSources/EntityView',
    '../DataSources/Property',
    '../Scene/Cesium3DTileset',
    '../Scene/ImageryLayer',
    '../Scene/SceneMode',
    '../ThirdParty/knockout',
    '../ThirdParty/when',
    './CesiumWidget',
    './ClockViewModel',
    './getElement',
    './subscribeAndEvaluate'
], function(
    BoundingSphere,
    Cartesian3,
    Clock,
    defaultValue,
    defined,
    defineProperties,
    destroyObject,
    DeveloperError,
    Event,
    EventHelper,
    HeadingPitchRange,
    isArray,
    Matrix4,
    Rectangle,
    ScreenSpaceEventType,
    BoundingSphereState,
    ConstantPositionProperty,
    DataSourceCollection,
    DataSourceDisplay,
    Entity,
    EntityView,
    Property,
    Cesium3DTileset,
    ImageryLayer,
    SceneMode,
    knockout,
    when,
    CesiumWidget,
    ClockViewModel,
    getElement,
    HomeButton,
    subscribeAndEvaluate
) {
    'use strict';

    var boundingSphereScratch = new BoundingSphere();

    function trackDataSourceClock(clock, dataSource) {
        if (defined(dataSource)) {
            var dataSourceClock = dataSource.clock;
            if (defined(dataSourceClock)) {
                dataSourceClock.getValue(clock);
            }
        }
    }

    function Viewer(container, options) {
        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }

        container = getElement(container);
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var that = this;

        var viewerContainer = document.createElement('div');
        viewerContainer.className = 'cesium-viewer';
        container.appendChild(viewerContainer);

        // Cesium widget container
        var cesiumWidgetContainer = document.createElement('div');
        cesiumWidgetContainer.className = 'cesium-viewer-cesiumWidgetContainer';
        viewerContainer.appendChild(cesiumWidgetContainer);

        // Bottom container
        var bottomContainer = document.createElement('div');
        bottomContainer.className = 'cesium-viewer-bottom';

        viewerContainer.appendChild(bottomContainer);

        var scene3DOnly = defaultValue(options.scene3DOnly, false);

        var clock;
        var clockViewModel;
        var destroyClockViewModel = false;
        if (defined(options.clockViewModel)) {
            clockViewModel = options.clockViewModel;
            clock = clockViewModel.clock;
        } else {
            clock = new Clock();
            clockViewModel = new ClockViewModel(clock);
            destroyClockViewModel = true;
        }

        if (defined(options.shouldAnimate)) {
            clock.shouldAnimate = options.shouldAnimate;
        }

        // Cesium widget
        var cesiumWidget = new CesiumWidget(cesiumWidgetContainer, {
            imageryProvider: options.imageryProvider,
            clock : clock,
            skyBox : options.skyBox,
            skyAtmosphere : options.skyAtmosphere,
            sceneMode : options.sceneMode,
            mapProjection : options.mapProjection,
            globe : options.globe,
            orderIndependentTranslucency : options.orderIndependentTranslucency,
            contextOptions : options.contextOptions,
            useDefaultRenderLoop : options.useDefaultRenderLoop,
            targetFrameRate : options.targetFrameRate,
            showRenderLoopErrors : options.showRenderLoopErrors,
            creditContainer : defined(options.creditContainer) ? options.creditContainer : bottomContainer,
            creditViewport : options.creditViewport,
            scene3DOnly : scene3DOnly,
            terrainExaggeration : options.terrainExaggeration,
            shadows : options.shadows,
            terrainShadows : options.terrainShadows,
            mapMode2D : options.mapMode2D,
            requestRenderMode : options.requestRenderMode,
            maximumRenderTimeChange : options.maximumRenderTimeChange
        });

        var dataSourceCollection = options.dataSources;
        var destroyDataSourceCollection = false;
        if (!defined(dataSourceCollection)) {
            dataSourceCollection = new DataSourceCollection();
            destroyDataSourceCollection = true;
        }

        var scene = cesiumWidget.scene;

        var dataSourceDisplay = new DataSourceDisplay({
            scene : scene,
            dataSourceCollection : dataSourceCollection
        });

        var eventHelper = new EventHelper();

        eventHelper.add(clock.onTick, Viewer.prototype._onTick, this);
        eventHelper.add(scene.morphStart, Viewer.prototype._clearTrackedObject, this);

        //TODO
        // These need to be set after the BaseLayerPicker is created in order to take effect
        /*if (defined(options.imageryProvider) && options.imageryProvider !== false) {
            if (createBaseLayerPicker) {
                baseLayerPicker.viewModel.selectedImagery = undefined;
            }
            scene.imageryLayers.removeAll();
            scene.imageryLayers.addImageryProvider(options.imageryProvider);
        }
        if (defined(options.terrainProvider)) {
            if (createBaseLayerPicker) {
                baseLayerPicker.viewModel.selectedTerrain = undefined;
            }
            scene.terrainProvider = options.terrainProvider;
        }*/

        this._dataSourceChangedListeners = {};
        this._automaticallyTrackDataSourceClocks = defaultValue(options.automaticallyTrackDataSourceClocks, true);
        this._container = container;
        this._bottomContainer = bottomContainer;
        this._element = viewerContainer;
        this._cesiumWidget = cesiumWidget;
        this._dataSourceCollection = dataSourceCollection;
        this._destroyDataSourceCollection = destroyDataSourceCollection;
        this._dataSourceDisplay = dataSourceDisplay;
        this._clockViewModel = clockViewModel;
        this._destroyClockViewModel = destroyClockViewModel;
        this._eventHelper = eventHelper;
        this._lastWidth = 0;
        this._lastHeight = 0;
        this._allowDataSourcesToSuspendAnimation = true;
        this._entityView = undefined;
        this._clockTrackedDataSource = undefined;
        this._trackedEntity = undefined;
        this._needTrackedEntityUpdate = false;
        this._selectedEntity = undefined;
        this._clockTrackedDataSource = undefined;
        this._forceResize = false;
        this._zoomIsFlight = false;
        this._zoomTarget = undefined;
        this._zoomPromise = undefined;
        this._zoomOptions = undefined;
        this._selectedEntityChanged = new Event();
        this._trackedEntityChanged = new Event();

        knockout.track(this, ['_trackedEntity', '_selectedEntity', '_clockTrackedDataSource']);

        //Listen to data source events in order to track clock changes.
        eventHelper.add(dataSourceCollection.dataSourceAdded, Viewer.prototype._onDataSourceAdded, this);
        eventHelper.add(dataSourceCollection.dataSourceRemoved, Viewer.prototype._onDataSourceRemoved, this);

        // Prior to each render, check if anything needs to be resized.
        eventHelper.add(scene.postUpdate, Viewer.prototype.resize, this);
        eventHelper.add(scene.postRender, Viewer.prototype._postRender, this);

        // We need to subscribe to the data sources and collections so that we can clear the
        // tracked object when it is removed from the scene.
        // Subscribe to current data sources
        var dataSourceLength = dataSourceCollection.length;
        for (var i = 0; i < dataSourceLength; i++) {
            this._dataSourceAdded(dataSourceCollection, dataSourceCollection.get(i));
        }
        this._dataSourceAdded(undefined, dataSourceDisplay.defaultDataSource);

        // Hook up events so that we can subscribe to future sources.
        eventHelper.add(dataSourceCollection.dataSourceAdded, Viewer.prototype._dataSourceAdded, this);
        eventHelper.add(dataSourceCollection.dataSourceRemoved, Viewer.prototype._dataSourceRemoved, this);

        // TODO
        /*function pickAndTrackObject(e) {
            var entity = pickEntity(that, e);
            if (defined(entity)) {
                //Only track the entity if it has a valid position at the current time.
                if (Property.getValueOrUndefined(entity.position, that.clock.currentTime)) {
                    that.trackedEntity = entity;
                } else {
                    that.zoomTo(entity);
                }
            }
        }
        function pickAndSelectObject(e) {
            that.selectedEntity = pickEntity(that, e);
        }
        cesiumWidget.screenSpaceEventHandler.setInputAction(pickAndSelectObject, ScreenSpaceEventType.LEFT_CLICK);
        cesiumWidget.screenSpaceEventHandler.setInputAction(pickAndTrackObject, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);*/
    }

    defineProperties(Viewer.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },

        bottomContainer : {
            get : function() {
                return this._bottomContainer;
            }
        },

        cesiumWidget : {
            get : function() {
                return this._cesiumWidget;
            }
        },

        dataSourceDisplay : {
            get : function() {
                return this._dataSourceDisplay;
            }
        },

        entities : {
            get : function() {
                return this._dataSourceDisplay.defaultDataSource.entities;
            }
        },

        dataSources : {
            get : function() {
                return this._dataSourceCollection;
            }
        },

        canvas : {
            get : function() {
                return this._cesiumWidget.canvas;
            }
        },

        scene : {
            get : function() {
                return this._cesiumWidget.scene;
            }
        },

        shadows : {
            get : function() {
                return this.scene.shadowMap.enabled;
            },
            set : function(value) {
                this.scene.shadowMap.enabled = value;
            }
        },

        terrainShadows : {
            get : function() {
                return this.scene.globe.shadows;
            },
            set : function(value) {
                this.scene.globe.shadows = value;
            }
        },

        shadowMap : {
            get : function() {
                return this.scene.shadowMap;
            }
        },

        imageryLayers : {
            get : function() {
                return this.scene.imageryLayers;
            }
        },

        terrainProvider : {
            get : function() {
                return this.scene.terrainProvider;
            },
            set : function(terrainProvider) {
                this.scene.terrainProvider = terrainProvider;
            }
        },

        camera : {
            get : function() {
                return this.scene.camera;
            }
        },

        postProcessStages : {
            get : function() {
                return this.scene.postProcessStages;
            }
        },

        clock : {
            get : function() {
                return this._clockViewModel.clock;
            }
        },

        clockViewModel : {
            get : function() {
                return this._clockViewModel;
            }
        },

        screenSpaceEventHandler : {
            get : function() {
                return this._cesiumWidget.screenSpaceEventHandler;
            }
        },

        targetFrameRate : {
            get : function() {
                return this._cesiumWidget.targetFrameRate;
            },
            set : function(value) {
                this._cesiumWidget.targetFrameRate = value;
            }
        },

        useDefaultRenderLoop : {
            get : function() {
                return this._cesiumWidget.useDefaultRenderLoop;
            },
            set : function(value) {
                this._cesiumWidget.useDefaultRenderLoop = value;
            }
        },

        resolutionScale : {
            get : function() {
                return this._cesiumWidget.resolutionScale;
            },
            set : function(value) {
                this._cesiumWidget.resolutionScale = value;
                this._forceResize = true;
            }
        },

        allowDataSourcesToSuspendAnimation : {
            get : function() {
                return this._allowDataSourcesToSuspendAnimation;
            },
            set : function(value) {
                this._allowDataSourcesToSuspendAnimation = value;
            }
        },

        trackedEntity : {
            get : function() {
                return this._trackedEntity;
            },
            set : function(value) {
                if (this._trackedEntity !== value) {
                    this._trackedEntity = value;

                    //Cancel any pending zoom
                    cancelZoom(this);

                    var scene = this.scene;
                    var sceneMode = scene.mode;

                    //Stop tracking
                    if (!defined(value) || !defined(value.position)) {
                        this._needTrackedEntityUpdate = false;
                        if (sceneMode === SceneMode.COLUMBUS_VIEW || sceneMode === SceneMode.SCENE2D) {
                            scene.screenSpaceCameraController.enableTranslate = true;
                        }

                        if (sceneMode === SceneMode.COLUMBUS_VIEW || sceneMode === SceneMode.SCENE3D) {
                            scene.screenSpaceCameraController.enableTilt = true;
                        }

                        this._entityView = undefined;
                        this.camera.lookAtTransform(Matrix4.IDENTITY);
                    } else {
                        //We can't start tracking immediately, so we set a flag and start tracking
                        //when the bounding sphere is ready (most likely next frame).
                        this._needTrackedEntityUpdate = true;
                    }

                    this._trackedEntityChanged.raiseEvent(value);
                    this.scene.requestRender();
                }
            }
        },

        selectedEntity : {
            get : function() {
                return this._selectedEntity;
            },
            set : function(value) {
                if (this._selectedEntity !== value) {
                    this._selectedEntity = value;
                    var selectionIndicatorViewModel = defined(this._selectionIndicator) ? this._selectionIndicator.viewModel : undefined;
                    if (defined(value)) {
                        if (defined(selectionIndicatorViewModel)) {
                            selectionIndicatorViewModel.animateAppear();
                        }
                    } else if (defined(selectionIndicatorViewModel)) {
                        // Leave the info text in place here, it is needed during the exit animation.
                        selectionIndicatorViewModel.animateDepart();
                    }
                    this._selectedEntityChanged.raiseEvent(value);
                }
            }
        },

        selectedEntityChanged : {
            get : function() {
                return this._selectedEntityChanged;
            }
        },

        trackedEntityChanged : {
            get : function() {
                return this._trackedEntityChanged;
            }
        },

        clockTrackedDataSource : {
            get : function() {
                return this._clockTrackedDataSource;
            },
            set : function(value) {
                if (this._clockTrackedDataSource !== value) {
                    this._clockTrackedDataSource = value;
                    trackDataSourceClock(this.clock, value);
                }
            }
        }
    });

    /**
     * @private
     */
    Viewer.prototype._dataSourceAdded = function(dataSourceCollection, dataSource) {
        var entityCollection = dataSource.entities;
        entityCollection.collectionChanged.addEventListener(Viewer.prototype._onEntityCollectionChanged, this);
    };

    /**
     * @private
     */
    Viewer.prototype._dataSourceRemoved = function(dataSourceCollection, dataSource) {
        var entityCollection = dataSource.entities;
        entityCollection.collectionChanged.removeEventListener(Viewer.prototype._onEntityCollectionChanged, this);

        if (defined(this.trackedEntity)) {
            if (entityCollection.getById(this.trackedEntity.id) === this.trackedEntity) {
                this.trackedEntity = undefined;
            }
        }

        if (defined(this.selectedEntity)) {
            if (entityCollection.getById(this.selectedEntity.id) === this.selectedEntity) {
                this.selectedEntity = undefined;
            }
        }
    };

    /**
     * @private
     */
    Viewer.prototype._onTick = function(clock) {
        var time = clock.currentTime;

        var isUpdated = this._dataSourceDisplay.update(time);
        if (this._allowDataSourcesToSuspendAnimation) {
            this._clockViewModel.canAnimate = isUpdated;
        }

        var entityView = this._entityView;
        if (defined(entityView)) {
            var trackedEntity = this._trackedEntity;
            var trackedState = this._dataSourceDisplay.getBoundingSphere(trackedEntity, false, boundingSphereScratch);
            if (trackedState === BoundingSphereState.DONE) {
                entityView.update(time, boundingSphereScratch);
            }
        }

        var position;
        var enableCamera = false;
        var selectedEntity = this.selectedEntity;
        var showSelection = defined(selectedEntity) && this._enableInfoOrSelection;

        if (showSelection && selectedEntity.isShowing && selectedEntity.isAvailable(time)) {
            var state = this._dataSourceDisplay.getBoundingSphere(selectedEntity, true, boundingSphereScratch);
            if (state !== BoundingSphereState.FAILED) {
                position = boundingSphereScratch.center;
            } else if (defined(selectedEntity.position)) {
                position = selectedEntity.position.getValue(time, position);
            }
            enableCamera = defined(position);
        }
    };

    /**
     * @private
     */
    Viewer.prototype._onEntityCollectionChanged = function(collection, added, removed) {
        var length = removed.length;
        for (var i = 0; i < length; i++) {
            var removedObject = removed[i];
            if (this.trackedEntity === removedObject) {
                this.trackedEntity = undefined;
            }
            if (this.selectedEntity === removedObject) {
                this.selectedEntity = undefined;
            }
        }
    };

    /**
     * @private
     */
    Viewer.prototype._clearTrackedObject = function() {
        this.trackedEntity = undefined;
    };

    /**
     * @private
     */
    Viewer.prototype._clearObjects = function() {
        this.trackedEntity = undefined;
        this.selectedEntity = undefined;
    };

    /**
     * @private
     */
    Viewer.prototype._onDataSourceChanged = function(dataSource) {
        if (this.clockTrackedDataSource === dataSource) {
            trackDataSourceClock(this.clock, dataSource);
        }
    };

    /**
     * @private
     */
    Viewer.prototype._onDataSourceAdded = function(dataSourceCollection, dataSource) {
        if (this._automaticallyTrackDataSourceClocks) {
            this.clockTrackedDataSource = dataSource;
        }
        var id = dataSource.entities.id;
        var removalFunc = this._eventHelper.add(dataSource.changedEvent, Viewer.prototype._onDataSourceChanged, this);
        this._dataSourceChangedListeners[id] = removalFunc;
    };

    /**
     * @private
     */
    Viewer.prototype._onDataSourceRemoved = function(dataSourceCollection, dataSource) {
        var resetClock = (this.clockTrackedDataSource === dataSource);
        var id = dataSource.entities.id;
        this._dataSourceChangedListeners[id]();
        this._dataSourceChangedListeners[id] = undefined;
        if (resetClock) {
            var numDataSources = dataSourceCollection.length;
            if (this._automaticallyTrackDataSourceClocks && numDataSources > 0) {
                this.clockTrackedDataSource = dataSourceCollection.get(numDataSources - 1);
            } else {
                this.clockTrackedDataSource = undefined;
            }
        }
    };

    /**
     * @private
     */
    Viewer.prototype._postRender = function() {
        updateZoomTarget(this);
        updateTrackedEntity(this);
    };

    function updateZoomTarget(viewer) {
        var target = viewer._zoomTarget;
        if (!defined(target) || viewer.scene.mode === SceneMode.MORPHING) {
            return;
        }

        var scene = viewer.scene;
        var camera = scene.camera;
        var zoomPromise = viewer._zoomPromise;
        var zoomOptions = defaultValue(viewer._zoomOptions, {});
        var options;

        // If zoomTarget was Cesium3DTileset
        if (target instanceof Cesium3DTileset) {
            return target.readyPromise.then(function() {
                var boundingSphere = target.boundingSphere;
                // if offset was originally undefined then give it base value instead of empty object
                if (!defined(zoomOptions.offset)) {
                    zoomOptions.offset = new HeadingPitchRange(0.0, -0.5, boundingSphere.radius);
                }

                options = {
                    offset : zoomOptions.offset,
                    duration : zoomOptions.duration,
                    maximumHeight : zoomOptions.maximumHeight,
                    complete : function() {
                        zoomPromise.resolve(true);
                    },
                    cancel : function() {
                        zoomPromise.resolve(false);
                    }
                };

                if (viewer._zoomIsFlight) {
                    camera.flyToBoundingSphere(target.boundingSphere, options);
                } else {
                    camera.viewBoundingSphere(boundingSphere, zoomOptions.offset);
                    camera.lookAtTransform(Matrix4.IDENTITY);

                    // finish the promise
                    zoomPromise.resolve(true);
                }

                clearZoom(viewer);
            });
        }

        //If zoomTarget was an ImageryLayer
        if (target instanceof Rectangle) {
            options = {
                destination : target,
                duration : zoomOptions.duration,
                maximumHeight : zoomOptions.maximumHeight,
                complete : function() {
                    zoomPromise.resolve(true);
                },
                cancel : function() {
                    zoomPromise.resolve(false);
                }
            };

            if (viewer._zoomIsFlight) {
                camera.flyTo(options);
            } else {
                camera.setView(options);
                zoomPromise.resolve(true);
            }
            clearZoom(viewer);
            return;
        }

        var entities = target;

        var boundingSpheres = [];
        for (var i = 0, len = entities.length; i < len; i++) {
            var state = viewer._dataSourceDisplay.getBoundingSphere(entities[i], false, boundingSphereScratch);

            if (state === BoundingSphereState.PENDING) {
                return;
            } else if (state !== BoundingSphereState.FAILED) {
                boundingSpheres.push(BoundingSphere.clone(boundingSphereScratch));
            }
        }

        if (boundingSpheres.length === 0) {
            cancelZoom(viewer);
            return;
        }

        //Stop tracking the current entity.
        viewer.trackedEntity = undefined;

        var boundingSphere = BoundingSphere.fromBoundingSpheres(boundingSpheres);

        if (!viewer._zoomIsFlight) {
            camera.viewBoundingSphere(boundingSphere, viewer._zoomOptions.offset);
            camera.lookAtTransform(Matrix4.IDENTITY);
            clearZoom(viewer);
            zoomPromise.resolve(true);
        } else {
            clearZoom(viewer);
            camera.flyToBoundingSphere(boundingSphere, {
                duration : zoomOptions.duration,
                maximumHeight : zoomOptions.maximumHeight,
                complete : function() {
                    zoomPromise.resolve(true);
                },
                cancel : function() {
                    zoomPromise.resolve(false);
                },
                offset : zoomOptions.offset
            });
        }
    }

    function updateTrackedEntity(viewer) {
        if (!viewer._needTrackedEntityUpdate) {
            return;
        }

        var trackedEntity = viewer._trackedEntity;
        var currentTime = viewer.clock.currentTime;

        //Verify we have a current position at this time. This is only triggered if a position
        //has become undefined after trackedEntity is set but before the boundingSphere has been
        //computed. In this case, we will track the entity once it comes back into existence.
        var currentPosition = Property.getValueOrUndefined(trackedEntity.position, currentTime);

        if (!defined(currentPosition)) {
            return;
        }

        var scene = viewer.scene;

        var state = viewer._dataSourceDisplay.getBoundingSphere(trackedEntity, false, boundingSphereScratch);
        if (state === BoundingSphereState.PENDING) {
            return;
        }

        var sceneMode = scene.mode;
        if (sceneMode === SceneMode.COLUMBUS_VIEW || sceneMode === SceneMode.SCENE2D) {
            scene.screenSpaceCameraController.enableTranslate = false;
        }

        if (sceneMode === SceneMode.COLUMBUS_VIEW || sceneMode === SceneMode.SCENE3D) {
            scene.screenSpaceCameraController.enableTilt = false;
        }

        var bs = state !== BoundingSphereState.FAILED ? boundingSphereScratch : undefined;
        viewer._entityView = new EntityView(trackedEntity, scene, scene.mapProjection.ellipsoid);
        viewer._entityView.update(currentTime, bs);
        viewer._needTrackedEntityUpdate = false;
    }

    Viewer.prototype.extend = function(mixin, options) {
        if (!defined(mixin)) {
            throw new DeveloperError('mixin is required.');
        }

        mixin(this, options);
    };

    Viewer.prototype.resize = function() {
        var cesiumWidget = this._cesiumWidget;
        var container = this._container;
        var width = container.clientWidth;
        var height = container.clientHeight;

        if (!this._forceResize && width === this._lastWidth && height === this._lastHeight) {
            return;
        }

        cesiumWidget.resize();

        this._forceResize = false;

        this._bottomContainer.style.left = 0 + 'px';
        this._bottomContainer.style.bottom = 0 + 'px';

        this._lastWidth = width;
        this._lastHeight = height;
    };

    Viewer.prototype.forceResize = function() {
        this._lastWidth = 0;
        this.resize();
    };

    Viewer.prototype.render = function() {
        this._cesiumWidget.render();
    };

    Viewer.prototype.isDestroyed = function() {
        return false;
    };

    Viewer.prototype.dispose = function() {
        var i;

        // this.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
        // this.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // Unsubscribe from data sources
        var dataSources = this.dataSources;
        var dataSourceLength = dataSources.length;
        for (i = 0; i < dataSourceLength; i++) {
            this._dataSourceRemoved(dataSources, dataSources.get(i));
        }
        this._dataSourceRemoved(undefined, this._dataSourceDisplay.defaultDataSource);

        this._container.removeChild(this._element);
        this._element.removeChild(this._toolbar);

        this._eventHelper.removeAll();

        if (this._destroyClockViewModel) {
            this._clockViewModel = this._clockViewModel.dispose();
        }
        this._dataSourceDisplay = this._dataSourceDisplay.dispose();
        this._cesiumWidget = this._cesiumWidget.dispose();

        if (this._destroyDataSourceCollection) {
            this._dataSourceCollection = this._dataSourceCollection.dispose();
        }

        return destroyObject(this);
    };


    Viewer.prototype.zoomTo = function(target, offset) {
        var options = {
            offset : offset
        };
        return zoomToOrFly(this, target, options, false);
    };

    Viewer.prototype.flyTo = function(target, options) {
        return zoomToOrFly(this, target, options, true);
    };

    function zoomToOrFly(that, zoomTarget, options, isFlight) {
        if (!defined(zoomTarget)) {
            throw new DeveloperError('zoomTarget is required.');
        }

        cancelZoom(that);

        //We can't actually perform the zoom until all visualization is ready and
        //bounding spheres have been computed.  Therefore we create and return
        //a deferred which will be resolved as part of the post-render step in the
        //frame that actually performs the zoom
        var zoomPromise = when.defer();
        that._zoomPromise = zoomPromise;
        that._zoomIsFlight = isFlight;
        that._zoomOptions = options;

        when(zoomTarget, function(zoomTarget) {
            //Only perform the zoom if it wasn't cancelled before the promise resolved.
            if (that._zoomPromise !== zoomPromise) {
                return;
            }

            //If the zoom target is a rectangular imagery in an ImageLayer
            if (zoomTarget instanceof ImageryLayer) {
                zoomTarget.getViewableRectangle().then(function(rectangle) {
                    //Only perform the zoom if it wasn't cancelled before the promise was resolved
                    if (that._zoomPromise === zoomPromise) {
                        that._zoomTarget = rectangle;
                    }
                });
                return;
            }

            //If the zoom target is a Cesium3DTileset
            if (zoomTarget instanceof Cesium3DTileset) {
                that._zoomTarget = zoomTarget;
                return;
            }

            //If the zoom target is a data source, and it's in the middle of loading, wait for it to finish loading.
            if (zoomTarget.isLoading && defined(zoomTarget.loadingEvent)) {
                var removeEvent = zoomTarget.loadingEvent.addEventListener(function() {
                    removeEvent();

                    //Only perform the zoom if it wasn't cancelled before the data source finished.
                    if (that._zoomPromise === zoomPromise) {
                        that._zoomTarget = zoomTarget.entities.values.slice(0);
                    }
                });
                return;
            }

            //Zoom target is already an array, just copy it and return.
            if (isArray(zoomTarget)) {
                that._zoomTarget = zoomTarget.slice(0);
                return;
            }

            //If zoomTarget is an EntityCollection, this will retrieve the array
            zoomTarget = defaultValue(zoomTarget.values, zoomTarget);

            //If zoomTarget is a DataSource, this will retrieve the array.
            if (defined(zoomTarget.entities)) {
                zoomTarget = zoomTarget.entities.values;
            }

            //Zoom target is already an array, just copy it and return.
            if (isArray(zoomTarget)) {
                that._zoomTarget = zoomTarget.slice(0);
            } else {
                //Single entity
                that._zoomTarget = [zoomTarget];
            }
        });

        that.scene.requestRender();
        return zoomPromise.promise;
    }

    function clearZoom(viewer) {
        viewer._zoomPromise = undefined;
        viewer._zoomTarget = undefined;
        viewer._zoomOptions = undefined;
    }

    function cancelZoom(viewer) {
        var zoomPromise = viewer._zoomPromise;
        if (defined(zoomPromise)) {
            clearZoom(viewer);
            zoomPromise.resolve(false);
        }
    }

    return Viewer;
});
