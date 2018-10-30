import {ConstantConfig} from "../config/ConstantConfig";
import {TWEEN, tweenObj} from "../components/tweenObj";

function GroupVideoControl(scene, camera, renderer, videoData) {
    let mouse = new THREE.Vector2(),
        raycaster = new THREE.Raycaster(),
        currentMesh = scene.children[0],
        currentMeshIndex = 0,
        currentVideo,
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

    container.addEventListener('click', onClick, false);
    container.addEventListener('mousedown', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('touchstart', onTouchStart, false);
    container.addEventListener('touchmove', onTouchMove, false);
    container.addEventListener('touchend', onTouchEnd, false);
    window.addEventListener('keydown', onkeyDown, false);

    $('#threeContainer').on('click', '.back', quit);

    function onClick(e) {
        mouse.x = (e.clientX / container.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / container.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            let mesh = intersects[0].object;

            if (mesh.index !== currentMeshIndex) {
                if (canSwitchMesh) {
                    switchMesh(mesh);
                }
            } else {
                isIntersected = true;
                playVideo();
            }
        }
    }

    function switchMesh(mesh) {
        var index = mesh.index;

        if (index > currentMeshIndex) { // 左移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x - ConstantConfig.MeshGap, 0, -900], 200);
            });
            currentMeshIndex++;
        } else if (index < currentMeshIndex) {  // 右移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x + ConstantConfig.MeshGap, 0, -900], 200);
            });
            currentMeshIndex--;
        }

        currentMesh = mesh;

        setPageCtrlAndName();
    }

    // 设置左右翻页按钮的show/hide
    function setPageCtrlAndName() {
        // 当选择一组中最后一个，且不是最后一页数据时，向右换页按钮才显示
        if (currentMeshIndex === (videoData.length-1) && rightSlideIndex < (videoData.length-1)) {
            $('#threeContainer .right').show();
        } else {
            $('#threeContainer .right').hide();
        }

        // 当选择一组中第一个，且不是第一页数据时，向左换页按钮才显示
        if (currentMeshIndex === 0 && leftSlideIndex > 0) {
            $('#threeContainer .left').show();
        } else {
            $('#threeContainer .left').hide();
        }

        // 切换名称
        $('#threeContainer .name').html(videoData.names[currentMeshIndex]);
    }

    /*function switchMesh() {
        var index = movedMesh.index;

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

        lastIndex = index;
    }*/

    function playVideo() {
        currentVideo = videoData.videos[currentMeshIndex];

        if (!isKeyboradPause) { // 防止在暂停时点击sphereVideo自动播放
            currentVideo.play();
            isVideoPlay = true;
        }

        canSwitchMesh = false;  // 进入全屏播放之后不能切换mesh

        tweenObj(currentMesh, [0, 0, 0], 800);

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
        currentMesh.rotation.y += offsetX * 0.005;
        currentMesh.rotation.x += offsetY * 0.005;
        if (currentMesh.rotation.x >= Math.PI/2) {
            currentMesh.rotation.x = Math.PI/2;
        }
        if (currentMesh.rotation.x <= -Math.PI/2) {
            currentMesh.rotation.x = -Math.PI/2;
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
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;

        if (isIntersected) {    // 对单个sphereVideo的交互
            isUserInteracting = true;
        }
    }

    function onTouchMove(e) {
        offsetX = e.touches[0].clientX - mouseX;
        offsetY = e.touches[0].clientY - mouseY;

        if (isUserInteracting) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            currentMesh.rotation.y += offsetX * 0.005;
            currentMesh.rotation.x += offsetY * 0.005;
            if (currentMesh.rotation.x >= Math.PI/2) {
                currentMesh.rotation.x = Math.PI/2;
            }
            if (currentMesh.rotation.x <= -Math.PI/2) {
                currentMesh.rotation.x = -Math.PI/2;
            }
        }
    }

    function onTouchEnd(e) {
        moveMesh(offsetX);
        isUserInteracting = false;
        mouseX = 0;
        mouseY = 0;
        offsetX = 0;
        offsetY = 0;
    }

    function moveMesh(offset) {
        if (offset > 100 && currentMeshIndex > 0) {    // 右移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x + ConstantConfig.MeshGap, 0, -900], 200);
            });
            currentMeshIndex--;
        } else if (offset < -100 && currentMeshIndex < videoData.length-1) {    // 左移
            scene.children.forEach(function (mesh) {
                tweenObj(mesh, [mesh.position.x - ConstantConfig.MeshGap, 0, -900], 200);
            });
            currentMeshIndex++;
        }

        currentMesh = scene.children[currentMeshIndex];

        setPageCtrlAndName()
    }

    function onkeyDown(e) {
        if (!isIntersected) return;

        if (e.keyCode == 32) {  // space (暂停/播放)
            if (isVideoPlay) {
                currentVideo.pause();
            } else {
                currentVideo.play();
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
            currentVideo.pause();
        }
        tweenObj(currentMesh, [0, 0, -900], 800);

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
        container.removeEventListener('click', onClick, false);
        container.removeEventListener('mousedown', onMouseDown, false);
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('touchstart', onTouchStart, false);
        container.removeEventListener('touchmove', onTouchMove, false);
        container.removeEventListener('touchend', onTouchEnd, false);
    };
}

export {GroupVideoControl};