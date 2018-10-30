define(function () {
    var svgNS = 'http://www.w3.org/2000/svg';
    var svgClassName = 'cesium-svgPath-svg';

    var SvgPathBindingHandler = {
        register: function (knockout) {
            knockout.bindingHandlers.cesiumSvgPath = {
                init: function (element, valueAccessor) {
                    var svg = document.createElementNS(svgNS, 'svg:svg');
                    svg.setAttribute('class', svgClassName);

                    var pathElement = document.createElementNS(svgNS, 'path');
                    svg.appendChild(pathElement);

                    knockout.virtualElements.setDomNodeChildren(element, [svg]);

                    knockout.computed({
                        read: function () {
                            var value = knockout.unwrap(valueAccessor());

                            pathElement.setAttribute('d', knockout.unwrap(value.path));

                            var pathWidth = knockout.unwrap(value.width);
                            var pathHeight = knockout.unwrap(value.height);

                            svg.setAttribute('width', pathWidth);
                            svg.setAttribute('height', pathHeight);
                            svg.setAttribute('viewBox', '0 0 ' + pathWidth + ' ' + pathHeight);

                            if (value.css) {
                                svg.setAttribute('class', svgClassName + ' ' + knockout.unwrap(value.css));
                            }
                        },
                        disposeWhenNodeIsRemoved: element
                    });

                    return {
                        controlsDescendantBindings: true
                    };
                }
            };

            knockout.virtualElements.allowedBindings.cesiumSvgPath = true;
        }
    };

    return SvgPathBindingHandler;
});
