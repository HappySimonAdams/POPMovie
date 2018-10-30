import {ConstantConfig} from "./config/ConstantConfig";
import {viewer} from './viewer';

$(window).keydown(function (e) {
    if (e.keyCode === 13) geocode();    // enter
});

function geocode() {
    let value = $('#location').val();
    if(/^\s*$/.test(value)) return;

    Cesium.Resource.fetchJsonp({
        url: 'http://dev.virtualearth.net/REST/v1/Locations',
        queryParameters: {
            query: value,
            key: Cesium.BingMapsApi.getKey()
        },
        callbackParameterName: 'jsonp'
    }).then(function (result) {
        if (result.resourceSets.length === 0) {
            value += ' (未发现)';
            $('#location').val(value);
            return;
        }

        let resourceSet = result.resourceSets[0];
        if (resourceSet.resources.length === 0) {
            value += ' (未发现)';
            $('#location').val(value);
            return;
        }

        let resource = resourceSet.resources[0];
        value = resource.name;
        let bbox = resource.bbox;

        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(bbox[1], bbox[0], bbox[3], bbox[2]),
            duration: ConstantConfig.flyDuration
        });
    });
};