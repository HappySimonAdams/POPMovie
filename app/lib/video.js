import {createVideoElement} from "./components/createVideoElement";
import {createVideoTexture} from "./components/createVideoTexture";
// import {DefaultVideoTexture} from "./components/defaultVideoTexture";
import {ConstantConfig} from "./config/ConstantConfig";
import {SingleImageControl} from "./controls/SingleImageControl";
import {SingleVideoControl} from "./controls/SingleVideoControl";
import {GroupVideoControl} from "./controls/GroupVideoControl";

//============================================================================

let container = document.getElementById('threeContainer');

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x323232);

let renderer = new THREE.WebGLRenderer({antialias: true});

let control, requestFrame;

let geometry = new THREE.SphereBufferGeometry(500, 60, 40);
geometry.scale(-1, 1, 1);

let material = new THREE.MeshBasicMaterial({
    color: ConstantConfig.videoSphereColor
    // map: DefaultVideoTexture
});

//============================================================================

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function renderScene() {
    requestFrame = window.requestAnimationFrame(renderScene);

    if (Cesium.defined(control)) {
        control.update();
    }

    renderer.render(scene, camera);
}

//============================================================================

// SingleVideo Instance
function SingleVideo(name, videoUrl/*, lon, lat*/) {
    this.name = name;
    this.url = videoUrl;

    this.init();
}

SingleVideo.prototype.init = function () {
    let self = this;

    $('#threeContainer').html(`
        <div class="name">${self.name}</div>
        <div class="toolbar">
            <div class="navigate""><img src="./resource/image/mark.png"/></div>
            <div class="close">&times;</div>
        </div>
        <div class="mask"></div>    <!--防止移动端click事件穿透的mask-->
        <div class="back">&times;</div> <!--退出全屏播放-->
        <div id="loading"><img src="./resource/image/loading.gif"/></div>
    `);

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -900);
    scene.add(mesh);

    let video = createVideoElement(self.url);
    let texture = createVideoTexture(video);

    $('#loading').show();
    video.addEventListener('canplay', () => {
        mesh.material = new THREE.MeshBasicMaterial({map: texture});
        $('#loading').hide();
    });

    control = new SingleVideoControl(scene, camera, renderer, mesh, video);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderScene();
};

SingleVideo.prototype.dispose = function () {
    scene.children = [];
    // container.removeChild(renderer.domElement);
    $('#threeContainer').empty();
    control.dispose();

    if (Cesium.defined(requestFrame)) {
        window.cancelAnimationFrame(requestFrame);
    }
};

//============================================================================

// GroupVideo Instance
function GroupVideo() {
    this.init();
}

