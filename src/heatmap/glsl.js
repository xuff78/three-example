const vertexShader = `varying vec2 vUv;
uniform float Zscale;
uniform sampler2D greyMap;
void main() {
    vUv = uv;
    vec4 frgColor = texture2D(greyMap, uv);
    float height = Zscale * frgColor.a;
    vec3 transformed = vec3( position.x, position.y, height);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`
const fragmentShader = `#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
uniform sampler2D heatMap;
uniform vec3 u_color;//基础颜色
uniform float u_opacity; // 透明度
void main() {
    gl_FragColor = vec4(u_color, u_opacity) * texture2D(heatMap, vUv);
}`

export { vertexShader, fragmentShader }
