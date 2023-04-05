import output_fragment from './building_fragment.js'
import axios from 'axios'
import * as THREE from 'three'
import { lon2xy } from '../utils/math.js'
let buildingShader = null

const addBuildings = async (buildGroup) => {
  const result = await axios.get(`/public/data/shanghai.json`)
  const fs = result.data.features
  const material = getBuildingMaterial()
  fs.forEach((f) => {
    const geometry = getExtrudeGeometry(f.geometry.coordinates, f.properties.Floor * 4)
    const mesh = new THREE.Mesh(geometry, material)
    buildGroup.add(mesh)

    // let edges = new THREE.EdgesGeometry(geometry)
    // let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#666666' }))
    // buildGroup.add(line)
  })
}
function getExtrudeGeometry(coords, height) {
  let shapeArr = [] //轮廓形状Shape集合
  coords.forEach((pointsArr) => {
    let vector2Arr = []
    // 转化为Vector2构成的顶点数组
    pointsArr.forEach((lngLat) => {
      const xy = lon2xy(lngLat[0], lngLat[1]) //经纬度转墨卡托坐标
      vector2Arr.push(new THREE.Vector2(xy.x, xy.y))
    })
    let shape = new THREE.Shape(vector2Arr)
    shapeArr.push(shape)
  })
  // console.log('shapeArr', shapeArr)

  const geometry = new THREE.ExtrudeGeometry( //拉伸造型
    shapeArr, //多个多边形二维轮廓
    //拉伸参数
    {
      depth: height, //拉伸高度
      bevelEnabled: false, //无倒角
    },
  )
  return geometry
}
function getBuildingMaterial() {
  // const texture = new window.THREE.TextureLoader().load('../data/texture/wall.png')
  // texture.wrapS = window.THREE.RepeatWrapping
  // texture.wrapT = window.THREE.RepeatWrapping
  const material = new THREE.MeshLambertMaterial({
    color: '#cccccc', //颜色
    // map: texture,
  })
  // GPU执行material对应的着色器代码前，通过.onBeforeCompile()插入新的代码，修改已有的代码
  material.onBeforeCompile = function (shader) {
    buildingShader = shader
    shader.uniforms.time = { value: 0.0 }
    // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      ['varying vec3 vPosition;', 'void main() {', 'vPosition = position;'].join('\n'), // .join()把数组元素合成字符串
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      ['varying vec3 vPosition;', 'uniform float time;', 'void main() {'].join('\n'),
    )
    shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment)
    // console.log('shader.fragmentShader', shader.fragmentShader)
  }
  return material
}
export { addBuildings, buildingShader }
