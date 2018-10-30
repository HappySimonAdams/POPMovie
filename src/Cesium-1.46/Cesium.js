const Viewer = require('./Widgets/Viewer');
// const NavigationMixin = require('./Widgets/Navigation/NavigationMixin');

const BingMapsApi = require('./Core/BingMapsApi');
// const BoundingSphere = require('./Core/BoundingSphere');
// const Cartesian2 = require('./Core/Cartesian2');
const Cartesian3 = require('./Core/Cartesian3');
const Cartographic = require('./Core/Cartographic');
// const CesiumTerrainProvider = require('./Core/CesiumTerrainProvider');
const Color = require('./Core/Color');
// const ClockRange = require('./Core/ClockRange');
// const defaultValue = require('./Core/defaultValue');
const defined = require('./Core/defined');
// const defineProperties = require('./Core/defineProperties');
// const DistanceDisplayCondition = require('./Core/DistanceDisplayCondition');
// const Ellipsoid = require('./Core/Ellipsoid');
// const HeadingPitchRange = require('./Core/HeadingPitchRange');
// const HeadingPitchRoll = require('./Core/HeadingPitchRoll');
// const JulianDate = require('./Core/JulianDate');
// const KeyboardEventModifier = require('./Core/KeyboardEventModifier');
// const HermitePolynomialApproximation = require('./Core/HermitePolynomialApproximation');
// const LagrangePolynomialApproximation = require('./Core/LagrangePolynomialApproximation');
// const LinearApproximation = require('./Core/LinearApproximation');
const Math = require('./Core/Math');
// const Matrix3 = require('./Core/Matrix3');
// const Matrix4 = require('./Core/Matrix4');
// const NearFarScalar = require('./Core/NearFarScalar');
const PinBuilder = require('./Core/PinBuilder');
// const Quaternion = require('./Core/Quaternion');
const Rectangle = require('./Core/Rectangle');
const Resource = require('./Core/Resource');
const ScreenSpaceEventHandler = require('./Core/ScreenSpaceEventHandler');
const ScreenSpaceEventType = require('./Core/ScreenSpaceEventType');
// const TimeInterval = require('./Core/TimeInterval');
// const TimeIntervalCollection = require('./Core/TimeIntervalCollection');
// const Transforms = require('./Core/Transforms');
// const WebMercatorProjection = require('./Core/WebMercatorProjection');

// const BoundingSphereState = require('./DataSources/BoundingSphereState');
// const CallbackProperty = require('./DataSources/CallbackProperty');
// const ColorMaterialProperty = require('./DataSources/ColorMaterialProperty');
// const ConstantProperty = require('./DataSources/ConstantProperty');
// const DynamicProperty = require('./DataSources/DynamicProperty');
// const EntityView = require('./DataSources/EntityView');
// const PolylineArrowMaterialProperty = require('./DataSources/PolylineArrowMaterialProperty');
// const PolylineDashMaterialProperty = require('./DataSources/PolylineDashMaterialProperty');
// const PolylineGlowMaterialProperty = require('./DataSources/PolylineGlowMaterialProperty');
// const PolylineOutlineMaterialProperty = require('./DataSources/PolylineOutlineMaterialProperty');
// const SampledPositionProperty = require('./DataSources/SampledPositionProperty');
// const VelocityOrientationProperty = require('./DataSources/VelocityOrientationProperty');

// const ArcGisMapServerImageryProvider = require('./Scene/ArcGisMapServerImageryProvider');
// const BingMapsStyle = require('./Scene/BingMapsStyle');
// const BingMapsImageryProvider = require('./Scene/BingMapsImageryProvider');
const createOpenStreetMapImageryProvider = require('./Scene/createOpenStreetMapImageryProvider');
// const createTileMapServiceImageryProvider = require('./Scene/createTileMapServiceImageryProvider');
// const SingleTileImageryProvider = require('./Scene/SingleTileImageryProvider');
// const UrlTemplateImageryProvider = require('./Scene/UrlTemplateImageryProvider');
// const WebMapTileServiceImageryProvider = require('./Scene/WebMapTileServiceImageryProvider');
// const Model = require('./Scene/Model');
// const Cesium3DTileset = require('./Scene/Cesium3DTileset');
// const SceneMode = require('./Scene/SceneMode');
// const VerticalOrigin = require('./Scene/VerticalOrigin');

