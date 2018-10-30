// import dataJson from '../../json/data01.json';
// import dataJson from '../../json/data02.json';
// import dataJson from '../../json/data03.json';
// import dataJson from '../../json/data04.json';  // 标清
import dataJson from '../../json/data05.json';  // 高清

let ConstantConfig = {
    markColor: Cesium.Color.ORANGERED,
    markSize: 40,

    videoSphereColor: 0x885DFF, // sphereVideo的默认材质
    MeshGap: 950,   // 两个sphereVideo之间的间隔

    flyDuration: 1.2,

    data: dataJson.data
};

export {ConstantConfig};