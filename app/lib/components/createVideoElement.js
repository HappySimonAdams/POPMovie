function createVideoElement(url) {
    let video = document.createElement('video');
    video.setAttribute('preload', 'auto');
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.crossOrigin = 'anonymous';
    video.loop = true;
    // video.poster = './resource/image360/01.jpg';
    video.src = url;
    video.currentTime = 12; // 设置播放的开始时间

    return video;
}

export {createVideoElement};