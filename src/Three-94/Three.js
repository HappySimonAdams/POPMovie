import {LinearFilter, RGBFormat, RepeatWrapping} from  './constants';

import {PerspectiveCamera} from './cameras/PerspectiveCamera';

// import {OrbitControls} from './controls/OrbitControls';

// import {BufferGeometry} from './core/BufferGeometry';
// import {Clock} from './core/Clock';
// import {Object3D} from './core/Object3D';
import {Raycaster} from './core/Raycaster';

// import {BoxGeometry, BoxBufferGeometry} from './geometries/BoxGeometry';
// import {PlaneBufferGeometry} from './geometries/PlaneGeometry';
// import {ShapeBufferGeometry} from './geometries/ShapeGeometry';
import {SphereBufferGeometry} from './geometries/SphereGeometry';
// import {TextBufferGeometry} from './geometries/TextGeometry';

// import {AxesHelper} from './helpers/AxesHelper';
// import {GridHelper} from './helpers/GridHelper';

// import {AmbientLight} from './lights/AmbientLight';
// import {DirectionalLight} from './lights/DirectionalLight';
// import {PointLight} from './lights/PointLight';

// import {CubeTextureLoader} from './loaders/CubeTextureLoader';
// import {FontLoader} from './loaders/FontLoader';
// import {JSONLoader} from "./loaders/JSONLoader";
import {TextureLoader} from './loaders/TextureLoader';

// import {LineBasicMaterial} from './materials/LineBasicMaterial';
import {MeshBasicMaterial} from './materials/MeshBasicMaterial';
// import {MeshLambertMaterial} from './materials/MeshLambertMaterial';
// import {MeshPhongMaterial} from './materials/MeshPhongMaterial';
// import {MeshStandardMaterial} from './materials/MeshStandardMaterial';
// import {PointsMaterial} from './materials/PointsMaterial';
// import {ShaderMaterial} from "./materials/ShaderMaterial";
// import {RawShaderMaterial} from "./materials/RawShaderMaterial";

import {Color} from './math/Color';
import {_Math} from "./math/Math";
import {Vector2} from './math/Vector2';
import {Vector3} from './math/Vector3';

// import {Group} from './objects/Group';
// import {Line} from './objects/Line';
import {Mesh} from './objects/Mesh';
// import {Points} from './objects/Points';

import {WebGLRenderer} from './renderers/WebGLRenderer';

// import {Fog} from './scenes/Fog';
import {Scene} from './scenes/Scene';

import {Texture} from "./textures/Texture";
import {VideoTexture} from "./textures/VideoTexture";

var THREE = {
    LinearFilter: LinearFilter,
    RGBFormat: RGBFormat,
    RepeatWrapping: RepeatWrapping,

    PerspectiveCamera: PerspectiveCamera,

    // BufferGeometry: BufferGeometry,
    // Clock: Clock,
    // Object3D: Object3D,
    Raycaster: Raycaster,

    // BoxGeometry: BoxGeometry,
    // BoxBufferGeometry: BoxBufferGeometry,
    // PlaneBufferGeometry: PlaneBufferGeometry,
    // ShapeBufferGeometry: ShapeBufferGeometry,
    SphereBufferGeometry: SphereBufferGeometry,
    // TextBufferGeometry: TextBufferGeometry,

    // AxesHelper: AxesHelper,
    // GridHelper: GridHelper,
    //
    // AmbientLight: AmbientLight,
    // DirectionalLight: DirectionalLight,
    // PointLight: PointLight,
    //
    // CubeTextureLoader: CubeTextureLoader,
    // FontLoader: FontLoader,
    // JSONLoader: JSONLoader,
    TextureLoader: TextureLoader,

    // LineBasicMaterial: LineBasicMaterial,
    MeshBasicMaterial: MeshBasicMaterial,
    // MeshLambertMaterial: MeshLambertMaterial,
    // MeshPhongMaterial: MeshPhongMaterial,
    // MeshStandardMaterial: MeshStandardMaterial,
    // PointsMaterial: PointsMaterial,
    // ShaderMaterial: ShaderMaterial,
    // RawShaderMaterial: RawShaderMaterial,

    Color: Color,
    Math: _Math,
    Vector2: Vector2,
    // Vector3: Vector3,

    // Group: Group,
    // Line: Line,
    Mesh: Mesh,
    // Points: Points,

    WebGLRenderer: WebGLRenderer,

    // Fog: Fog,
    Scene: Scene,

    Texture: Texture,
    VideoTexture: VideoTexture,
};

var scope = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {};
scope.THREE = THREE;