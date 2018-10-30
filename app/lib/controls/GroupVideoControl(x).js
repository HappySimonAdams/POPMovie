import {ConstantConfig} from "../config/ConstantConfig";
import {TWEEN, tweenObj} from "../components/tweenObj";

function GroupVideoControl(scene, camera, renderer, videoData) {
    let mouse = new THREE.Vector2(),
        raycaster = new THREE.Raycaster(),
        activeMesh,             // 鼠标点击时的mesh,
        movedMesh,              // 要移动的mesh
        activeVideo,            // 当前要播放的视频
        lastIndex = 0,          // 切换mesh时，保存上一个mesh的index值作为比较
        canSwitchMesh = true,   // 是否可以移动
        isVideoPlay = false,
        isIntersected = false,  // 判断射线(raycaster)是否与sphereVideo交叉
        isUserInteracting = false,
        isKeyboradPause = false,// 是否按下空格键暂停
        mouseX = 0,
        mouseY = 0,
        offsetX = 0,
        offsetY = 0,
        container = renderer.domElement,
        leftSlideIndex = Number($('#threeContainer .left').attr('slide-index')),
        rightSlideIndex = Number($('#threeContainer .right').attr('slide-index'));

    container.addEventListener('click', clickToSplitFunc, false);
    container.addEventListener('mousedown', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('touchstart', onTouchStart, false);
    container.addEventListener('touchmove', onTouchMove, false);
    container.addEventListener('touchend', onTouchEnd, false);
    window.addEventListener('keydown', onkeyDown, false);

    $('#threeContainer').on('click', '.back', quit);

    function clickToSplitFunc(e) {
        mouse.x = (e.clientX / container.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / container.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(scene.children);
        // if (intersects.length == 1) {
        if (intersects.length > 0) {
            movedMesh = intersects[0].object;

            if (movedMesh.index != lastIndex) {
                if (canSwitchMesh) {    // 防止进入全屏的时候进行mesh的切换
                    clickToSwitchMesh(movedMesh.index);
                }
            } else {
                isIntersected = true;
                activeMesh = intersects[0].object;
                clickToFullScreen(activeMesh);
            }
        }
    }

    function clickToSwitchMesh(index) {
        if (index > lastIndex) {            // 右移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x - ConstantConfig.MeshGap, 0, -900], 200);
            });
        } else if (index < lastIndex) {     // 左移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x + ConstantConfig.MeshGap, 0, -900], 200);
            });
        } else {
            // index = lastIndex
        }

        // 当选择一组中最后一个，且不是最后一页数据时，向右换页按钮才显示
        if (index === (videoData.length-1) && rightSlideIndex < (videoData.length-1)) {
            $('#threeContainer .right').show();
        } else {
            $('#threeContainer .right').hide();
        }

        // 当选择一组中第一个，且不是第一页数据时，向左换页按钮才显示
        if (index === 0 && leftSlideIndex > 0) {
            $('#threeContainer .left').show();
        } else {
            $('#threeContainer .left').hide();
        }

        $('#threeContainer .name').html(videoData.names[index]);
        // $('#threeContainer .navigate').attr('data-lon', lonList[index]);
        // $('#threeContainer .navigate').attr('data-lat', latList[index]);

        lastIndex = index;
    }

    function clickToFullScreen(mesh) {
        activeVideo = videoData.videos[mesh.index];

        if (!isKeyboradPause) { // 防止在暂停时点击sphereVideo自动播放
            activeVideo.play();
            isVideoPlay = true;
        }

        canSwitchMesh = false;  // 进入全屏播放之后不能切换mesh

        tweenObj(mesh, [0, 0, 0], 800);

        $('#threeContainer').addClass('drawCursor');
        $('#threeContainer .name').hide();
        $('#threeContainer .toolbar').hide();
        $('#threeContainer .back').show();
    }

    function onMouseDown(e) {
        if (!isIntersected) return;

        isUserInteracting = true;

        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function onMouseMove(e) {
        if (!isUserInteracting) return;

        offsetX = e.clientX - mouseX;
        offsetY = e.clientY - mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        activeMesh.rotation.y += offsetX * 0.005;
        activeMesh.rotation.x += offsetY * 0.005;
        if (activeMesh.rotation.x >= Math.PI/2) {
            activeMesh.rotation.x = Math.PI/2;
        }
        if (activeMesh.rotation.x <= -Math.PI/2) {
            activeMesh.rotation.x = -Math.PI/2;
        }
    }

    function onMouseUp(e) {
        isUserInteracting = false;
        mouseX = 0;
        mouseY = 0;
        offsetX = 0;
        offsetY = 0;
    }

    function onTouchStart(e) {
        if (!isIntersected) return;

        isUserInteracting = true;

        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }

    function onTouchMove(e) {
        if (!isUserInteracting) return;

        offsetX = e.touches[0].clientX - mouseX;
        offsetY = e.touches[0].clientY - mouseY;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        activeMesh.rotation.y += offsetX * 0.005;
        activeMesh.rotation.x += offsetY * 0.005;
        if (activeMesh.rotation.x >= Math.PI/2) {
            activeMesh.rotation.x = Math.PI/2;
        }
        if (activeMesh.rotation.x <= -Math.PI/2) {
            activeMesh.rotation.x = -Math.PI/2;
        }
    }

    function onTouchEnd(e) {
        isUserInteracting = false;
        mouseX = 0;
        mouseY = 0;
        offsetX = 0;
        offsetY = 0;
    }

    function onkeyDown(e) {
        if (!isIntersected) return;

        if (e.keyCode == 32) {  // space (暂停/播放)
            if (isVideoPlay) {
                activeVideo.pause();
            } else {
                activeVideo.play();
            }

            isVideoPlay = !isVideoPlay;
            isKeyboradPause = true;
        }
        if (e.keyCode == 27) {  // esc (退出)
            quit();
        }
    }

    function quit() {
        if (isVideoPlay) {
            activeVideo.pause();
        }
        tweenObj(activeMesh, [0, 0, -900], 800);

        $('#threeContainer').removeClass('drawCursor');
        $('#threeContainer .name').fadeIn(1200);
        $('#threeContainer .toolbar').fadeIn(1200);
        $('#threeContainer .back').hide();

        canSwitchMesh = true;
        isVideoPlay = false;
        isIntersected = false;
        isKeyboradPause = false;
    }

    this.update = function () {
        TWEEN.update();
    };

    this.dispose = function () {
        container.removeEventListener('click', clickToSplitFunc, false);
        container.removeEventListener('mousedown', onMouseDown, false);
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('touchstart', onTouchStart, false);
        container.removeEventListener('touchmove', onTouchMove, false);
        container.removeEventListener('touchend', onTouchEnd, false);
    };
}

export {GroupVideoControl};