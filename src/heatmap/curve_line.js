import * as THREE from 'three'
import turfCenter from '@turf/center'
import { point, featureCollection } from '@turf/helpers'
const num = 15
const linePointNum = 100
const lightPointNum = 100
class CurveLine {
  constructor(scene, projection) {
    this.scene = scene
    this.lineList = []
    this.projection = projection
  }

  setCurvelines(datas = []) {
    datas.forEach((item) => {
      const { start, end } = item
      let center = turfCenter(featureCollection([point(start), point(end)]))
      center = center.geometry.coordinates
      this.addCurveline(
        this.getProjectPosition(start, 3),
        this.getProjectPosition(center, 10),
        this.getProjectPosition(end, 3),
      )
    })
  }

  getProjectPosition(point, h) {
    const [x, y] = this.projection(point)
    return new THREE.Vector3(x, -y, h)
  }

  addCurveline(start, mid, end) {
    const model = new THREE.Group()
    const geometry = new THREE.BufferGeometry()
    const curve = new THREE.CatmullRomCurve3([start, mid, end])
    const points = curve.getSpacedPoints(linePointNum)
    geometry.setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: '#00ffff',
    })
    const line = new THREE.Line(geometry, material)
    model.add(line)

    let index = 0
    const lightGeometry = new THREE.BufferGeometry()
    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    const percentArr = []
    for (let i = 0; i < lightPointNum; i++) {
      percentArr.push(i / lightPointNum)
    }
    const percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1)
    lightGeometry.attributes.percent = percentAttribue
    // 批量计算所有顶点颜色数据
    const colorArr = []
    for (let i = 0; i < lightPointNum; i++) {
      const color1 = new THREE.Color(0x006666)
      const color2 = new THREE.Color(0xffff00)
      const color = color1.lerp(color2, i / lightPointNum)
      colorArr.push(color.r, color.g, color.b)
    }
    // 设置几何体顶点颜色数据
    lightGeometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3)

    // 点模型渲染几何体每个顶点
    const pointsMaterial = new THREE.PointsMaterial({
      color: '#ffff00',
      size: 1.0, //点大小
    })
    const flyPoints = new THREE.Points(lightGeometry, pointsMaterial)
    model.add(flyPoints)
    // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
    pointsMaterial.onBeforeCompile = function (shader) {
      // 顶点着色器中声明一个attribute变量:百分比
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        [
          'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
          'void main() {',
        ].join('\n'), // .join()把数组元素合成字符串
      )
      // 调整点渲染大小计算方式
      shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        ['gl_PointSize = percent * size;'].join('\n'), // .join()把数组元素合成字符串
      )
    }
    const maxIndex = points.length - 5
    const lineObject = {
      points,
      lightGeometry,
      index,
      maxIndex,
    }
    this.lineList.push(lineObject)
    this.scene.add(model)

    setTimeout(() => {
      this.startAnimation(lineObject)
    }, Math.round(Math.random() * 3000))
  }

  startAnimation(lineObject) {
    if (lineObject.index > lineObject.maxIndex) lineObject.index = 0
    lineObject.index += 1
    const nextLinePoints = lineObject.points.slice(lineObject.index, lineObject.index + num)
    const curve = new THREE.CatmullRomCurve3(nextLinePoints)
    const newLinePoints = curve.getSpacedPoints(lightPointNum)
    lineObject.lightGeometry.setFromPoints(newLinePoints)
    requestAnimationFrame(this.startAnimation.bind(this, lineObject))
  }
}
export default CurveLine
