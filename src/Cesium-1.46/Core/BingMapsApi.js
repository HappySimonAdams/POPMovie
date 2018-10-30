define([
    './defined'
], function(
    defined
) {
    'use strict';

    var BingMapsApi = {};

    // BingMapsApi.defaultKey = 'Ar9n20kTp-N8tEg3Dpx-Pgocmx3W0-GUnD_Bgt3h8g6pSeDL8yxByTVGHyMyjI2p';
    BingMapsApi.defaultKey = 'ArLWvxLVAh1vxsmDZuOxr94On14sA52a_IPUewEz8H7mm3qDQnjWe-OzJtu1PZpZ';

    BingMapsApi.getKey = function(providedKey) {
        if (defined(providedKey)) {
            return providedKey;
        }

        return BingMapsApi.defaultKey;
    };

    return BingMapsApi;
});
