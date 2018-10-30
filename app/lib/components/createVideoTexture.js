function createVideoTexture(video) {
    let texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.maxFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    return texture;
}

export {createVideoTexture};