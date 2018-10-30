define(function () {
    let CzmBuiltins = {
        czm_degreesPerRadian : 'const float czm_degreesPerRadian = 57.29577951308232;',
        czm_depthRange : 'const czm_depthRangeStruct czm_depthRange = czm_depthRangeStruct(0.0, 1.0);',
        czm_epsilon1 : 'const float czm_epsilon1 = 0.1;',
        czm_epsilon2 : 'const float czm_epsilon2 = 0.01;',
        czm_epsilon3 : 'const float czm_epsilon3 = 0.001;',
        czm_epsilon4 : 'const float czm_epsilon4 = 0.0001;',
        czm_epsilon5 : 'const float czm_epsilon5 = 0.00001;',
        czm_epsilon6 : 'const float czm_epsilon6 = 0.000001;',
        czm_epsilon7 : 'const float czm_epsilon7 = 0.0000001;',
        czm_infinity : 'const float czm_infinity = 5906376272000.0;',
        czm_oneOverPi : 'const float czm_oneOverPi = 0.3183098861837907;',
        czm_oneOverTwoPi : 'const float czm_oneOverTwoPi = 0.15915494309189535;',
        czm_passCesium3DTile : 'const float czm_passCesium3DTile = 4.0;',
        czm_passCesium3DTileClassification : 'const float czm_passCesium3DTileClassification = 5.0;',
        czm_passCesium3DTileClassificationIgnoreShow : 'const float czm_passCesium3DTileClassificationIgnoreShow = 6.0;',
        czm_passClassification : 'const float czm_passClassification = 7.0;',
        czm_passCompute : 'const float czm_passCompute = 1.0;',
        czm_passEnvironment : 'const float czm_passEnvironment = 0.0;',
        czm_passGlobe : 'const float czm_passGlobe = 2.0;',
        czm_passOpaque : 'const float czm_passOpaque = 8.0;',
        czm_passOverlay : 'const float czm_passOverlay = 10.0;',
        czm_passTerrainClassification : 'const float czm_passTerrainClassification = 3.0;',
        czm_passTranslucent : 'const float czm_passTranslucent = 9.0;',
        czm_pi : 'const float czm_pi = 3.141592653589793;',
        czm_piOverFour : 'const float czm_piOverFour = 0.7853981633974483;',
        czm_piOverSix : 'const float czm_piOverSix = 0.5235987755982988;',
        czm_piOverThree : 'const float czm_piOverThree = 1.0471975511965976;',
        czm_piOverTwo : 'const float czm_piOverTwo = 1.5707963267948966;',
        czm_radiansPerDegree : 'const float czm_radiansPerDegree = 0.017453292519943295;',
        czm_sceneMode2D : 'const float czm_sceneMode2D = 2.0;',
        czm_sceneMode3D : 'const float czm_sceneMode3D = 3.0;',
        czm_sceneModeColumbusView : 'const float czm_sceneModeColumbusView = 1.0;',
        czm_sceneModeMorphing : 'const float czm_sceneModeMorphing = 0.0;',
        czm_solarRadius : 'const float czm_solarRadius = 695500000.0;',
        czm_threePiOver2 : 'const float czm_threePiOver2 = 4.71238898038469;',
        czm_twoPi : 'const float czm_twoPi = 6.283185307179586;',
        czm_webMercatorMaxLatitude : 'const float czm_webMercatorMaxLatitude = 1.4844222297453324;',

        czm_depthRangeStruct : 'struct czm_depthRangeStruct{float near; float far;};',
        czm_ellipsoid : 'struct czm_ellipsoid{vec3 center; vec3 radii; vec3 inverseRadii; vec3 inverseRadiiSquared;};',
        czm_material : 'struct czm_material{vec3 diffuse; float specular; float shininess; vec3 normal; vec3 emission; float alpha;};',
        czm_materialInput : 'struct czm_materialInput{float s; vec2 st; vec3 str; vec3 normalEC; mat3 tangentToEyeMatrix; vec3 positionToEyeEC; float height; float slope;};',
        czm_ray : 'struct czm_ray{vec3 origin; vec3 direction;};',
        czm_raySegment : "struct czm_raySegment { float start; float stop; }; const czm_raySegment czm_emptyRaySegment = czm_raySegment(-czm_infinity, -czm_infinity); const czm_raySegment czm_fullRaySegment = czm_raySegment(0.0, czm_infinity); ",
        czm_shadowParameters : 'struct czm_shadowParameters{\n #ifdef USE_CUBE_MAP_SHADOW\n vec3 texCoords;\n #else\n vec2 texCoords;\n #endif\n float depthBias; float depth; float nDotL; vec2 texelStepSize; float normalShadingSmooth; float darkness;};',

        czm_alphaWeight : "\n\
            float czm_alphaWeight(float a) {\n\
                float x = 2.0 * (gl_FragCoord.x - czm_viewport.x) / czm_viewport.z - 1.0;\n\
                float y = 2.0 * (gl_FragCoord.y - czm_viewport.y) / czm_viewport.w - 1.0;\n\
                float z = (gl_FragCoord.z - czm_viewportTransformation[3][2]) / czm_viewportTransformation[2][2];\n\
                vec4 q = vec4(x, y, z, 0.0);\n\
                q /= gl_FragCoord.w;\n\
                if (czm_inverseProjection != mat4(0.0)) {\n\
                    q = czm_inverseProjection * q;\n\
                } else {\n\
                    float top = czm_frustumPlanes.x;\n\
                    float bottom = czm_frustumPlanes.y;\n\
                    float left = czm_frustumPlanes.z;\n\
                    float right = czm_frustumPlanes.w;\n\
                    float near = czm_currentFrustum.x;\n\
                    float far = czm_currentFrustum.y;\n\
                    q.x = (q.x * (right - left) + left + right) * 0.5;\n\
                    q.y = (q.y * (top - bottom) + bottom + top) * 0.5;\n\
                    q.z = (q.z * (near - far) - near - far) * 0.5;\n\
                    q.w = 1.0;\n\
                }\n\
                return pow(a + 0.01, 4.0) + max(1e-2, min(3.0 * 1e3, 0.003 / (1e-5 + pow(abs(z) / 200.0, 4.0))));\n\
            }\n\
         ",
        czm_antialias : "\n\
            vec4 czm_antialias(vec4 color1, vec4 color2, vec4 currentColor, float dist, float fuzzFactor){\n\
                float val1 = clamp(dist / fuzzFactor, 0.0, 1.0);\n\
                float val2 = clamp((dist - 0.5) / fuzzFactor, 0.0, 1.0);\n\
                val1 = val1 * (1.0 - val2);\n\
                val1 = val1 * val1 * (3.0 - (2.0 * val1));\n\
                val1 = pow(val1, 0.5);\n\
                vec4 midColor = (color1 + color2) * 0.5;\n\
                return mix(midColor, currentColor, val1);\n\
            }\n\
            vec4 czm_antialias(vec4 color1, vec4 color2, vec4 currentColor, float dist){\n\
                return czm_antialias(color1, color2, currentColor, dist, 0.1);\n\
            }\n\
        ",
        czm_approximateSphericalCoordinates : "\
            float fastApproximateAtan01(float x) {\n\
                return x * (-0.1784 * x - 0.0663 * x * x + 1.0301);\n\
            }\n\
            float fastApproximateAtan2(float x, float y) {\n\
                float t = abs(x);\n\
                float opposite = abs(y);\n\
                float adjacent = max(t, opposite);\n\
                opposite = min(t, opposite);\n\
                t = fastApproximateAtan01(opposite / adjacent);\n\
                t = czm_branchFreeTernaryFloat(abs(y) > abs(x), czm_piOverTwo - t, t);\n\
                t = czm_branchFreeTernaryFloat(x < 0.0, czm_pi - t, t);\n\
                t = czm_branchFreeTernaryFloat(y < 0.0, -t, t);\n\
                return t;\n\
            }\n\
            vec2 czm_approximateSphericalCoordinates(vec3 normal) {\n\
                float latitudeApproximation = fastApproximateAtan2(sqrt(normal.x * normal.x + normal.y * normal.y), normal.z);\n\
                float longitudeApproximation = fastApproximateAtan2(normal.x, normal.y);\n\
                return vec2(latitudeApproximation, longitudeApproximation);\n\
            }\n\
        ",
        czm_branchFreeTernaryFloat : "\n\
            float czm_branchFreeTernaryFloat(bool comparison, float a, float b) {\n\
                float useA = float(comparison);\n\
                return a * useA + b * (1.0 - useA);\n\
            }\n\
        ",
        czm_cascadeColor : "\n\
            vec4 czm_cascadeColor(vec4 weights){\n\
                return vec4(1.0, 0.0, 0.0, 1.0) * weights.x + vec4(0.0, 1.0, 0.0, 1.0) * weights.y + vec4(0.0, 0.0, 1.0, 1.0) * weights.z + vec4(1.0, 0.0, 1.0, 1.0) * weights.w;\n\
            }\n\
        ",
        czm_cascadeDistance : "\n\
            uniform vec4 shadowMap_cascadeDistances;\n\
            float czm_cascadeDistance(vec4 weights){\n\
                return dot(shadowMap_cascadeDistances, weights);\n\
            }\n\
        ",
        czm_cascadeMatrix : "\
            uniform mat4 shadowMap_cascadeMatrices[4];\n\
            mat4 czm_cascadeMatrix(vec4 weights){\n\
                return shadowMap_cascadeMatrices[0] * weights.x + shadowMap_cascadeMatrices[1] * weights.y + shadowMap_cascadeMatrices[2] * weights.z + shadowMap_cascadeMatrices[3] * weights.w;\n\
            }\n\
        ",
        czm_cascadeWeights : "\
            uniform vec4 shadowMap_cascadeSplits[2];\n\
            vec4 czm_cascadeWeights(float depthEye) {\n\
                vec4 near = step(shadowMap_cascadeSplits[0], vec4(depthEye));\n\
                vec4 far = step(depthEye, shadowMap_cascadeSplits[1]);\n\
                return near * far;\n\
            }\n\
        ",
        czm_columbusViewMorph : "\
            vec4 czm_columbusViewMorph(vec4 position2D, vec4 position3D, float time){\n\
                vec3 p = mix(position2D.xyz, position3D.xyz, time);\n\
                return vec4(p, 1.0);\n\
            }\n\
        ",
        czm_computePosition : 'vec4 czm_computePosition();',
        czm_cosineAndSine : "\
            vec2 cordic(float angle){\n\
                vec2 vector = vec2(6.0725293500888267e-1, 0.0);\n\
                float sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                mat2 rotation = mat2(1.0, sense, -sense, 1.0);\n\
                vector = rotation * vector;\n\
                angle -= sense * 7.8539816339744828e-1;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                float factor = sense * 5.0e-1;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 4.6364760900080609e-1;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 2.5e-1;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 2.4497866312686414e-1;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.25e-1;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.2435499454676144e-1;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 6.25e-2;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 6.2418809995957350e-2;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 3.125e-2;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 3.1239833430268277e-2;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.5625e-2;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.5623728620476831e-2;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 7.8125e-3;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 7.8123410601011111e-3;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 3.90625e-3;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 3.9062301319669718e-3;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.953125e-3;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.9531225164788188e-3;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 9.765625e-4;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 9.7656218955931946e-4;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 4.8828125e-4;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 4.8828121119489829e-4;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 2.44140625e-4;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 2.4414062014936177e-4;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.220703125e-4;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.2207031189367021e-4;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 6.103515625e-5;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 6.1035156174208773e-5;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 3.0517578125e-5;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 3.0517578115526096e-5;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.52587890625e-5;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.5258789061315762e-5;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 7.62939453125e-6;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 7.6293945311019700e-6;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 3.814697265625e-6;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 3.8146972656064961e-6;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.9073486328125e-6;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 1.9073486328101870e-6;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 9.5367431640625e-7;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 9.5367431640596084e-7;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 4.76837158203125e-7;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 4.7683715820308884e-7;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 2.384185791015625e-7;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                angle -= sense * 2.3841857910155797e-7;\n\
                sense = (angle < 0.0) ? -1.0 : 1.0;\n\
                factor = sense * 1.1920928955078125e-7;\n\
                rotation[0][1] = factor;\n\
                rotation[1][0] = -factor;\n\
                vector = rotation * vector;\n\
                return vector;\n\
            }\n\
            vec2 czm_cosineAndSine(float angle) {\n\
                if (angle < -czm_piOverTwo || angle > czm_piOverTwo) {\n\
                    if (angle < 0.0) {\n\
                        return -cordic(angle + czm_pi);\n\
                    } else {\n\
                        return -cordic(angle - czm_pi);\n\
                    }\n\
                } else {\n\
                    return cordic(angle);\n\
                }\n\
            }\n\
        ",
        czm_decompressTextureCoordinates : "\
            vec2 czm_decompressTextureCoordinates(float encoded) {\n\
                float temp = encoded / 4096.0;\n\
                float xZeroTo4095 = floor(temp);\n\
                float stx = xZeroTo4095 / 4095.0;\n\
                float sty = (encoded - xZeroTo4095 * 4096.0) / 4095.0;\n\
                return vec2(stx, sty);\n\
            }\n\
        ",
        czm_depthClampFarPlane : "\
            #ifndef LOG_DEPTH\n\
            varying float v_WindowZ;\n\
            #endif\n\
            vec4 czm_depthClampFarPlane(vec4 coords) {\n\
                #ifndef LOG_DEPTH\n\
                v_WindowZ = (0.5 * (coords.z / coords.w) + 0.5) * coords.w;\n\
                coords.z = min(coords.z, coords.w);\n\
                #endif\n\
                return coords;\n\
            }\n\
        ",
        czm_eastNorthUpToEyeCoordinates : "\
            mat3 czm_eastNorthUpToEyeCoordinates(vec3 positionMC, vec3 normalEC) {\n\
                vec3 tangentMC = normalize(vec3(-positionMC.y, positionMC.x, 0.0));\n\
                vec3 tangentEC = normalize(czm_normal3D * tangentMC);\n\
                vec3 bitangentEC = normalize(cross(normalEC, tangentEC));\n\
                return mat3(\n\
                    tangentEC.x,   tangentEC.y,   tangentEC.z,\n\
                    bitangentEC.x, bitangentEC.y, bitangentEC.z,\n\
                    normalEC.x,    normalEC.y,    normalEC.z\n\
                );\n\
            }\n\
        ",
        czm_ellipsoidContainsPoint : "\
            bool czm_ellipsoidContainsPoint(czm_ellipsoid ellipsoid, vec3 point){\n\
                vec3 scaled = ellipsoid.inverseRadii * (czm_inverseModelView * vec4(point, 1.0)).xyz;\n\
                return (dot(scaled, scaled) <= 1.0);\n\
            }\n\
        ",
        czm_ellipsoidNew : "\
            czm_ellipsoid czm_ellipsoidNew(vec3 center, vec3 radii){\n\
                vec3 inverseRadii = vec3(1.0 / radii.x, 1.0 / radii.y, 1.0 / radii.z);\n\
                vec3 inverseRadiiSquared = inverseRadii * inverseRadii;\n\
                czm_ellipsoid temp = czm_ellipsoid(center, radii, inverseRadii, inverseRadiiSquared);\n\
                return temp;\n\
            }\n\
        ",
        czm_ellipsoidWgs84TextureCoordinates : "\
            vec2 czm_ellipsoidWgs84TextureCoordinates(vec3 normal){\n\
                return vec2(atan(normal.y, normal.x) * czm_oneOverTwoPi + 0.5, asin(normal.z) * czm_oneOverPi + 0.5);\n\
            }\n\
        ",
        czm_equalsEpsilon : "\
            bool czm_equalsEpsilon(vec4 left, vec4 right, float epsilon) {\n\
                return all(lessThanEqual(abs(left - right), vec4(epsilon)));\n\
            }\n\
            bool czm_equalsEpsilon(vec3 left, vec3 right, float epsilon) {\n\
                return all(lessThanEqual(abs(left - right), vec3(epsilon)));\n\
            }\n\
            bool czm_equalsEpsilon(vec2 left, vec2 right, float epsilon) {\n\
                return all(lessThanEqual(abs(left - right), vec2(epsilon)));\n\
            }\n\
            bool czm_equalsEpsilon(float left, float right, float epsilon) {\n\
                return (abs(left - right) <= epsilon);\n\
            }\n\
        ",
        czm_eyeOffset : "\
            vec4 czm_eyeOffset(vec4 positionEC, vec3 eyeOffset) {\n\
                vec4 p = positionEC;\n\
                vec4 zEyeOffset = normalize(p) * eyeOffset.z;\n\
                p.xy += eyeOffset.xy + zEyeOffset.xy;\n\
                p.z += zEyeOffset.z;\n\
                return p;\n\
            }\n\
        ",
        czm_eyeToWindowCoordinates : "\
            vec4 czm_eyeToWindowCoordinates(vec4 positionEC){\n\
                vec4 q = czm_projection * positionEC;\n\
                q.xyz /= q.w;\n\
                q.xyz = (czm_viewportTransformation * vec4(q.xyz, 1.0)).xyz;\n\
                return q;\n\
            }\n\
        ",
        czm_fog : "\
            vec3 czm_fog(float distanceToCamera, vec3 color, vec3 fogColor){\n\
                float scalar = distanceToCamera * czm_fogDensity;\n\
                float fog = 1.0 - exp(-(scalar * scalar));\n\
                return mix(color, fogColor, fog);\n\
            }\n\
        ",
        czm_geodeticSurfaceNormal : "\
            vec3 czm_geodeticSurfaceNormal(vec3 positionOnEllipsoid, vec3 ellipsoidCenter, vec3 oneOverEllipsoidRadiiSquared){\n\
                return normalize((positionOnEllipsoid - ellipsoidCenter) * oneOverEllipsoidRadiiSquared);\n\
            }\n\
        ",
        czm_getDefaultMaterial : "\
            czm_material czm_getDefaultMaterial(czm_materialInput materialInput){\n\
                czm_material material;\n\
                material.diffuse = vec3(0.0);\n\
                material.specular = 0.0;\n\
                material.shininess = 1.0;\n\
                material.normal = materialInput.normalEC;\n\
                material.emission = vec3(0.0);\n\
                material.alpha = 1.0;\n\
                return material;\n\
            }\n\
        ",
        czm_getLambertDiffuse : "float czm_getLambertDiffuse(vec3 lightDirectionEC, vec3 normalEC)\n\
{\n\
return max(dot(lightDirectionEC, normalEC), 0.0);\n\
}\n\
",
        czm_getSpecular : "float czm_getSpecular(vec3 lightDirectionEC, vec3 toEyeEC, vec3 normalEC, float shininess)\n\
{\n\
vec3 toReflectedLight = reflect(-lightDirectionEC, normalEC);\n\
float specular = max(dot(toReflectedLight, toEyeEC), 0.0);\n\
return pow(specular, max(shininess, czm_epsilon2));\n\
}\n\
",
        czm_getWaterNoise : "vec4 czm_getWaterNoise(sampler2D normalMap, vec2 uv, float time, float angleInRadians)\n\
{\n\
float cosAngle = cos(angleInRadians);\n\
float sinAngle = sin(angleInRadians);\n\
vec2 s0 = vec2(1.0/17.0, 0.0);\n\
vec2 s1 = vec2(-1.0/29.0, 0.0);\n\
vec2 s2 = vec2(1.0/101.0, 1.0/59.0);\n\
vec2 s3 = vec2(-1.0/109.0, -1.0/57.0);\n\
s0 = vec2((cosAngle * s0.x) - (sinAngle * s0.y), (sinAngle * s0.x) + (cosAngle * s0.y));\n\
s1 = vec2((cosAngle * s1.x) - (sinAngle * s1.y), (sinAngle * s1.x) + (cosAngle * s1.y));\n\
s2 = vec2((cosAngle * s2.x) - (sinAngle * s2.y), (sinAngle * s2.x) + (cosAngle * s2.y));\n\
s3 = vec2((cosAngle * s3.x) - (sinAngle * s3.y), (sinAngle * s3.x) + (cosAngle * s3.y));\n\
vec2 uv0 = (uv/103.0) + (time * s0);\n\
vec2 uv1 = uv/107.0 + (time * s1) + vec2(0.23);\n\
vec2 uv2 = uv/vec2(897.0, 983.0) + (time * s2) + vec2(0.51);\n\
vec2 uv3 = uv/vec2(991.0, 877.0) + (time * s3) + vec2(0.71);\n\
uv0 = fract(uv0);\n\
uv1 = fract(uv1);\n\
uv2 = fract(uv2);\n\
uv3 = fract(uv3);\n\
vec4 noise = (texture2D(normalMap, uv0)) +\n\
(texture2D(normalMap, uv1)) +\n\
(texture2D(normalMap, uv2)) +\n\
(texture2D(normalMap, uv3));\n\
return ((noise / 4.0) - 0.5) * 2.0;\n\
}\n\
",
        czm_getWgs84EllipsoidEC : "czm_ellipsoid czm_getWgs84EllipsoidEC()\n\
{\n\
vec3 radii = vec3(6378137.0, 6378137.0, 6356752.314245);\n\
vec3 inverseRadii = vec3(1.0 / radii.x, 1.0 / radii.y, 1.0 / radii.z);\n\
vec3 inverseRadiiSquared = inverseRadii * inverseRadii;\n\
czm_ellipsoid temp = czm_ellipsoid(czm_view[3].xyz, radii, inverseRadii, inverseRadiiSquared);\n\
return temp;\n\
}\n\
",
        czm_HSBToRGB : "const vec4 K_HSB2RGB = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n\
vec3 czm_HSBToRGB(vec3 hsb)\n\
{\n\
vec3 p = abs(fract(hsb.xxx + K_HSB2RGB.xyz) * 6.0 - K_HSB2RGB.www);\n\
return hsb.z * mix(K_HSB2RGB.xxx, clamp(p - K_HSB2RGB.xxx, 0.0, 1.0), hsb.y);\n\
}\n\
",
        czm_HSLToRGB : "vec3 hueToRGB(float hue)\n\
{\n\
float r = abs(hue * 6.0 - 3.0) - 1.0;\n\
float g = 2.0 - abs(hue * 6.0 - 2.0);\n\
float b = 2.0 - abs(hue * 6.0 - 4.0);\n\
return clamp(vec3(r, g, b), 0.0, 1.0);\n\
}\n\
vec3 czm_HSLToRGB(vec3 hsl)\n\
{\n\
vec3 rgb = hueToRGB(hsl.x);\n\
float c = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;\n\
return (rgb - 0.5) * c + hsl.z;\n\
}\n\
",
        czm_hue : "vec3 czm_hue(vec3 rgb, float adjustment)\n\
{\n\
const mat3 toYIQ = mat3(0.299,     0.587,     0.114,\n\
0.595716, -0.274453, -0.321263,\n\
0.211456, -0.522591,  0.311135);\n\
const mat3 toRGB = mat3(1.0,  0.9563,  0.6210,\n\
1.0, -0.2721, -0.6474,\n\
1.0, -1.107,   1.7046);\n\
vec3 yiq = toYIQ * rgb;\n\
float hue = atan(yiq.z, yiq.y) + adjustment;\n\
float chroma = sqrt(yiq.z * yiq.z + yiq.y * yiq.y);\n\
vec3 color = vec3(yiq.x, chroma * cos(hue), chroma * sin(hue));\n\
return toRGB * color;\n\
}\n\
",
        czm_isEmpty : "bool czm_isEmpty(czm_raySegment interval)\n\
{\n\
return (interval.stop < 0.0);\n\
}\n\
",
        czm_isFull : "bool czm_isFull(czm_raySegment interval)\n\
{\n\
return (interval.start == 0.0 && interval.stop == czm_infinity);\n\
}\n\
",
        czm_latitudeToWebMercatorFraction : "float czm_latitudeToWebMercatorFraction(float latitude, float southMercatorY, float oneOverMercatorHeight)\n\
{\n\
float sinLatitude = sin(latitude);\n\
float mercatorY = 0.5 * log((1.0 + sinLatitude) / (1.0 - sinLatitude));\n\
return (mercatorY - southMercatorY) * oneOverMercatorHeight;\n\
}\n\
",
        czm_lineDistance : "float czm_lineDistance(vec2 point1, vec2 point2, vec2 point) {\n\
return abs((point2.y - point1.y) * point.x - (point2.x - point1.x) * point.y + point2.x * point1.y - point2.y * point1.x) / distance(point2, point1);\n\
}\n\
",
        czm_luminance : "float czm_luminance(vec3 rgb)\n\
{\n\
const vec3 W = vec3(0.2125, 0.7154, 0.0721);\n\
return dot(rgb, W);\n\
}\n\
",
        czm_metersPerPixel : "float czm_metersPerPixel(vec4 positionEC)\n\
{\n\
float width = czm_viewport.z;\n\
float height = czm_viewport.w;\n\
float pixelWidth;\n\
float pixelHeight;\n\
float top = czm_frustumPlanes.x;\n\
float bottom = czm_frustumPlanes.y;\n\
float left = czm_frustumPlanes.z;\n\
float right = czm_frustumPlanes.w;\n\
if (czm_sceneMode == czm_sceneMode2D || czm_orthographicIn3D == 1.0)\n\
{\n\
float frustumWidth = right - left;\n\
float frustumHeight = top - bottom;\n\
pixelWidth = frustumWidth / width;\n\
pixelHeight = frustumHeight / height;\n\
}\n\
else\n\
{\n\
float distanceToPixel = -positionEC.z;\n\
float inverseNear = 1.0 / czm_currentFrustum.x;\n\
float tanTheta = top * inverseNear;\n\
pixelHeight = 2.0 * distanceToPixel * tanTheta / height;\n\
tanTheta = right * inverseNear;\n\
pixelWidth = 2.0 * distanceToPixel * tanTheta / width;\n\
}\n\
return max(pixelWidth, pixelHeight);\n\
}\n\
",
        czm_modelToWindowCoordinates : "vec4 czm_modelToWindowCoordinates(vec4 position)\n\
{\n\
vec4 q = czm_modelViewProjection * position;\n\
q.xyz /= q.w;\n\
q.xyz = (czm_viewportTransformation * vec4(q.xyz, 1.0)).xyz;\n\
return q;\n\
}\n\
",
        czm_multiplyWithColorBalance : "vec3 czm_multiplyWithColorBalance(vec3 left, vec3 right)\n\
{\n\
const vec3 W = vec3(0.2125, 0.7154, 0.0721);\n\
vec3 target = left * right;\n\
float leftLuminance = dot(left, W);\n\
float rightLuminance = dot(right, W);\n\
float targetLuminance = dot(target, W);\n\
return ((leftLuminance + rightLuminance) / (2.0 * targetLuminance)) * target;\n\
}\n\
",
        czm_nearFarScalar : "float czm_nearFarScalar(vec4 nearFarScalar, float cameraDistSq)\n\
{\n\
float valueAtMin = nearFarScalar.y;\n\
float valueAtMax = nearFarScalar.w;\n\
float nearDistanceSq = nearFarScalar.x * nearFarScalar.x;\n\
float farDistanceSq = nearFarScalar.z * nearFarScalar.z;\n\
float t = (cameraDistSq - nearDistanceSq) / (farDistanceSq - nearDistanceSq);\n\
t = pow(clamp(t, 0.0, 1.0), 0.2);\n\
return mix(valueAtMin, valueAtMax, t);\n\
}\n\
",
        czm_octDecode : "vec3 czm_octDecode(vec2 encoded, float range)\n\
{\n\
if (encoded.x == 0.0 && encoded.y == 0.0) {\n\
return vec3(0.0, 0.0, 0.0);\n\
}\n\
encoded = encoded / range * 2.0 - 1.0;\n\
vec3 v = vec3(encoded.x, encoded.y, 1.0 - abs(encoded.x) - abs(encoded.y));\n\
if (v.z < 0.0)\n\
{\n\
v.xy = (1.0 - abs(v.yx)) * czm_signNotZero(v.xy);\n\
}\n\
return normalize(v);\n\
}\n\
vec3 czm_octDecode(vec2 encoded)\n\
{\n\
return czm_octDecode(encoded, 255.0);\n\
}\n\
vec3 czm_octDecode(float encoded)\n\
{\n\
float temp = encoded / 256.0;\n\
float x = floor(temp);\n\
float y = (temp - x) * 256.0;\n\
return czm_octDecode(vec2(x, y));\n\
}\n\
void czm_octDecode(vec2 encoded, out vec3 vector1, out vec3 vector2, out vec3 vector3)\n\
{\n\
float temp = encoded.x / 65536.0;\n\
float x = floor(temp);\n\
float encodedFloat1 = (temp - x) * 65536.0;\n\
temp = encoded.y / 65536.0;\n\
float y = floor(temp);\n\
float encodedFloat2 = (temp - y) * 65536.0;\n\
vector1 = czm_octDecode(encodedFloat1);\n\
vector2 = czm_octDecode(encodedFloat2);\n\
vector3 = czm_octDecode(vec2(x, y));\n\
}\n\
",
        czm_packDepth : "vec4 czm_packDepth(float depth)\n\
{\n\
vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * depth;\n\
enc = fract(enc);\n\
enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\n\
return enc;\n\
}\n\
",
        czm_phong : "float czm_private_getLambertDiffuseOfMaterial(vec3 lightDirectionEC, czm_material material)\n\
{\n\
return czm_getLambertDiffuse(lightDirectionEC, material.normal);\n\
}\n\
float czm_private_getSpecularOfMaterial(vec3 lightDirectionEC, vec3 toEyeEC, czm_material material)\n\
{\n\
return czm_getSpecular(lightDirectionEC, toEyeEC, material.normal, material.shininess);\n\
}\n\
vec4 czm_phong(vec3 toEye, czm_material material)\n\
{\n\
float diffuse = czm_private_getLambertDiffuseOfMaterial(vec3(0.0, 0.0, 1.0), material);\n\
if (czm_sceneMode == czm_sceneMode3D) {\n\
diffuse += czm_private_getLambertDiffuseOfMaterial(vec3(0.0, 1.0, 0.0), material);\n\
}\n\
float specular = czm_private_getSpecularOfMaterial(czm_sunDirectionEC, toEye, material) + czm_private_getSpecularOfMaterial(czm_moonDirectionEC, toEye, material);\n\
vec3 materialDiffuse = material.diffuse * 0.5;\n\
vec3 ambient = materialDiffuse;\n\
vec3 color = ambient + material.emission;\n\
color += materialDiffuse * diffuse;\n\
color += material.specular * specular;\n\
return vec4(color, material.alpha);\n\
}\n\
vec4 czm_private_phong(vec3 toEye, czm_material material)\n\
{\n\
float diffuse = czm_private_getLambertDiffuseOfMaterial(czm_sunDirectionEC, material);\n\
float specular = czm_private_getSpecularOfMaterial(czm_sunDirectionEC, toEye, material);\n\
vec3 ambient = vec3(0.0);\n\
vec3 color = ambient + material.emission;\n\
color += material.diffuse * diffuse;\n\
color += material.specular * specular;\n\
return vec4(color, material.alpha);\n\
}\n\
",
        czm_planeDistance : "float czm_planeDistance(vec4 plane, vec3 point) {\n\
return (dot(plane.xyz, point) + plane.w);\n\
}\n\
",
        czm_pointAlongRay : "vec3 czm_pointAlongRay(czm_ray ray, float time)\n\
{\n\
return ray.origin + (time * ray.direction);\n\
}\n\
",
        czm_rayEllipsoidIntersectionInterval : "\
            czm_raySegment czm_rayEllipsoidIntersectionInterval(czm_ray ray, czm_ellipsoid ellipsoid){\n\
                vec3 q = ellipsoid.inverseRadii * (czm_inverseModelView * vec4(ray.origin, 1.0)).xyz;\n\
                vec3 w = ellipsoid.inverseRadii * (czm_inverseModelView * vec4(ray.direction, 0.0)).xyz;\n\
                q = q - ellipsoid.inverseRadii * (czm_inverseModelView * vec4(ellipsoid.center, 1.0)).xyz;\n\
                float q2 = dot(q, q);\n\
                float qw = dot(q, w);\n\
                if (q2 > 1.0) {\n\
                    if (qw >= 0.0) {\n\
                        return czm_emptyRaySegment;\n\
                    } else {\n\
                        float qw2 = qw * qw;\n\
                        float difference = q2 - 1.0;\n\
                        float w2 = dot(w, w);\n\
                        float product = w2 * difference;\n\
                        if (qw2 < product) {\n\
                            return czm_emptyRaySegment;\n\
                        } else if (qw2 > product) {\n\
                            float discriminant = qw * qw - product;\n\
                            float temp = -qw + sqrt(discriminant);\n\
                            float root0 = temp / w2;\n\
                            float root1 = difference / temp;\n\
                            if (root0 < root1) {\n\
                                czm_raySegment i = czm_raySegment(root0, root1);\n\
                                return i;\n\
                            } else {\n\
                                czm_raySegment i = czm_raySegment(root1, root0);\n\
                                return i;\n\
                            }\n\
                        } else {\n\
                            float root = sqrt(difference / w2);\n\
                            czm_raySegment i = czm_raySegment(root, root);\n\
                            return i;\n\
                        }\n\
                    }\n\
                } else if (q2 < 1.0) {\n\
                    float difference = q2 - 1.0;\n\
                    float w2 = dot(w, w);\n\
                    float product = w2 * difference;\n\
                    float discriminant = qw * qw - product;\n\
                    float temp = -qw + sqrt(discriminant);\n\
                    czm_raySegment i = czm_raySegment(0.0, temp / w2);\n\
                    return i;\n\
                } else {\n\
                    if (qw < 0.0) {\n\
                        float w2 = dot(w, w);\n\
                        czm_raySegment i = czm_raySegment(0.0, -qw / w2);\n\
                        return i;\n\
                    } else {\n\
                        return czm_emptyRaySegment;\n\
                    }\n\
                }\n\
            }\n\
        ",
        czm_readDepth : "float czm_readDepth(sampler2D depthTexture, vec2 texCoords)\n\
{\n\
return czm_reverseLogDepth(texture2D(depthTexture, texCoords).r);\n\
}\n\
",
        czm_reverseLogDepth : "float czm_reverseLogDepth(float logZ)\n\
{\n\
#ifdef LOG_DEPTH\n\
float near = czm_currentFrustum.x;\n\
float far = czm_currentFrustum.y;\n\
logZ = pow(2.0, logZ * czm_log2FarPlusOne) - 1.0;\n\
logZ = far * (1.0 - near / logZ) / (far - near);\n\
#endif\n\
return logZ;\n\
}\n\
",
        czm_RGBToHSB : "const vec4 K_RGB2HSB = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n\
vec3 czm_RGBToHSB(vec3 rgb)\n\
{\n\
vec4 p = mix(vec4(rgb.bg, K_RGB2HSB.wz), vec4(rgb.gb, K_RGB2HSB.xy), step(rgb.b, rgb.g));\n\
vec4 q = mix(vec4(p.xyw, rgb.r), vec4(rgb.r, p.yzx), step(p.x, rgb.r));\n\
float d = q.x - min(q.w, q.y);\n\
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + czm_epsilon7)), d / (q.x + czm_epsilon7), q.x);\n\
}\n\
",
        czm_RGBToHSL : "vec3 RGBtoHCV(vec3 rgb)\n\
{\n\
vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0 / 3.0) : vec4(rgb.gb, 0.0, -1.0 / 3.0);\n\
vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);\n\
float c = q.x - min(q.w, q.y);\n\
float h = abs((q.w - q.y) / (6.0 * c + czm_epsilon7) + q.z);\n\
return vec3(h, c, q.x);\n\
}\n\
vec3 czm_RGBToHSL(vec3 rgb)\n\
{\n\
vec3 hcv = RGBtoHCV(rgb);\n\
float l = hcv.z - hcv.y * 0.5;\n\
float s = hcv.y / (1.0 - abs(l * 2.0 - 1.0) + czm_epsilon7);\n\
return vec3(hcv.x, s, l);\n\
}\n\
",
        czm_RGBToXYZ : "vec3 czm_RGBToXYZ(vec3 rgb)\n\
{\n\
const mat3 RGB2XYZ = mat3(0.4124, 0.2126, 0.0193,\n\
0.3576, 0.7152, 0.1192,\n\
0.1805, 0.0722, 0.9505);\n\
vec3 xyz = RGB2XYZ * rgb;\n\
vec3 Yxy;\n\
Yxy.r = xyz.g;\n\
float temp = dot(vec3(1.0), xyz);\n\
Yxy.gb = xyz.rg / temp;\n\
return Yxy;\n\
}\n\
",
        czm_saturation : "vec3 czm_saturation(vec3 rgb, float adjustment)\n\
{\n\
const vec3 W = vec3(0.2125, 0.7154, 0.0721);\n\
vec3 intensity = vec3(dot(rgb, W));\n\
return mix(intensity, rgb, adjustment);\n\
}\n\
",
        czm_shadowDepthCompare : "float czm_sampleShadowMap(samplerCube shadowMap, vec3 d)\n\
{\n\
return czm_unpackDepth(textureCube(shadowMap, d));\n\
}\n\
float czm_sampleShadowMap(sampler2D shadowMap, vec2 uv)\n\
{\n\
#ifdef USE_SHADOW_DEPTH_TEXTURE\n\
return texture2D(shadowMap, uv).r;\n\
#else\n\
return czm_unpackDepth(texture2D(shadowMap, uv));\n\
#endif\n\
}\n\
float czm_shadowDepthCompare(samplerCube shadowMap, vec3 uv, float depth)\n\
{\n\
return step(depth, czm_sampleShadowMap(shadowMap, uv));\n\
}\n\
float czm_shadowDepthCompare(sampler2D shadowMap, vec2 uv, float depth)\n\
{\n\
return step(depth, czm_sampleShadowMap(shadowMap, uv));\n\
}\n\
",
        czm_shadowVisibility : "float czm_private_shadowVisibility(float visibility, float nDotL, float normalShadingSmooth, float darkness)\n\
{\n\
#ifdef USE_NORMAL_SHADING\n\
#ifdef USE_NORMAL_SHADING_SMOOTH\n\
float strength = clamp(nDotL / normalShadingSmooth, 0.0, 1.0);\n\
#else\n\
float strength = step(0.0, nDotL);\n\
#endif\n\
visibility *= strength;\n\
#endif\n\
visibility = max(visibility, darkness);\n\
return visibility;\n\
}\n\
#ifdef USE_CUBE_MAP_SHADOW\n\
float czm_shadowVisibility(samplerCube shadowMap, czm_shadowParameters shadowParameters)\n\
{\n\
float depthBias = shadowParameters.depthBias;\n\
float depth = shadowParameters.depth;\n\
float nDotL = shadowParameters.nDotL;\n\
float normalShadingSmooth = shadowParameters.normalShadingSmooth;\n\
float darkness = shadowParameters.darkness;\n\
vec3 uvw = shadowParameters.texCoords;\n\
depth -= depthBias;\n\
float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);\n\
return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);\n\
}\n\
#else\n\
float czm_shadowVisibility(sampler2D shadowMap, czm_shadowParameters shadowParameters)\n\
{\n\
float depthBias = shadowParameters.depthBias;\n\
float depth = shadowParameters.depth;\n\
float nDotL = shadowParameters.nDotL;\n\
float normalShadingSmooth = shadowParameters.normalShadingSmooth;\n\
float darkness = shadowParameters.darkness;\n\
vec2 uv = shadowParameters.texCoords;\n\
depth -= depthBias;\n\
#ifdef USE_SOFT_SHADOWS\n\
vec2 texelStepSize = shadowParameters.texelStepSize;\n\
float radius = 1.0;\n\
float dx0 = -texelStepSize.x * radius;\n\
float dy0 = -texelStepSize.y * radius;\n\
float dx1 = texelStepSize.x * radius;\n\
float dy1 = texelStepSize.y * radius;\n\
float visibility = (\n\
czm_shadowDepthCompare(shadowMap, uv, depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy0), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy0), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy0), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, 0.0), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, 0.0), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx0, dy1), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(0.0, dy1), depth) +\n\
czm_shadowDepthCompare(shadowMap, uv + vec2(dx1, dy1), depth)\n\
) * (1.0 / 9.0);\n\
#else\n\
float visibility = czm_shadowDepthCompare(shadowMap, uv, depth);\n\
#endif\n\
return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);\n\
}\n\
#endif\n\
",
        czm_signNotZero : "float czm_signNotZero(float value)\n\
{\n\
return value >= 0.0 ? 1.0 : -1.0;\n\
}\n\
vec2 czm_signNotZero(vec2 value)\n\
{\n\
return vec2(czm_signNotZero(value.x), czm_signNotZero(value.y));\n\
}\n\
vec3 czm_signNotZero(vec3 value)\n\
{\n\
return vec3(czm_signNotZero(value.x), czm_signNotZero(value.y), czm_signNotZero(value.z));\n\
}\n\
vec4 czm_signNotZero(vec4 value)\n\
{\n\
return vec4(czm_signNotZero(value.x), czm_signNotZero(value.y), czm_signNotZero(value.z), czm_signNotZero(value.w));\n\
}\n\
",
        czm_tangentToEyeSpaceMatrix : "mat3 czm_tangentToEyeSpaceMatrix(vec3 normalEC, vec3 tangentEC, vec3 bitangentEC)\n\
{\n\
vec3 normal = normalize(normalEC);\n\
vec3 tangent = normalize(tangentEC);\n\
vec3 bitangent = normalize(bitangentEC);\n\
return mat3(tangent.x  , tangent.y  , tangent.z,\n\
bitangent.x, bitangent.y, bitangent.z,\n\
normal.x   , normal.y   , normal.z);\n\
}\n\
",
        czm_transformPlane : "vec4 czm_transformPlane(vec4 clippingPlane, mat4 transform) {\n\
vec3 transformedDirection = normalize((transform * vec4(clippingPlane.xyz, 0.0)).xyz);\n\
vec3 transformedPosition = (transform * vec4(clippingPlane.xyz * -clippingPlane.w, 1.0)).xyz;\n\
vec4 transformedPlane;\n\
transformedPlane.xyz = transformedDirection;\n\
transformedPlane.w = -dot(transformedDirection, transformedPosition);\n\
return transformedPlane;\n\
}\n\
",
        czm_translateRelativeToEye : "vec4 czm_translateRelativeToEye(vec3 high, vec3 low)\n\
{\n\
vec3 highDifference = high - czm_encodedCameraPositionMCHigh;\n\
vec3 lowDifference = low - czm_encodedCameraPositionMCLow;\n\
return vec4(highDifference + lowDifference, 1.0);\n\
}\n\
",
        czm_translucentPhong : "vec4 czm_translucentPhong(vec3 toEye, czm_material material)\n\
{\n\
float diffuse = czm_getLambertDiffuse(vec3(0.0, 0.0, 1.0), material.normal);\n\
if (czm_sceneMode == czm_sceneMode3D) {\n\
diffuse += czm_getLambertDiffuse(vec3(0.0, 1.0, 0.0), material.normal);\n\
}\n\
diffuse = clamp(diffuse, 0.0, 1.0);\n\
float specular = czm_getSpecular(czm_sunDirectionEC, toEye, material.normal, material.shininess);\n\
specular += czm_getSpecular(czm_moonDirectionEC, toEye, material.normal, material.shininess);\n\
vec3 materialDiffuse = material.diffuse * 0.5;\n\
vec3 ambient = materialDiffuse;\n\
vec3 color = ambient + material.emission;\n\
color += materialDiffuse * diffuse;\n\
color += material.specular * specular;\n\
return vec4(color, material.alpha);\n\
}\n\
",
        czm_transpose : "mat2 czm_transpose(mat2 matrix)\n\
{\n\
return mat2(\n\
matrix[0][0], matrix[1][0],\n\
matrix[0][1], matrix[1][1]);\n\
}\n\
mat3 czm_transpose(mat3 matrix)\n\
{\n\
return mat3(\n\
matrix[0][0], matrix[1][0], matrix[2][0],\n\
matrix[0][1], matrix[1][1], matrix[2][1],\n\
matrix[0][2], matrix[1][2], matrix[2][2]);\n\
}\n\
mat4 czm_transpose(mat4 matrix)\n\
{\n\
return mat4(\n\
matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0],\n\
matrix[0][1], matrix[1][1], matrix[2][1], matrix[3][1],\n\
matrix[0][2], matrix[1][2], matrix[2][2], matrix[3][2],\n\
matrix[0][3], matrix[1][3], matrix[2][3], matrix[3][3]);\n\
}\n\
",
        czm_unpackDepth : "float czm_unpackDepth(vec4 packedDepth)\n\
{\n\
return dot(packedDepth, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\n\
}\n\
",
        czm_unpackFloat : "#define SHIFT_RIGHT_8 0.00390625 //1.0 / 256.0\n\
#define SHIFT_RIGHT_16 0.00001525878 //1.0 / 65536.0\n\
#define SHIFT_RIGHT_24 5.960464477539063e-8//1.0 / 16777216.0\n\
#define BIAS 38.0\n\
float czm_unpackFloat(vec4 packedFloat)\n\
{\n\
packedFloat *= 255.0;\n\
float temp = packedFloat.w / 2.0;\n\
float exponent = floor(temp);\n\
float sign = (temp - exponent) * 2.0;\n\
exponent = exponent - float(BIAS);\n\
sign = sign * 2.0 - 1.0;\n\
sign = -sign;\n\
float unpacked = sign * packedFloat.x * float(SHIFT_RIGHT_8);\n\
unpacked += sign * packedFloat.y * float(SHIFT_RIGHT_16);\n\
unpacked += sign * packedFloat.z * float(SHIFT_RIGHT_24);\n\
return unpacked * pow(10.0, exponent);\n\
}\n\
",
        czm_vertexLogDepth : "#ifdef LOG_DEPTH\n\
varying float v_logZ;\n\
varying vec3 v_logPositionEC;\n\
#endif\n\
void czm_updatePositionDepth() {\n\
#if defined(LOG_DEPTH) && !defined(DISABLE_GL_POSITION_LOG_DEPTH)\n\
v_logPositionEC = (czm_inverseProjection * gl_Position).xyz;\n\
#ifdef ENABLE_GL_POSITION_LOG_DEPTH_AT_HEIGHT\n\
if (length(v_logPositionEC) < 2.0e6)\n\
{\n\
return;\n\
}\n\
#endif\n\
gl_Position.z = log2(max(1e-6, 1.0 + gl_Position.w)) * czm_log2FarDistance - 1.0;\n\
gl_Position.z *= gl_Position.w;\n\
#endif\n\
}\n\
void czm_vertexLogDepth()\n\
{\n\
#ifdef LOG_DEPTH\n\
v_logZ = 1.0 + gl_Position.w;\n\
czm_updatePositionDepth();\n\
#endif\n\
}\n\
void czm_vertexLogDepth(vec4 clipCoords)\n\
{\n\
#ifdef LOG_DEPTH\n\
v_logZ = 1.0 + clipCoords.w;\n\
czm_updatePositionDepth();\n\
#endif\n\
}\n\
",
        czm_windowToEyeCoordinates : "vec4 czm_windowToEyeCoordinates(vec4 fragmentCoordinate)\n\
{\n\
float x = 2.0 * (fragmentCoordinate.x - czm_viewport.x) / czm_viewport.z - 1.0;\n\
float y = 2.0 * (fragmentCoordinate.y - czm_viewport.y) / czm_viewport.w - 1.0;\n\
float z = (fragmentCoordinate.z - czm_viewportTransformation[3][2]) / czm_viewportTransformation[2][2];\n\
vec4 q = vec4(x, y, z, 1.0);\n\
q /= fragmentCoordinate.w;\n\
if (!(czm_inverseProjection == mat4(0.0)))\n\
{\n\
q = czm_inverseProjection * q;\n\
}\n\
else\n\
{\n\
float top = czm_frustumPlanes.x;\n\
float bottom = czm_frustumPlanes.y;\n\
float left = czm_frustumPlanes.z;\n\
float right = czm_frustumPlanes.w;\n\
float near = czm_currentFrustum.x;\n\
float far = czm_currentFrustum.y;\n\
q.x = (q.x * (right - left) + left + right) * 0.5;\n\
q.y = (q.y * (top - bottom) + bottom + top) * 0.5;\n\
q.z = (q.z * (near - far) - near - far) * 0.5;\n\
q.w = 1.0;\n\
}\n\
return q;\n\
}\n\
vec4 czm_windowToEyeCoordinates(vec2 fragmentCoordinateXY, float depthOrLogDepth)\n\
{\n\
#ifdef LOG_DEPTH\n\
float near = czm_currentFrustum.x;\n\
float far = czm_currentFrustum.y;\n\
float unscaledDepth = pow(2.0, depthOrLogDepth * czm_log2FarPlusOne) - 1.0;\n\
vec4 windowCoord = vec4(fragmentCoordinateXY, far * (1.0 - near / unscaledDepth) / (far - near), 1.0);\n\
vec4 eyeCoordinate = czm_windowToEyeCoordinates(windowCoord);\n\
eyeCoordinate.w = 1.0 / unscaledDepth;\n\
#else\n\
vec4 windowCoord = vec4(fragmentCoordinateXY, depthOrLogDepth, 1.0);\n\
vec4 eyeCoordinate = czm_windowToEyeCoordinates(windowCoord);\n\
#endif\n\
return eyeCoordinate;\n\
}\n\
",
        czm_writeDepthClampedToFarPlane : "#ifndef LOG_DEPTH\n\
varying float v_WindowZ;\n\
#endif\n\
void czm_writeDepthClampedToFarPlane()\n\
{\n\
#if defined(GL_EXT_frag_depth) && !defined(LOG_DEPTH)\n\
gl_FragDepthEXT = min(v_WindowZ * gl_FragCoord.w, 1.0);\n\
#endif\n\
}\n\
",
        czm_writeLogDepth : "#ifdef LOG_DEPTH\n\
varying float v_logZ;\n\
#endif\n\
void czm_writeLogDepth(float logZ)\n\
{\n\
#if defined(GL_EXT_frag_depth) && defined(LOG_DEPTH) && !defined(DISABLE_LOG_DEPTH_FRAGMENT_WRITE)\n\
float halfLogFarDistance = czm_log2FarDistance * 0.5;\n\
float depth = log2(logZ);\n\
if (depth < czm_log2NearDistance) {\n\
discard;\n\
}\n\
gl_FragDepthEXT = depth * halfLogFarDistance;\n\
#endif\n\
}\n\
void czm_writeLogDepth() {\n\
#ifdef LOG_DEPTH\n\
czm_writeLogDepth(v_logZ);\n\
#endif\n\
}\n\
",
        czm_XYZToRGB : "vec3 czm_XYZToRGB(vec3 Yxy)\n\
{\n\
const mat3 XYZ2RGB = mat3( 3.2405, -0.9693,  0.0556,\n\
-1.5371,  1.8760, -0.2040,\n\
-0.4985,  0.0416,  1.0572);\n\
vec3 xyz;\n\
xyz.r = Yxy.r * Yxy.g / Yxy.b;\n\
xyz.g = Yxy.r;\n\
xyz.b = Yxy.r * (1.0 - Yxy.g - Yxy.b) / Yxy.b;\n\
return XYZ2RGB * xyz;\n\
}\n\
"
   };

    return CzmBuiltins;
});