// const knockout = require('./ThirdParty/knockout');
// const turf = require('./ThirdParty/turf');
const when = require('./ThirdParty/when');

var Cesium = {
    VERSION: 1.46,
    Viewer: Viewer,
    // NavigationMixin: NavigationMixin,

    BingMapsApi: BingMapsApi,
    // BoundingSphere: BoundingSphere,
    // Cartesian2: Cartesian2,
    Cartesian3: Cartesian3,
    Cartographic: Cartographic,
    // CesiumTerrainProvider: CesiumTerrainProvider,
    Color: Color,
    // ClockRange: ClockRange,
    // defaultValue: defaultValue,
    defined: defined,
    // defineProperties: defineProperties,
    // DistanceDisplayCondition: DistanceDisplayCondition,
    // Ellipsoid: Ellipsoid,
    // HeadingPitchRange: HeadingPitchRange,
    // HeadingPitchRoll: HeadingPitchRoll,
    // JulianDate: JulianDate,
    // KeyboardEventModifier: KeyboardEventModifier,
    // HermitePolynomialApproximation: HermitePolynomialApproximation,
    // LagrangePolynomialApproximation: LagrangePolynomialApproximation,
    // LinearApproximation: LinearApproximation,
    Math: Math,
    // Matrix3: Matrix3,
    // Matrix4: Matrix4,
    // NearFarScalar: NearFarScalar,
    PinBuilder: PinBuilder,
    // Quaternion: Quaternion,
    Rectangle: Rectangle,
    Resource: Resource,
    ScreenSpaceEventHandler: ScreenSpaceEventHandler,
    ScreenSpaceEventType: ScreenSpaceEventType,
    // TimeInterval: TimeInterval,
    // TimeIntervalCollection: TimeIntervalCollection,
    // Transforms: Transforms,
    // WebMercatorProjection: WebMercatorProjection,

    // BoundingSphereState: BoundingSphereState,
    // CallbackProperty: CallbackProperty,
    // ColorMaterialProperty: ColorMaterialProperty,
    // ConstantProperty: ConstantProperty,
    // DynamicProperty: DynamicProperty,
    // EntityView: EntityView,
    // PolylineArrowMaterialProperty: PolylineArrowMaterialProperty,
    // PolylineDashMaterialProperty: PolylineDashMaterialProperty,
    // PolylineGlowMaterialProperty: PolylineGlowMaterialProperty,
    // PolylineOutlineMaterialProperty: PolylineOutlineMaterialProperty,
    // SampledPositionProperty: SampledPositionProperty,
    // VelocityOrientationProperty: VelocityOrientationProperty,

    // ArcGisMapServerImageryProvider: ArcGisMapServerImageryProvider,
    // BingMapsStyle: BingMapsStyle,
    // BingMapsImageryProvider: BingMapsImageryProvider,
    createOpenStreetMapImageryProvider: createOpenStreetMapImageryProvider,
    // createTileMapServiceImageryProvider: createTileMapServiceImageryProvider,
    // SingleTileImageryProvider: SingleTileImageryProvider,
    // UrlTemplateImageryProvider: UrlTemplateImageryProvider,
    // WebMapTileServiceImageryProvider: WebMapTileServiceImageryProvider,
    // Model: Model,
    // Cesium3DTileset: Cesium3DTileset,
    // SceneMode: SceneMode,
    // VerticalOrigin: VerticalOrigin,

    // knockout: knockout,
    // turf: turf,
    when: when
};

var scope = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {};
scope.Cesium = Cesium;

