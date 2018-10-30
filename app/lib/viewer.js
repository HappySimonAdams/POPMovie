import {ConstantConfig} from "./config/ConstantConfig";

let viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.createOpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org'
    })
});
viewer.cesiumWidget.creditContainer.style.display = 'none';
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#323232');     // NOTE: skyBox要设置为false
viewer.scene.requestRenderMode = true;

// viewer.camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(60.0, -20.0, 150.0, 90.0);
// viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(-105, 45, 15e7),
//     duration: ConstantConfig.flyDuration,
//     complete: function () {
//         viewer.camera.flyTo({
//             destination: Cesium.Cartesian3.fromDegrees(105, 35, 18e6),
//             duration: ConstantConfig.flyDuration
//         });
//     }
// });

export {viewer};