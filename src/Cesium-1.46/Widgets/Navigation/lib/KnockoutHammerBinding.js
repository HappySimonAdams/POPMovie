define([
    '../Third/hammer'
], function (
    hammer
) {
    var KnockouthammerBinding = {
        register: function (Knockout) {
            Knockout.bindingHandlers.swipeLeft = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var f = Knockout.unwrap(valueAccessor());
                    new hammer(element).on('swipeleft', function (e) {
                        var viewModel = bindingContext.$data;
                        f.apply(viewModel, arguments);
                    });
                }
            };

            Knockout.bindingHandlers.swipeRight = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var f = Knockout.unwrap(valueAccessor());
                    new hammer(element).on('swiperight', function (e) {
                        var viewModel = bindingContext.$data;
                        f.apply(viewModel, arguments);
                    });
                }
            };
        }
    };

    return KnockouthammerBinding;
});

