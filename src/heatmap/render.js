import * as THREE from 'three'
import { config } from './config'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

const loader = new THREE.FileLoader()
// 地图模型
function getMapGeometry(jsonData, edgeLightObj, projection) {
  // 初始化一个地图对象
  const map = new THREE.Object3D()

  jsonData.features.forEach((elem) => {
    // 定一个省份3D对象
    const province = new THREE.Object3D()
    // 每个的 坐标 数组
    const coordinates = elem.geometry.coordinates
    // 循环坐标数组
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        const shape = new THREE.Shape()
        const lineMaterial = new THREE.LineBasicMaterial({
          color: '#bbbbbb',
          // linewidth: 1,
          // linecap: 'round', //ignored by WebGLRenderer
          // linejoin:  'round' //ignored by WebGLRenderer
        })
        const lineGeometry = new THREE.BufferGeometry()
        const pointsArray = []
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i])
          // console.log('xy', x, -y)
          if (i === 0) {
            shape.moveTo(x, -y)
          }
          shape.lineTo(x, -y)
          pointsArray.push(new THREE.Vector3(x, -y, config.mapConfig.deep))

          // 做边缘流光效果，把所有点保存下来
          edgeLightObj.mapEdgePoints.push([x, -y, config.mapConfig.deep])
        }
        // console.log(pointsArray);
        lineGeometry.setFromPoints(pointsArray)

        const extrudeSettings = {
          depth: config.mapConfig.deep,
          bevelEnabled: false, // 对挤出的形状应用是否斜角
        }

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
        const material = new THREE.MeshPhongMaterial({
          color: '#4161ff',
          transparent: true,
          opacity: 0.4,
          side: THREE.FrontSide,
          // depthTest: true,
        })
        const material1 = new THREE.MeshLambertMaterial({
          color: '#000080', // #000080 00ffff
          transparent: true,
          opacity: 0.7,
          side: THREE.FrontSide,
          // wireframe: true
        })
        const mesh = new THREE.Mesh(geometry, [material, material1])
        const line = new THREE.Line(lineGeometry, lineMaterial)
        // 将省份的属性 加进来
        province.properties = elem.properties

        // 将城市信息放到模型中，后续做动画用
        if (elem.properties.centroid) {
          const [x, y] = projection(elem.properties.centroid) // uv映射坐标
          province.properties._centroid = [x, y]
        }

        // console.log(elem.properties)
        // cityName && province.add(cityName)
        province.add(mesh)
        province.add(line)

        const cityName = getCityLabel(elem)
        cityName && province.add(cityName)
      })
    })
    // province.scale.set(5, 5, 0);
    // province.position.set(0, 0, 0);
    // console.log(province);
    map.add(province)
  })
  return map
}

function loadJSON(url) {
  return new Promise((resolve) => {
    loader.load(url, (data) => {
      const jsondata = JSON.parse(data)
      resolve(jsondata)
    })
  })
}

function getEarth() {
  const geometry = new THREE.PlaneGeometry(500.0, 500.0)
  const texture = new THREE.TextureLoader().load('/public/img/china.jpg')
  const bumpTexture = new THREE.TextureLoader().load('/public/img/china.jpg')
  // texture.wrapS = THREE.RepeatWrapping // 质地.包裹
  // texture.wrapT = THREE.RepeatWrapping

  const material = new THREE.MeshPhongMaterial({
    map: texture, // 贴图
    bumpMap: bumpTexture,
    bumpScale: 0.05,
    // specularMap: texture,
    // specular: 0xffffff,
    // shininess: 1,
    // color: "#000000",
    side: THREE.FrontSide,
  })
  const earthPlane = new THREE.Mesh(geometry, material)
  return earthPlane
}

function getCityLabel(elem) {
  if (elem.properties._centroid) {
    const label = document.createElement('div')
    label.style.fontSize = '14px'
    label.style.color = '#ccc'
    label.style.fontStyle = 'italic'
    label.textContent = elem.properties.name
    const moonLabel = new CSS2DObject(label)
    const y = -elem.properties._centroid[1]
    const x = elem.properties._centroid[0]
    moonLabel.position.set(x, y, 4)
    return moonLabel
  }
  return null
  // moon.add( moonLabel );
  // moonLabel.layers.set( 0 );
}
export { getEarth, getMapGeometry, loadJSON }
