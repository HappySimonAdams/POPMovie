define([
    '../Core/buildModuleUrl',
    '../Core/Cartesian3',
    '../Core/Clock',
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/defineProperties',
    '../Core/destroyObject',
    '../Core/DeveloperError',
    '../Core/Ellipsoid',
    '../Core/FeatureDetection',
    '../Core/formatError',
    '../Core/requestAnimationFrame',
    '../Core/ScreenSpaceEventHandler',
    // '../Scene/createWorldImagery',
    '../Scene/createTileMapServiceImageryProvider',
    '../Scene/Globe',
    // '../Scene/Moon',
    '../Scene/Scene',
    '../Scene/SceneMode',
    '../Scene/ShadowMode',
    '../Scene/SkyAtmosphere',
    // '../Scene/SkyBox',
    // '../Scene/Sun',
    './getElement'
], function(
    buildModuleUrl,
    Cartesian3,
    Clock,
    defaultValue,
    defined,
    defineProperties,
    destroyObject,
    DeveloperError,
    Ellipsoid,
    FeatureDetection,
    formatError,
    requestAnimationFrame,
    ScreenSpaceEventHandler,
    // createWorldImagery,
    createTileMapServiceImageryProvider,
    Globe,
    // Moon,
    Scene,
    SceneMode,
    ShadowMode,
    SkyAtmosphere,
    // SkyBox,
    // Sun,
    getElement
) {
    'use strict';

    function CesiumWidget(container, options) {
        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }

        container = getElement(container);
        options = defaultValue(options, {});

        //Configure the widget DOM elements
        var element = document.createElement('div');
        element.className = 'cesium-widget';
        container.appendChild(element);

        var canvas = document.createElement('canvas');
        var supportsImageRenderingPixelated = FeatureDetection.supportsImageRenderingPixelated();
        this._supportsImageRenderingPixelated = supportsImageRenderingPixelated;
        if (supportsImageRenderingPixelated) {
            canvas.style.imageRendering = FeatureDetection.imageRenderingValue();
        }
        canvas.oncontextmenu = function() {
            return false;
        };
        canvas.onselectstart = function() {
            return false;
        };
        element.appendChild(canvas);

        var innerCreditContainer = document.createElement('div');
        innerCreditContainer.className = 'cesium-widget-credits';

        var creditContainer = defined(options.creditContainer) ? getElement(options.creditContainer) : element;
        creditContainer.appendChild(innerCreditContainer);

        var creditViewport = defined(options.creditViewport) ? getElement(options.creditViewport) : element;

        var showRenderLoopErrors = defaultValue(options.showRenderLoopErrors, true);

        this._element = element;
        this._container = container;
        this._canvas = canvas;
        this._canvasWidth = 0;
        this._canvasHeight = 0;
        this._creditViewport = creditViewport;
        this._creditContainer = creditContainer;
        this._innerCreditContainer = innerCreditContainer;
        this._canRender = false;
        this._renderLoopRunning = false;
        this._showRenderLoopErrors = showRenderLoopErrors;
        this._resolutionScale = 1.0;
        this._forceResize = false;
        this._clock = defined(options.clock) ? options.clock : new Clock();

        configureCanvasSize(this);

        // Scene
        try {
            var scene = new Scene({
                canvas : canvas,
                contextOptions : options.contextOptions,
                creditContainer : innerCreditContainer,
                creditViewport: creditViewport,
                mapProjection : options.mapProjection,
                orderIndependentTranslucency : options.orderIndependentTranslucency,
                scene3DOnly : defaultValue(options.scene3DOnly, false),
                terrainExaggeration : options.terrainExaggeration,
                shadows : options.shadows,
                mapMode2D : options.mapMode2D,
                requestRenderMode : options.requestRenderMode,
                maximumRenderTimeChange : options.maximumRenderTimeChange
            });
            this._scene = scene;

            scene.camera.constrainedAxis = Cartesian3.UNIT_Z;

            configureCameraFrustum(this);

            var ellipsoid = defaultValue(scene.mapProjection.ellipsoid, Ellipsoid.WGS84);

            var globe = options.globe;
            if (!defined(globe)) {
                globe = new Globe(ellipsoid);
            }
            if (globe !== false) {
                scene.globe = globe;
                scene.globe.shadows = defaultValue(options.terrainShadows, ShadowMode.RECEIVE_ONLY);
            }

            // TODO
            /*var skyBox = options.skyBox;
            if (!defined(skyBox)) {
                skyBox = new SkyBox({
                    sources : {
                        positiveX : getDefaultSkyBoxUrl('px'),
                        negativeX : getDefaultSkyBoxUrl('mx'),
                        positiveY : getDefaultSkyBoxUrl('py'),
                        negativeY : getDefaultSkyBoxUrl('my'),
                        positiveZ : getDefaultSkyBoxUrl('pz'),
                        negativeZ : getDefaultSkyBoxUrl('mz')
                    }
                });
            }
            if (skyBox !== false) {
                scene.skyBox = skyBox;
                scene.sun = new Sun();
                scene.moon = new Moon();
            }*/

            // Blue sky, and the glow around the Earth's limb.
            var skyAtmosphere = options.skyAtmosphere;
            if (!defined(skyAtmosphere)) {
                skyAtmosphere = new SkyAtmosphere(ellipsoid);
            }
            if (skyAtmosphere !== false) {
                scene.skyAtmosphere = skyAtmosphere;
            }

            //Set the base imagery layer
            var imageryProvider = (options.globe === false) ? false : options.imageryProvider;
            if (!defined(imageryProvider)) {
                // imageryProvider = createWorldImagery();
                imageryProvider = new createTileMapServiceImageryProvider({
                    url: buildModuleUrl('Assets/Textures/NaturalEarthII')
                });
            }

            if (imageryProvider !== false) {
                scene.imageryLayers.addImageryProvider(imageryProvider);
            }

            //Set the terrain provider if one is provided.
            if (defined(options.terrainProvider) && options.globe !== false) {
                scene.terrainProvider = options.terrainProvider;
            }

            this._screenSpaceEventHandler = new ScreenSpaceEventHandler(canvas, false);

            if (defined(options.sceneMode)) {
                if (options.sceneMode === SceneMode.SCENE2D) {
                    this._scene.morphTo2D(0);
                }
                if (options.sceneMode === SceneMode.COLUMBUS_VIEW) {
                    this._scene.morphToColumbusView(0);
                }
            }

            this._useDefaultRenderLoop = undefined;
            this.useDefaultRenderLoop = defaultValue(options.useDefaultRenderLoop, true);

            this._targetFrameRate = undefined;
            this.targetFrameRate = options.targetFrameRate;

            var that = this;
            scene.renderError.addEventListener(function(scene, error) {
                that._useDefaultRenderLoop = false;
                that._renderLoopRunning = false;
                if (that._showRenderLoopErrors) {
                    var title = 'An error occurred while rendering.  Rendering has stopped.';
                    that.showErrorPanel(title, undefined, error);
                }
            });
        }
        catch (error) {
            if (showRenderLoopErrors) {
                var title = 'Error constructing CesiumWidget.';
                var message = 'Visit <a href="http://get.webgl.org">http://get.webgl.org</a> to verify that your web browser and hardware support WebGL.  Consider trying a different web browser or updating your video drivers.  Detailed error information is below:';
                this.showErrorPanel(title, message, error);
            }
            throw error;
        }
    }

    defineProperties(CesiumWidget.prototype, {
        container : {
            get : function() {
                return this._container;
            }
        },

        canvas : {
            get : function() {
                return this._canvas;
            }
        },

        creditContainer: {
            get : function() {
                return this._creditContainer;
            }
        },

        creditViewport: {
            get: function() {
                return this._creditViewport;
            }
        },

        scene : {
            get : function() {
                return this._scene;
            }
        },

        imageryLayers : {
            get : function() {
                return this._scene.imageryLayers;
            }
        },

        terrainProvider : {
            get : function() {
                return this._scene.terrainProvider;
            },
            set : function(terrainProvider) {
                this._scene.terrainProvider = terrainProvider;
            }
        },

        camera : {
            get : function() {
                return this._scene.camera;
            }
        },

        clock : {
            get : function() {
                return this._clock;
            }
        },

        screenSpaceEventHandler : {
            get : function() {
                return this._screenSpaceEventHandler;
            }
        },

        targetFrameRate : {
            get : function() {
                return this._targetFrameRate;
            },
            set : function(value) {
                //>>includeStart('debug', pragmas.debug);
                if (value <= 0) {
                    throw new DeveloperError('targetFrameRate must be greater than 0, or undefined.');
                }
                //>>includeEnd('debug');
                this._targetFrameRate = value;
            }
        },

        useDefaultRenderLoop : {
            get : function() {
                return this._useDefaultRenderLoop;
            },
            set : function(value) {
                if (this._useDefaultRenderLoop !== value) {
                    this._useDefaultRenderLoop = value;
                    if (value && !this._renderLoopRunning) {
                        startRenderLoop(this);
                    }
                }
            }
        },

        resolutionScale : {
            get : function() {
                return this._resolutionScale;
            },
            set : function(value) {
                //>>includeStart('debug', pragmas.debug);
                if (value <= 0) {
                    throw new DeveloperError('resolutionScale must be greater than 0.');
                }
                //>>includeEnd('debug');
                this._resolutionScale = value;
                this._forceResize = true;
            }
        }
    });

    CesiumWidget.prototype.showErrorPanel = function(title, message, error) {
        var element = this._element;
        var overlay = document.createElement('div');
        overlay.className = 'cesium-widget-errorPanel';

        var content = document.createElement('div');
        content.className = 'cesium-widget-errorPanel-content';
        overlay.appendChild(content);

        var errorHeader = document.createElement('div');
        errorHeader.className = 'cesium-widget-errorPanel-header';
        errorHeader.appendChild(document.createTextNode(title));
        content.appendChild(errorHeader);

        var errorPanelScroller = document.createElement('div');
        errorPanelScroller.className = 'cesium-widget-errorPanel-scroll';
        content.appendChild(errorPanelScroller);
        function resizeCallback() {
            errorPanelScroller.style.maxHeight = Math.max(Math.round(element.clientHeight * 0.9 - 100), 30) + 'px';
        }
        resizeCallback();
        if (defined(window.addEventListener)) {
            window.addEventListener('resize', resizeCallback, false);
        }

        if (defined(message)) {
            var errorMessage = document.createElement('div');
            errorMessage.className = 'cesium-widget-errorPanel-message';
            errorMessage.innerHTML = '<p>' + message + '</p>';
            errorPanelScroller.appendChild(errorMessage);
        }

        var errorDetails = '(no error details available)';
        if (defined(error)) {
            errorDetails = formatError(error);
        }

        var errorMessageDetails = document.createElement('div');
        errorMessageDetails.className = 'cesium-widget-errorPanel-message';
        errorMessageDetails.appendChild(document.createTextNode(errorDetails));
        errorPanelScroller.appendChild(errorMessageDetails);

        var buttonPanel = document.createElement('div');
        buttonPanel.className = 'cesium-widget-errorPanel-buttonPanel';
        content.appendChild(buttonPanel);

        var okButton = document.createElement('button');
        okButton.setAttribute('type', 'button');
        okButton.className = 'cesium-button';
        okButton.appendChild(document.createTextNode('OK'));
        okButton.onclick = function() {
            if (defined(resizeCallback) && defined(window.removeEventListener)) {
                window.removeEventListener('resize', resizeCallback, false);
            }
            element.removeChild(overlay);
        };

        buttonPanel.appendChild(okButton);

        element.appendChild(overlay);

        //IE8 does not have a console object unless the dev tools are open.
        if (typeof console !== 'undefined') {
            console.error(title + '\n' + message + '\n' + errorDetails);
        }
    };

    CesiumWidget.prototype.isDestroyed = function() {
        return false;
    };

    CesiumWidget.prototype.dispose = function() {
        this._scene = this._scene && this._scene.dispose();
        this._container.removeChild(this._element);
        this._creditContainer.removeChild(this._innerCreditContainer);
        destroyObject(this);
    };

    CesiumWidget.prototype.resize = function() {
        var canvas = this._canvas;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        if (!this._forceResize && this._canvasWidth === width && this._canvasHeight === height) {
            return;
        }
        this._forceResize = false;

        configureCanvasSize(this);
        configureCameraFrustum(this);

        this._scene.requestRender();
    };

    CesiumWidget.prototype.render = function() {
        if (this._canRender) {
            this._scene.initializeFrame();
            var currentTime = this._clock.tick();
            this._scene.render(currentTime);
        } else {
            this._clock.tick();
        }
    };

    function startRenderLoop(widget) {
        widget._renderLoopRunning = true;

        var lastFrameTime = 0;
        function render(frameTime) {
            if (widget.isDestroyed()) {
                return;
            }

            if (widget._useDefaultRenderLoop) {
                try {
                    var targetFrameRate = widget._targetFrameRate;
                    if (!defined(targetFrameRate)) {
                        widget.resize();
                        widget.render();
                        requestAnimationFrame(render);
                    } else {
                        var interval = 1000.0 / targetFrameRate;
                        var delta = frameTime - lastFrameTime;

                        if (delta > interval) {
                            widget.resize();
                            widget.render();
                            lastFrameTime = frameTime - (delta % interval);
                        }
                        requestAnimationFrame(render);
                    }
                } catch (error) {
                    widget._useDefaultRenderLoop = false;
                    widget._renderLoopRunning = false;
                    if (widget._showRenderLoopErrors) {
                        var title = 'An error occurred while rendering.  Rendering has stopped.';
                        widget.showErrorPanel(title, undefined, error);
                    }
                }
            } else {
                widget._renderLoopRunning = false;
            }
        }

        requestAnimationFrame(render);
    }

    function configureCanvasSize(widget) {
        var canvas = widget._canvas;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        var resolutionScale = widget._resolutionScale;
        if (!widget._supportsImageRenderingPixelated) {
            resolutionScale *= defaultValue(window.devicePixelRatio, 1.0);
        }

        widget._canvasWidth = width;
        widget._canvasHeight = height;

        width *= resolutionScale;
        height *= resolutionScale;

        canvas.width = width;
        canvas.height = height;

        widget._canRender = width !== 0 && height !== 0;
    }

    function configureCameraFrustum(widget) {
        var canvas = widget._canvas;
        var width = canvas.width;
        var height = canvas.height;
        if (width !== 0 && height !== 0) {
            var frustum = widget._scene.camera.frustum;
            if (defined(frustum.aspectRatio)) {
                frustum.aspectRatio = width / height;
            } else {
                frustum.top = frustum.right * (height / width);
                frustum.bottom = -frustum.top;
            }
        }
    }

    return CesiumWidget;
});
