/*视频加载完成之前的默认全景图纹理*/

var DefaultVideoTexture = new THREE.TextureLoader().load('./resource/image360/01.jpg')
DefaultVideoTexture.wrapS = THREE.RepeatWrapping;
DefaultVideoTexture.wrapT = THREE.RepeatWrapping;

export {DefaultVideoTexture};
