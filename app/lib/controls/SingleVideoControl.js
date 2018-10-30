import {TWEEN, tweenObj} from "../components/tweenObj";

function SingleVideoControl(scene, camera, renderer, mesh, video) {
    let mouse = new THREE.Vector2(),
        raycaster = new THREE.Raycaster(),
        isVideoPlay = false,
        isIntersected = false,      // 判断射线(raycaster)是否与sphereVideo交叉
        isUserInteracting = false,  // 是否正在的对sphereVideo进行旋转交互
        isKeyboradPause = false,    // 是否按下空格键暂停
        mouseX = 0,
        mouseY = 0,
        offsetX = 0,
        offsetY = 0,
        container = renderer.domElement;

    container.addEventListener('click', onClick, false);
    container.addEventListener('mousedown', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('touchstart', onTouchStart, false);
    container.addEventListener('touchmove', onTouchMove, false);
    container.addEventListener('touchend', onTouchEnd, false);
    window.addEventListener('keydown', onKeyDown, false);
    
    $('#threeContainer').on('click', '.back', quit);

    function onClick(e) {
        // 将坐标转化为：-1 ~ 1
        mouse.x = (e.clientX / container.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            isIntersected = true;
            start();
        }
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
        mesh.rotation.y += offsetX * 0.005;
        mesh.rotation.x += offsetY * 0.005;
        if (mesh.rotation.x >= Math.PI/2) {
            mesh.rotation.x = Math.PI/2;
        }
        if (mesh.rotation.x <= -Math.PI/2) {
            mesh.rotation.x = -Math.PI/2;
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
        mesh.rotation.y += offsetX * 0.005;
        mesh.rotation.x += offsetY * 0.005;
        if (mesh.rotation.x >= Math.PI/2) {
            mesh.rotation.x = Math.PI/2;
        }
        if (mesh.rotation.x <= -Math.PI/2) {
            mesh.rotation.x = -Math.PI/2;
        }
    }

    function onTouchEnd(e) {
        isUserInteracting = false;
        mouseX = 0;
        mouseY = 0;
        offsetX = 0;
        offsetY = 0;
    }

    function onKeyDown(e) {
        if (!isIntersected) return;

        if (e.keyCode == 32) {  // space (暂停/播放)
            if (isVideoPlay) {
                video.pause();
            } else {
                video.play();
            }

            isVideoPlay = !isVideoPlay;
            isKeyboradPause = true;
        }
        if (e.keyCode == 27) {  // esc (退出)
            quit();
        }
    }

    function start() {
        if (!isKeyboradPause) { // 防止在暂停时点击sphereVideo自动播放
            video.play();
            isVideoPlay = true;
        }

        tweenObj(mesh, [0, 0, 0], 800);

        $('#threeContainer').addClass('drawCursor');
        $('#threeContainer .name').hide();
        $('#threeContainer .file').hide();
        $('#threeContainer .toolbar').hide();
        $('#threeContainer .back').show();
    }

    function quit() {
        if (isVideoPlay) {
            video.pause();
        }

        tweenObj(mesh, [0, 0, -900], 800);

        $('#threeContainer').removeClass('drawCursor');
        $('#threeContainer .name').fadeIn(1200);
        $('#threeContainer .file').fadeIn(1200);
        $('#threeContainer .toolbar').fadeIn(1200);
        $('#threeContainer .back').hide();

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
        container.removeEventListener('mousedown', onTouchStart, false);
        container.removeEventListener('mousemove', onTouchMove, false);
        container.removeEventListener('mouseup', onTouchEnd, false);
        window.removeEventListener('keydown', onKeyDown, false);
    };
}

export {SingleVideoControl};