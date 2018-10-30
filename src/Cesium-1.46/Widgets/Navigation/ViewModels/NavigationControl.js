define([
    './UserInterfaceControl'
], function (
    UserInterfaceControl
) {
    var NavigationControl = function (terria) {
        UserInterfaceControl.apply(this, arguments);
    };

    NavigationControl.prototype = Object.create(UserInterfaceControl.prototype);

    return NavigationControl;
});