GroupVideo.prototype.init = function () {
    $('#threeContainer').html(`
        <div class="name">${ConstantConfig.data.content[0][0].name}</div>
        <div class="toolbar">
            <div class="navigate"><img src="./resource/image/mark.png"/></div>
            <div class="close">&times;</div>
        </div>
        <div class="back">&times;</div> <!--退出全屏播放-->
        <div class="sliderCtrl left">&lt;</div>
        <div class="sliderCtrl right">&gt;</div>
    `);

    let videoData = {
        length: 0,
        names: [],
        videos: []
    };

    // 初始化时添加自定义属性，以便之后的切换控制
    $('#threeContainer .left').attr('slide-index', 0);
    $('#threeContainer .right').attr('slide-index', 1);

    // 初始化第一组数据
    traverseData(ConstantConfig.data.content[0]);
    control = new GroupVideoControl(scene, camera, renderer, videoData);

    function traverseData(content) {
        videoData.length = content.length;

        content.forEach(function (data, index) {
            videoData.names.push(data.name);
            addMesh(index, data.video);
        });
    }

    function addMesh(index, videoUrl) {
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(index * ConstantConfig.MeshGap, 0, -900);
        mesh.index = index;     // 添加index属性(方便索引videos)
        scene.add(mesh);

        let video = createVideoElement(videoUrl);
        let texture = createVideoTexture(video);
        videoData.videos.push(video);

        video.addEventListener('canplay', () => {
            mesh.material = new THREE.MeshBasicMaterial({map: texture});
        });
    }

    // 向右切换按钮
    $('#threeContainer').on('click', '.right', function () {
        $('#threeContainer .right').hide();
        $('#threeContainer .left').show();

        let rightSlideIndex = Number($('#threeContainer .right').attr('slide-index'));

        // 表示没有更多数据
        if (rightSlideIndex === ConstantConfig.data.content.pageNum) return;

        let leftSlideIndex = Number($('#threeContainer .left').attr('slide-index'));
        let content = ConstantConfig.data.content[rightSlideIndex];

        $('#threeContainer .name').html(content[0].name);   // 修改每页的第一个名称
        $('#threeContainer .left').attr('slide-index', ++leftSlideIndex);
        $('#threeContainer .right').attr('slide-index', ++rightSlideIndex);

        // reset
        scene.children = [];
        control.dispose();
        videoData.length = 0;
        videoData.names = [];
        videoData.videos = [];

        traverseData(content);
        control = new GroupVideoControl(scene, camera, renderer, videoData);    // 需要重置control
    });

    // 向左切换按钮
    $('#threeContainer').on('click', '.left', function () {
        $('#threeContainer .left').hide();
        let leftSlideIndex = Number($('#threeContainer .left').attr('slide-index'));

        if (leftSlideIndex > 1) {
            $('#threeContainer .left').show();
        }

        // 表示第一页数据
        if (leftSlideIndex === 0) return;

        let rightSlideIndex = Number($('#threeContainer .right').attr('slide-index'));
        let content = ConstantConfig.data.content[leftSlideIndex-1];

        $('#threeContainer .name').html(content[0].name);   // 修改每页的第一个名称
        $('#threeContainer .left').attr('slide-index', --leftSlideIndex);
        $('#threeContainer .right').attr('slide-index', --rightSlideIndex);

        // reset
        scene.children = [];
        control.dispose();
        videoData.length = 0;
        videoData.names = [];
        videoData.videos = [];

        traverseData(content);
        control = new GroupVideoControl(scene, camera, renderer, videoData);    // 需要重置control
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderScene();
};

GroupVideo.prototype.dispose = function () {
    scene.children = [];
    $('#threeContainer').empty();
    control.dispose();

    if (Cesium.defined(requestFrame)) {
        window.cancelAnimationFrame(requestFrame);
    }
};

//============================================================================

// UploadVideo Instance
function UploadVideo() {
    this.init();
}

UploadVideo.prototype.init = function () {
    $('#threeContainer').html(`
        <div class="file">
            <a href="javascript:void()" class="fileBtn">选择文件<input type="file"></a>
        </div>    
        <div class="toolbar">
            <div class="close">&times;</div>
        </div>
        <div class="back">&times;</div> <!--退出全屏播放-->
        <div id="loading"><img src="./resource/image/loading.gif"/></div>
    `);

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -900);
    scene.add(mesh);

    // 上传文件
    $('#threeContainer').on('change', 'input[type=file]', function (e) {
        // let file = e.target.files[0];
        let file = this.files[0];
        let url = window.URL.createObjectURL(file)

        if (file.type === 'video/mp4') {
            initVideo(url);
        } else if (file.type === 'image/jpeg' || file.type === 'image/png') {
            initImage(url);
        } else {
            alert('文件格式不支持');
        }
    });

    function initVideo(url) {
        let video = createVideoElement(url);
        let texture = createVideoTexture(video);

        $('#loading').show();
        video.addEventListener('canplay', () => {
            mesh.material = new THREE.MeshBasicMaterial({map: texture});
            $('#loading').hide();
        });

        control = new SingleVideoControl(scene, camera, renderer, mesh, video);
    }

    function initImage(url) {
        $('#loading').show();
        new THREE.TextureLoader().load(url, (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            mesh.material = new THREE.MeshBasicMaterial({map: texture});
            $('#loading').hide();
        });

        control = new SingleImageControl(scene, camera, renderer, mesh);
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderScene();
};

UploadVideo.prototype.dispose = function () {
    scene.children = [];
    $('#threeContainer').empty();
    control.dispose();

    if (Cesium.defined(requestFrame)) {
        window.cancelAnimationFrame(requestFrame);
    }
};

//============================================================================

export {SingleVideo, GroupVideo, UploadVideo};