import {ConstantConfig} from "./config/ConstantConfig";
import {SingleVideo, GroupVideo, UploadVideo} from './video';
import {viewer} from './viewer';

let singleVideo, groupVideo, uploadVideo;
let addVideoClicked = false;

// 点击地球图标跳转到singleVideo
new Cesium.ScreenSpaceEventHandler(viewer.canvas).setInputAction(function (e) {
    var pick = viewer.scene.pick(e.position);
    if (Cesium.defined(pick) && Cesium.defined(pick.id.billboard)) {
        // 注意：此处在移动端存在click事件穿透的问题(300ms的延迟)
        $('#cesiumContainer').fadeOut(800);
        $('#threeContainer').fadeIn(1000);
        singleVideo = new SingleVideo(pick.id.name, pick.id.videoUrl/*, lon, lat*/);
        $('#threeContainer .mask').hide(300);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);


$('#mark').on('click', function () {
    $('#initContainer').fadeOut(800);
    $('#cesiumContainer').fadeIn(1000);
    // $('#location').attr('autofocus', true);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105, 35, 18e6),
        duration: ConstantConfig.flyDuration
    });
});

$('#videoList').on('click', function () {
    $('#initContainer').fadeOut(800);
    $('#threeContainer').fadeIn(1000);
    groupVideo = new GroupVideo();
});

$('#addVideo').on('click', function () {
    $('#initContainer').fadeOut(800);
    $('#threeContainer').fadeIn(1000);
    uploadVideo = new UploadVideo();
});


$('#cesiumContainer').on('click', '.close', function () {
    $('#cesiumContainer').fadeOut(800);
    $('#initContainer').fadeIn(1000);
});

$('#threeContainer').on('click', '.close', function () {
    $('#threeContainer').fadeOut(800);
    $('#initContainer').fadeIn(1000);

    if (Cesium.defined(singleVideo)) {
        singleVideo.dispose();
        singleVideo = undefined;
    }
    if (Cesium.defined(groupVideo)) {
        groupVideo.dispose();
        groupVideo = undefined;
    }
    if (Cesium.defined(uploadVideo)) {
        uploadVideo.dispose();
        uploadVideo = undefined;
    }
});

$('#threeContainer').on('click', '.navigate', function () {
    $('#threeContainer').fadeOut(800);
    $('#cesiumContainer').fadeIn(1000);

    if (Cesium.defined(singleVideo)) {
        singleVideo.dispose();
        singleVideo = undefined;
    }
    if (Cesium.defined(groupVideo)) {
        groupVideo.dispose();
        groupVideo = undefined;
    }

    /*let lon = $(this).attr('data-lon');
    let lat = $(this).attr('data-lat');
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(Number(lon), Number(lat), 10000),
        duration: ConstantConfig.flyDuration
    });*/

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105, 35, 18e6),
        duration: ConstantConfig.flyDuration
    });
});