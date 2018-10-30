define([
    '../../Core/defined',
    '../../Core/defineProperties',
    '../../Core/DeveloperError',
    '../../Core/Event',
    '../../ThirdParty/knockout',
    './lib/KnockoutMarkdownBinding',
    './lib/KnockoutHammerBinding',
    './lib/SvgPathBindingHandler',
    './ViewModels/DistanceLegendViewModel',
    './ViewModels/NavigationViewModel'
], function (
    defined,
    defineProperties,
    DeveloperError,
    Event,
    knockout,
    KnockoutMarkdownBinding,
    KnockoutHammerBinding,
    SvgPathBindingHandler,
    DistanceLegendViewModel,
    NavigationViewModel
) {
    var Navigation = function (viewerCesiumWidget, options) {
        this.distanceLegendViewModel = undefined;
        this.navigationViewModel = undefined;
        this.navigationDiv = undefined;
        this.distanceLegendDiv = undefined;
        this.terria = undefined;
        this.container = undefined;
        this._onDestroyListeners = [];

        if (!defined(viewerCesiumWidget)) {
            throw new DeveloperError('viewer or viewer.cesiumWidget is required.');
        }

        var cesiumWidget = defined(viewerCesiumWidget.cesiumWidget) ? viewerCesiumWidget.cesiumWidget : viewerCesiumWidget;

        var container = document.createElement('div');
        container.className = 'cesium-widget-cesiumNavigationContainer';
        cesiumWidget.container.appendChild(container);

        this.terria = viewerCesiumWidget;
        this.terria.options = (defined(options)) ? options : {};
        this.terria.afterWidgetChanged = new Event();
        this.terria.beforeWidgetChanged = new Event();
        this.container = container;

        //If you're not using the TerriaJS user interface, you can remove this.
        {
            SvgPathBindingHandler.register(knockout);
            KnockoutMarkdownBinding.register(knockout);
            KnockoutHammerBinding.register(knockout);

            knockout.bindingHandlers.embeddedComponent = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var component = knockout.unwrap(valueAccessor());
                    component.show(element);
                    return {
                        controlsDescendantBindings: true
                    };
                },
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                }
            };
        }

        if (!defined(this.terria.options.enableDistanceLegend) || this.terria.options.enableDistanceLegend) {
            this.distanceLegendDiv = document.createElement('div');
            container.appendChild(this.distanceLegendDiv);
            this.distanceLegendDiv.setAttribute("id", "distanceLegendDiv");
            this.distanceLegendViewModel = DistanceLegendViewModel.create({
                container: this.distanceLegendDiv,
                terria: this.terria,
                mapElement: container,
                enableDistanceLegend: true
            });
        }

        if ((!defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (!defined(this.terria.options.enableCompass) || this.terria.options.enableCompass)) {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: true,
                enableCompass: true
            });
        } else if ((defined(this.terria.options.enableZoomControls) && !this.terria.options.enableZoomControls) && (!defined(this.terria.options.enableCompass) || this.terria.options.enableCompass)) {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: false,
                enableCompass: true
            });
        } else if ((!defined(this.terria.options.enableZoomControls) || this.terria.options.enableZoomControls) && (defined(this.terria.options.enableCompass) && !this.terria.options.enableCompass)) {
            this.navigationDiv = document.createElement('div');
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: true,
                enableCompass: false
            });
        } else if ((defined(this.terria.options.enableZoomControls) && !this.terria.options.enableZoomControls) && (defined(this.terria.options.enableCompass) && !this.terria.options.enableCompass)) {
            this.navigationDiv.setAttribute("id", "navigationDiv");
            container.appendChild(this.navigationDiv);
            this.navigationViewModel = NavigationViewModel.create({
                container: this.navigationDiv,
                terria: this.terria,
                enableZoomControls: false,
                enableCompass: false
            });
        }
    };
    Navigation.prototype.dispose = function () {
        if (defined(this.navigationViewModel)) {
            this.navigationViewModel.dispose();
        }
        if (defined(this.distanceLegendViewModel)) {
            this.distanceLegendViewModel.dispose();
        }

        if (defined(this.navigationDiv)) {
            this.navigationDiv.parentNode.removeChild(this.navigationDiv);
        }
        delete this.navigationDiv;

        if (defined(this.distanceLegendDiv)) {
            this.distanceLegendDiv.parentNode.removeChild(this.distanceLegendDiv);
        }
        delete this.distanceLegendDiv;

        if (defined(this.container)) {
            this.container.parentNode.removeChild(this.container);
        }
        delete this.container;

        for (var i = 0; i < this._onDestroyListeners.length; i++) {
            this._onDestroyListeners[i]();
        }
    };

    var NavigationMixin = function (viewer, options) {
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }

        var navigation = new Navigation(viewer, options);

        //Access cesiumNavigation by {viewer.cesiumNavigation} or {viewer.cesiumWidget.cesiumNavigation}
        var cesiumWidget = defined(viewer.cesiumWidget) ? viewer.cesiumWidget : viewer;

        //NOTE: the prototype is cesiumWidget
        defineProperties(cesiumWidget, {
            cesiumNavigation: {
                get: function () {
                    return navigation;
                }
            }
        });
    };

    return NavigationMixin;
});

