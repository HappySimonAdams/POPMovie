import {ConstantConfig} from "./config/ConstantConfig";
import {viewer} from "./viewer";

let pinBuilder = new Cesium.PinBuilder();

// 二维数组
ConstantConfig.data.content.forEach(function (content) {
    content.forEach(function (data) {
        Cesium.when(pinBuilder.fromMakiIconId('star', ConstantConfig.markColor, ConstantConfig.markSize), function (canvas) {
            var entity = viewer.entities.add({
                position: new Cesium.Cartesian3.fromDegrees(data.lon, data.lat),
                billboard: {
                    image: canvas.toDataURL()
                }
            });
            entity.name = data.name;
            entity.videoUrl = data.video;
        });
    });
});