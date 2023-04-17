export default `
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif
// 线性渐变
// vec3 gradient = mix(vec3(0.0,0.0,0.0), vec3(0.7,0.7,0.7), sqrt(vPosition.z/ 80.0));
// 非线性渐变  小部分楼层太高，不同高度矮楼层颜色对比不明显,可以采用非线性渐变方式调节
vec3 gradient = mix(vec3(0.1,0.1,0.1), vec3(0.33,0.33,0.33), vPosition.z / 50.0);
int addition = int(time) % 2;
float buildingColors[15] = float[](1., 0.45098039215686275, 0.39215686274509803, 0.06274509803921569, 0.40784313725490196, 0.7490196078431373, 1., 0.6470588235294118, 0., 1., 0.45098039215686275, 0.39215686274509803, 0.1803921568627451, 0.7215686274509804, 0.7215686274509804);
if (vHeight > 45. && vPosition.z < vHeight - 5.) {
    int index = int(vPosition.z) / 12;
    if (index >= 0) {
      float i = float(index) * 12.;
      if(vPosition.z < i + 8.){
        int num = (index % 3 + addition) * 3;
        vec3 floorColor = vec3(buildingColors[num], buildingColors[num + 1], buildingColors[num + 2]);
        // gradient = mix(vec3(0.0,0.0,0.0), floorColor, i / 40.0);
        gradient = floorColor;
      }
    }
}

// 在光照影响明暗的基础上，设置渐变
outgoingLight = outgoingLight*gradient;

if (uClickPosition.x != 0. && uClickPosition.y != 0.) {
    float L = distance(vPosition.xy, uClickPosition); // 距离圆心距离center
    // float r0 = time * 100.0;
    // float w = 100.0; // 光环宽度一半，单位米
    // if(L > r0 && L < r0 + 3.0 * w && time > 0.0) {
    //     // 渐变色光带
    //     float per = 0.0;
    //     if(L < r0 + 2.0 * w) {
    //         per = (L - r0) / w / 3.0;
    //         outgoingLight = mix( outgoingLight, vec3(0.0, 1.0, 1.0), per);
    //     } else {
    //         per = (L - r0 - 2.0 * w) / w;
    //         outgoingLight = mix( vec3(1.0, 0.0, 0.0), outgoingLight, per);
    //     }
    // }
    float radius = 300.0; // 光环宽度一半，单位米
    if(L < radius) {
        float per = L / radius;
        outgoingLight = mix(vec3(0.6, 0.6, 0.6), outgoingLight, per);
    }
}

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`
