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
const vec3 floorColor = vec3(207./255., 43./255., 232./255.);
int index = int(vPosition.z) / 12;
if (index >= 0) {
  float i = float(index) * 12.;
  if(vPosition.z > i && vPosition.z < i + 7.){
    gradient = mix(vec3(0.0,0.0,0.0), floorColor, i / 20.0);
  }
}

// 在光照影响明暗的基础上，设置渐变
outgoingLight = outgoingLight*gradient;

float r0 = time * 10.0;
float w = 4.0; // 光环宽度一半，单位米
vec2 center = vec2(-345588.73219503777, -93622.79832424669);//几何中心坐标坐标
float L = distance(vPosition.xy, center); // 距离圆心距离center
if(L > r0 && L < r0 + 3.0 * w && time > 0.0) {
    // 渐变色光带
    float per = 0.0;
    if(L < r0 + 2.0 * w) {
        per = (L - r0) / w / 3.0;
        outgoingLight = mix( outgoingLight, vec3(0.0, 1.0, 1.0), per);
    } else {
        per = (L - r0 - 2.0 * w) / w;
        outgoingLight = mix( vec3(1.0, 0.0, 0.0), outgoingLight, per);
    }
}
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`
