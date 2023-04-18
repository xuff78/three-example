import { lon2xy } from '../utils/math.js'
import * as THREE from 'three'
export function addWallFlow(buildGroup, coord) {
  const c = []
  coord.forEach((lngLat) => {
    const xy = lon2xy(lngLat[0], lngLat[1])
    c.push(xy.x, xy.y)
  })
  addModel(buildGroup, c)
}

function addModel(buildGroup, c) {
  // console.log('c', c)
  const posArr = []
  const uvrr = []
  const h = 80
  for (let i = 0; i < c.length - 2; i += 2) {
    // 围墙多边形上两个点构成一个直线扫描出来一个高度为h的矩形
    // 矩形的三角形1
    posArr.push(c[i], c[i + 1], 0, c[i + 2], c[i + 3], 0, c[i + 2], c[i + 3], h)
    // 矩形的三角形2
    posArr.push(c[i], c[i + 1], 0, c[i + 2], c[i + 3], h, c[i], c[i + 1], h)

    // 注意顺序问题，和顶点位置坐标对应
    uvrr.push(0, 0, 1, 0, 1, 1)
    uvrr.push(0, 0, 1, 1, 0, 1)
  }
  let geometry = new THREE.BufferGeometry()
  geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(posArr), 3)
  geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uvrr), 2)
  geometry.computeVertexNormals()
  let texture = new THREE.TextureLoader().load('/public/texture/flow.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.x = 2

  const flowAnimation = () => {
    requestAnimationFrame(flowAnimation)
    // 使用加减法可以设置不同的运动方向
    // 设置纹理偏移
    // y方向流量  光带流动效果
    // console.log(texture)
    texture.offset.y -= 0.02
  }
  flowAnimation(texture)

  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    map: texture,
    side: THREE.DoubleSide, //两面可见
    transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
    // opacity: 0.5,//整体改变透明度
    depthTest: true,
  })
  let mesh = new THREE.Mesh(geometry, material)
  // mesh.rotateX(-Math.PI / 2)
  buildGroup.add(mesh)

  let mesh2 = mesh.clone()
  mesh2.material = mesh.material.clone()
  mesh2.material.map = new THREE.TextureLoader().load('/public/texture/wall_img.png')
  mesh2.material.color.set(0x00ffff)
  // mesh2.scale.set(1.01, 1.01, 1.0)
  buildGroup.add(mesh2)
}
