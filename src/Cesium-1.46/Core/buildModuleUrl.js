define([
    '../ThirdParty/Uri',
    './DeveloperError',
], function (
    Uri,
    DeveloperError,
) {
    "use strict";

    /*global CESIUM_BASE_URL*/

    // 根据相对路径获取绝对路径
    let BuildModuleUrl = function (moduleID) {
        let implementation = buildModuleUrlFromBaseUrl;
        let a = document.createElement('a');
        let url = implementation(moduleID);

        a.href = url;
        a.href = a.href; // IE only absolutizes href on get, not set

        return a.href;
    };

    let cesiumScriptRegex = /((?:.*\/)|^)cesium[\w-]*\.js(?:\W|$)/i;

    BuildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;

    //============================================================================

    function buildModuleUrlFromBaseUrl(moduleID) {
        return new Uri(moduleID).resolve(getCesiumBaseUrl()).toString();
    }

    function getCesiumBaseUrl() {
        let baseUrlString;

        if (typeof CESIUM_BASE_URL !== 'undefined') {
            baseUrlString = CESIUM_BASE_URL;
        } else {
            baseUrlString = 'source/';
        }

        if (!baseUrlString) {
            throw new DeveloperError('Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
        }

        let baseUrl = new Uri(baseUrlString).resolve(new Uri(document.location.href));

        return baseUrl;
    }

    /*function getBaseUrlFromCesiumScript() {
        let scripts = document.getElementsByTagName('script');

        for (let i = 0, len = scripts.length; i < len; ++i) {
            let src = scripts[i].getAttribute('src');
            let result = cesiumScriptRegex.exec(src);
            if (result !== null) {
                return result[1];
            }
        }
        return undefined;
    }*/

    return BuildModuleUrl;
});