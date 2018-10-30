define([
        '../Core/buildModuleUrl',
        '../Core/Color',
        '../Core/defineProperties',
        '../Core/destroyObject',
        '../Core/Ellipsoid',
        '../Shaders/AmbientOcclusionGenerate',
        '../Shaders/AmbientOcclusionModulate',
        '../Shaders/BlackAndWhite',
        '../Shaders/BloomComposite',
        '../Shaders/Brightness',
        '../Shaders/ContrastBias',
        '../Shaders/DepthOfField',
        '../Shaders/DepthView',
        '../Shaders/EdgeDetection',
        '../Shaders/FXAA',
        '../Shaders/FXAA3_11',
        '../Shaders/GaussianBlur1D',
        '../Shaders/LensFlare',
        '../Shaders/LinearDepth',
        '../Shaders/NightVision',
        '../Shaders/Silhouette',
        './PostProcessStage',
        './PostProcessStageComposite',
        './PostProcessStageSampleMode'
    ], function(
        buildModuleUrl,
        Color,
        defineProperties,
        destroyObject,
        Ellipsoid,
        AmbientOcclusionGenerate,
        AmbientOcclusionModulate,
        BlackAndWhite,
        BloomComposite,
        Brightness,
        ContrastBias,
        DepthOfField,
        DepthView,
        EdgeDetection,
        FXAA,
        FXAA3_11,
        GaussianBlur1D,
        LensFlare,
        LinearDepth,
        NightVision,
        Silhouette,
        PostProcessStage,
        PostProcessStageComposite,
        PostProcessStageSampleMode) {
    'use strict';

    /**
     * Contains functions for creating common post-process stages.
     *
     * @exports PostProcessStageLibrary
     */
    var PostProcessStageLibrary = {};

    function createBlur(name) {
        var delta = 1.0;
        var sigma = 2.0;
        var stepSize = 1.0;

        var blurShader = '#define USE_STEP_SIZE\n' + GaussianBlur1D;
        var blurX = new PostProcessStage({
            name : name + '_x_direction',
            fragmentShader : blurShader,
            uniforms: {
                delta : delta,
                sigma : sigma,
                stepSize : stepSize,
                direction : 0.0
            },
            sampleMode : PostProcessStageSampleMode.LINEAR
        });
        var blurY = new PostProcessStage({
            name : name + '_y_direction',
            fragmentShader : blurShader,
            uniforms: {
                delta : delta,
                sigma : sigma,
                stepSize : stepSize,
                direction : 1.0
            },
            sampleMode : PostProcessStageSampleMode.LINEAR
        });

        var uniforms = {};
        defineProperties(uniforms, {
            delta : {
                get : function() {
                    return blurX.uniforms.delta;
                },
                set : function(value) {
                    var blurXUniforms = blurX.uniforms;
                    var blurYUniforms = blurY.uniforms;
                    blurXUniforms.delta = blurYUniforms.delta = value;
                }
            },
            sigma : {
                get : function() {
                    return blurX.uniforms.sigma;
                },
                set : function(value) {
                    var blurXUniforms = blurX.uniforms;
                    var blurYUniforms = blurY.uniforms;
                    blurXUniforms.sigma = blurYUniforms.sigma = value;
                }
            },
            stepSize : {
                get : function() {
                    return blurX.uniforms.stepSize;
                },
                set : function(value) {
                    var blurXUniforms = blurX.uniforms;
                    var blurYUniforms = blurY.uniforms;
                    blurXUniforms.stepSize = blurYUniforms.stepSize = value;
                }
            }
        });
        return new PostProcessStageComposite({
            name : name,
            stages : [blurX, blurY],
            uniforms : uniforms
        });
    }

    /**
     * Creates a post-process stage that applies a Gaussian blur to the input texture. This stage is usually applied in conjunction with another stage.
     * <p>
     * This stage has the following uniforms: <code>delta</code>, <code>sigma</code>, and <code>stepSize</code>.
     * </p>
     * <p>
     * <code>delta</code> and <code>sigma</code> are used to compute the weights of a Gaussian filter. The equation is <code>exp((-0.5 * delta * delta) / (sigma * sigma))</code>.
     * The default value for <code>delta</code> is <code>1.0</code>. The default value for <code>sigma</code> is <code>2.0</code>.
     * <code>stepSize</code> is the distance to the next texel. The default is <code>1.0</code>.
     * </p>
     * @return {PostProcessStageComposite} A post-process stage that applies a Gaussian blur to the input texture.
     */
    PostProcessStageLibrary.createBlurStage = function() {
        return createBlur('czm_blur');
    };

    /**
     * Creates a post-process stage that applies a depth of field effect.
     * <p>
     * Depth of field simulates camera focus. Objects in the scene that are in focus
     * will be clear whereas objects not in focus will be blurred.
     * </p>
     * <p>
     * This stage has the following uniforms: <code>focalDistance</code>, <code>delta</code>, <code>sigma</code>, and <code>stepSize</code>.
     * </p>
     * <p>
     * <code>focalDistance</code> is the distance in meters from the camera to set the camera focus.
     * </p>
     * <p>
     * <code>delta</code>, <code>sigma</code>, and <code>stepSize</code> are the same properties as {@link PostProcessStageLibrary#createBlurStage}.
     * The blur is applied to the areas out of focus.
     * </p>
     * @return {PostProcessStageComposite} A post-process stage that applies a depth of field effect.
     */
    PostProcessStageLibrary.createDepthOfFieldStage = function() {
        var blur = createBlur('czm_depth_of_field_blur');
        var dof = new PostProcessStage({
            name : 'czm_depth_of_field_composite',
            fragmentShader : DepthOfField,
            uniforms : {
                focalDistance : 5.0,
                blurTexture : blur.name
            }
        });

        var uniforms = {};
        defineProperties(uniforms, {
            focalDistance : {
                get : function() {
                    return dof.uniforms.focalDistance;
                },
                set : function(value) {
                    dof.uniforms.focalDistance = value;
                }
            },
            delta : {
                get : function() {
                    return blur.uniforms.delta;
                },
                set : function(value) {
                    blur.uniforms.delta = value;
                }
            },
            sigma : {
                get : function() {
                    return blur.uniforms.sigma;
                },
                set : function(value) {
                    blur.uniforms.sigma = value;
                }
            },
            stepSize : {
                get : function() {
                    return blur.uniforms.stepSize;
                },
                set : function(value) {
                    blur.uniforms.stepSize = value;
                }
            }
        });
        return new PostProcessStageComposite({
            name : 'czm_depth_of_field',
            stages : [blur, dof],
            inputPreviousStageTexture : false,
            uniforms : uniforms
        });
    };

    /**
     * Creates a post-process stage that applies a silhouette effect.
     * <p>
     * A silhouette effect highlights the edges of an object.
     * </p>
     * <p>
     * This stage has the following uniforms: <code>color</code> and <code>length</code>
     * </p>
     * <ul>
     * <li><code>color</code> is the color of the highlighted edge. The default is {@link Color#BLACK}.</li>
     * <li><code>length</code> is the length of the edges in pixels. The default is <code>0.5</code>.</li>
     * </ul>
     * @return {PostProcessStageComposite} A post-process stage that applies a silhouette effect.
     */
    PostProcessStageLibrary.createSilhouetteStage = function() {
        var silhouetteDepth = new PostProcessStage({
            name : 'czm_silhouette_depth',
            fragmentShader : LinearDepth
        });
        var edgeDetection = new PostProcessStage({
            name : 'czm_silhouette_edge_detection',
            fragmentShader : EdgeDetection,
            uniforms : {
                length : 0.25,
                color : Color.clone(Color.BLACK)
            }
        });
        var silhouetteGenerateProcess = new PostProcessStageComposite({
            name : 'czm_silhouette_generate',
            stages : [silhouetteDepth, edgeDetection]
        });
        var silhouetteProcess = new PostProcessStage({
            name : 'czm_silhouette_color_edges',
            fragmentShader : Silhouette,
            uniforms : {
                silhouetteTexture : silhouetteGenerateProcess.name
            }
        });

        var uniforms = {};
        defineProperties(uniforms, {
            length : {
                get : function() {
                    return edgeDetection.uniforms.length;
                },
                set : function(value) {
                    edgeDetection.uniforms.length = value;
                }
            },
            color : {
                get : function() {
                    return edgeDetection.uniforms.color;
                },
                set : function(value) {
                    edgeDetection.uniforms.color = value;
                }
            }
        });
        return new PostProcessStageComposite({
            name : 'czm_silhouette',
            stages : [silhouetteGenerateProcess, silhouetteProcess],
            inputPreviousStageTexture : false,
            uniforms : uniforms
        });
    };

    /**
     * Creates a post-process stage that applies a bloom effect to the input texture.
     * <p>
     * A bloom effect adds glow effect, makes bright areas brighter, and dark areas darker.
     * </p>
     * <p>
     * This post-process stage has the following uniforms: <code>contrast</code>, <code>brightness</code>, <code>glowOnly</code>,
     * <code>delta</code>, <code>sigma</code>, and <code>stepSize</code>.
     * </p>
     * <ul>
     * <li><code>contrast</code> is a scalar value in the range [-255.0, 255.0] and affects the contract of the effect. The default value is <code>128.0</code>.</li>
     * <li><code>brightness</code> is a scalar value. The input texture RGB value is converted to hue, saturation, and brightness (HSB) then this value is
     * added to the brightness. The default value is <code>-0.3</code>.</li>
     * <li><code>glowOnly</code> is a boolean value. When <code>true</code>, only the glow effect will be shown. When <code>false</code>, the glow will be added to the input texture.
     * The default value is <code>false</code>. This is a debug option for viewing the effects when changing the other uniform values.</li>
     * </ul>
     * <p>
     * <code>delta</code>, <code>sigma</code>, and <code>stepSize</code> are the same properties as {@link PostProcessStageLibrary#createBlurStage}.
     * </p>
     * @return {PostProcessStageComposite} A post-process stage to applies a bloom effect.
     *
     * @private
     */
    PostProcessStageLibrary.createBloomStage = function() {
        var contrastBias = new PostProcessStage({
            name : 'czm_bloom_contrast_bias',
            fragmentShader : ContrastBias,
            uniforms : {
                contrast : 128.0,
                brightness : -0.3
            }
        });
        var blur = createBlur('czm_bloom_blur');
        var generateComposite = new PostProcessStageComposite({
            name : 'czm_bloom_contrast_bias_blur',
            stages : [contrastBias, blur]
        });

        var bloomComposite = new PostProcessStage({
            name : 'czm_bloom_generate_composite',
            fragmentShader : BloomComposite,
            uniforms : {
                glowOnly : false,
                bloomTexture : generateComposite.name
            }
        });

        var uniforms = {};
        defineProperties(uniforms, {
            glowOnly : {
                get : function() {
                    return bloomComposite.uniforms.glowOnly;
                },
                set : function(value) {
                    bloomComposite.uniforms.glowOnly = value;
                }
            },
            contrast : {
                get : function() {
                    return contrastBias.uniforms.contrast;
                },
                set : function(value) {
                    contrastBias.uniforms.contrast = value;
                }
            },
            brightness : {
                get : function() {
                    return contrastBias.uniforms.brightness;
                },
                set : function(value) {
                    contrastBias.uniforms.brightness = value;
                }
            },
            delta : {
                get : function() {
                    return blur.uniforms.delta;
                },
                set : function(value) {
                    blur.uniforms.delta = value;
                }
            },
            sigma : {
                get : function() {
                    return blur.uniforms.sigma;
                },
                set : function(value) {
                    blur.uniforms.sigma = value;
                }
            },
            stepSize : {
                get : function() {
                    return blur.uniforms.stepSize;
                },
                set : function(value) {
                    blur.uniforms.stepSize = value;
                }
            }
        });

        return new PostProcessStageComposite({
            name : 'czm_bloom',
            stages : [generateComposite, bloomComposite],
            inputPreviousStageTexture : false,
            uniforms : uniforms
        });
    };

    /**
     * Creates a post-process stage that Horizon-based Ambient Occlusion (HBAO) to the input texture.
     * <p>
     * Ambient occlusion simulates shadows from ambient light. These shadows would always be present when the
     * surface receives light and regardless of the light's position.
     * </p>
     * <p>
     * The uniforms have the following properties: <code>intensity</code>, <code>bias</code>, <code>lengthCap</code>,
     * <code>stepSize</code>, <code>frustumLength</code>, <code>randomTexture</code>, <code>ambientOcclusionOnly</code>,
     * <code>delta</code>, <code>sigma</code>, and <code>blurStepSize</code>.
     * </p>
     * <ul>
     * <li><code>intensity</code> is a scalar value used to lighten or darken the shadows exponentially. Higher values make the shadows darker. The default value is <code>3.0</code>.</li>
     * <li><code>bias</code> is a scalar value representing an angle in radians. If the dot product between the normal of the sample and the vector to the camera is less than this value,
     * sampling stops in the current direction. This is used to remove shadows from near planar edges. The default value is <code>0.1</code>.</li>
     * <li><code>lengthCap</code> is a scalar value representing a length in meters. If the distance from the current sample to first sample is greater than this value,
     * sampling stops in the current direction. The default value is <code>0.26</code>.</li>
     * <li><code>stepSize</code> is a scalar value indicating the distance to the next texel sample in the current direction. The default value is <code>1.95</code>.</li>
     * <li><code>frustumLength</code> is a scalar value in meters. If the current fragment has a distance from the camera greater than this value, ambient occlusion is not computed for the fragment.
     * The default value is <code>1000.0</code>.</li>
     * <li><code>randomTexture</code> is a texture where the red channel is a random value in [0.0, 1.0]. The default value is <code>undefined</code>. This texture needs to be set.</li>
     * <li><code>ambientOcclusionOnly</code> is a boolean value. When <code>true</code>, only the shadows generated are written to the output. When <code>false</code>, the input texture is modulated
     * with the ambient occlusion. This is a useful debug option for seeing the effects of changing the uniform values. The default value is <code>false</code>.</li>
     * </ul>
     * <p>
     * <code>delta</code>, <code>sigma</code>, and <code>blurStepSize</code> are the same properties as {@link PostProcessStageLibrary#createBlurStage}.
     * The blur is applied to the shadows generated from the image to make them smoother.
     * </p>
     * @return {PostProcessStageComposite} A post-process stage that applies an ambient occlusion effect.
     *
     * @private
     */
    PostProcessStageLibrary.createAmbientOcclusionStage = function() {
        var generate = new PostProcessStage({
            name : 'czm_ambient_occlusion_generate',
            fragmentShader : AmbientOcclusionGenerate,
            uniforms : {
                intensity : 3.0,
                bias : 0.1,
                lengthCap : 0.26,
                stepSize : 1.95,
                frustumLength : 1000.0,
                randomTexture : undefined
            }
        });
        var blur = createBlur('czm_ambient_occlusion_blur');
        blur.uniforms.stepSize = 0.86;
        var generateAndBlur = new PostProcessStageComposite({
            name : 'czm_ambient_occlusion_generate_blur',
            stages : [generate, blur]
        });

        var ambientOcclusionModulate = new PostProcessStage({
            name : 'czm_ambient_occlusion_composite',
            fragmentShader : AmbientOcclusionModulate,
            uniforms : {
                ambientOcclusionOnly : false,
                ambientOcclusionTexture : generateAndBlur.name
            }
        });

        var uniforms = {};
        defineProperties(uniforms, {
            intensity : {
                get : function() {
                    return generate.uniforms.intensity;
                },
                set : function(value) {
                    generate.uniforms.intensity = value;
                }
            },
            bias : {
                get : function() {
                    return generate.uniforms.bias;
                },
                set : function(value) {
                    generate.uniforms.bias = value;
                }
            },
            lengthCap : {
                get : function() {
                    return generate.uniforms.lengthCap;
                },
                set : function(value) {
                    generate.uniforms.lengthCap = value;
                }
            },
            stepSize : {
                get : function() {
                    return generate.uniforms.stepSize;
                },
                set : function(value) {
                    generate.uniforms.stepSize = value;
                }
            },
            frustumLength : {
                get : function() {
                    return generate.uniforms.frustumLength;
                },
                set : function(value) {
                    generate.uniforms.frustumLength = value;
                }
            },
            randomTexture : {
                get : function() {
                    return generate.uniforms.randomTexture;
                },
                set : function(value) {
                    generate.uniforms.randomTexture = value;
                }
            },
            delta : {
                get : function() {
                    return blur.uniforms.delta;
                },
                set : function(value) {
                    blur.uniforms.delta = value;
                }
            },
            sigma : {
                get : function() {
                    return blur.uniforms.sigma;
                },
                set : function(value) {
                    blur.uniforms.sigma = value;
                }
            },
            blurStepSize : {
                get : function() {
                    return blur.uniforms.stepSize;
                },
                set : function(value) {
                    blur.uniforms.stepSize = value;
                }
            },
            ambientOcclusionOnly : {
                get : function() {
                    return ambientOcclusionModulate.uniforms.ambientOcclusionOnly;
                },
                set : function(value) {
                    ambientOcclusionModulate.uniforms.ambientOcclusionOnly = value;
                }
            }
        });

        return new PostProcessStageComposite({
            name : 'czm_ambient_occlusion',
            stages : [generateAndBlur, ambientOcclusionModulate],
            inputPreviousStageTexture : false,
            uniforms : uniforms
        });
    };

    var fxaaFS =
        '#define FXAA_QUALITY_PRESET 39 \n' +
        FXAA3_11 + '\n' +
        FXAA;

    /**
     * Creates a post-process stage that applies Fast Approximate Anti-aliasing (FXAA) to the input texture.
     * @return {PostProcessStage} A post-process stage that applies Fast Approximate Anti-aliasing to the input texture.
     *
     * @private
     */
    PostProcessStageLibrary.createFXAAStage = function() {
        return new PostProcessStage({
            name : 'czm_FXAA',
            fragmentShader : fxaaFS,
            sampleMode : PostProcessStageSampleMode.LINEAR
        });
    };

    /**
     * Creates a post-process stage that renders the input texture with black and white gradations.
     * <p>
     * This stage has one uniform value, <code>gradations</code>, which scales the luminance of each pixel.
     * </p>
     * @return {PostProcessStage} A post-process stage that renders the input texture with black and white gradations.
     */
    PostProcessStageLibrary.createBlackAndWhiteStage = function() {
        return new PostProcessStage({
            name : 'czm_black_and_white',
            fragmentShader : BlackAndWhite,
            uniforms : {
                gradations : 5.0
            }
        });
    };

    /**
     * Creates a post-process stage that saturates the input texture.
     * <p>
     * This stage has one uniform value, <code>brightness</code>, which scales the saturation of each pixel.
     * </p>
     * @return {PostProcessStage} A post-process stage that saturates the input texture.
     */
    PostProcessStageLibrary.createBrightnessStage = function() {
        return new PostProcessStage({
            name : 'czm_brightness',
            fragmentShader : Brightness,
            uniforms : {
                brightness : 0.5
            }
        });
    };

    /**
     * Creates a post-process stage that adds a night vision effect to the input texture.
     * @return {PostProcessStage} A post-process stage that adds a night vision effect to the input texture.
     */
    PostProcessStageLibrary.createNightVisionStage = function() {
        return new PostProcessStage({
            name : 'czm_night_vision',
            fragmentShader : NightVision
        });
    };

    /**
     * Creates a post-process stage that replaces the input color texture with a black and white texture representing the fragment depth at each pixel.
     * @return {PostProcessStage} A post-process stage that replaces the input color texture with a black and white texture representing the fragment depth at each pixel.
     *
     * @private
     */
    PostProcessStageLibrary.createDepthViewStage = function() {
        return new PostProcessStage({
            name : 'czm_depth_view',
            fragmentShader : DepthView
        });
    };

    /**
     * Creates a post-process stage that applies an effect simulating light flaring a camera lens.
     * <p>
     * This stage has the following uniforms: <code>dirtTexture</code>, <code>starTexture</code>, <code>intensity</code>, <code>distortion</code>, <code>ghostDispersal</code>,
     * <code>haloWidth</code>, and <code>earthRadius</code>.
     * <ul>
     * <li><code>dirtTexture</code> is a texture sampled to simulate dirt on the lens.</li>
     * <li><code>starTexture</code> is the texture sampled for the star pattern of the flare.</li>
     * <li><code>intensity</code> is a scalar multiplied by the result of the lens flare. The default value is <code>2.0</code>.</li>
     * <li><code>distortion</code> is a scalar value that affects the chromatic effect distortion. The default value is <code>10.0</code>.</li>
     * <li><code>ghostDispesal</code> is a scalar indicating how far the halo effect is from the center of the texture. The default value is <code>0.4</code>.</li>
     * <li><code>haloWidth</code> is a scalar representing the width of the halo  from the ghost dispersal. The default value is <code>0.4</code>.</li>
     * <li><code>earthRadius</code> is the maximum radius of the earth. The default value is <code>Ellipsoid.WGS84.maximumRadius</code>.</li>
     * </ul>
     * </p>
     * @return {PostProcessStage} A post-process stage for applying a lens flare effect.
     */
    PostProcessStageLibrary.createLensFlarStage = function() {
        return new PostProcessStage({
            name : 'czm_lens_flare',
            fragmentShader : LensFlare,
            uniforms : {
                dirtTexture : buildModuleUrl('Assets/Textures/LensFlare/DirtMask.jpg'),
                starTexture : buildModuleUrl('Assets/Textures/LensFlare/StarBurst.jpg'),
                intensity : 2.0,
                distortion : 10.0,
                ghostDispersal : 0.4,
                haloWidth : 0.4,
                earthRadius : Ellipsoid.WGS84.maximumRadius
            }
        });
    };

    return PostProcessStageLibrary;
});
