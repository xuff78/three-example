// 引入three.js
import * as THREE from 'three'
import { config } from './config'

// 通过一系列坐标点生成一条轨迹线
function createLine(jsonData, projection) {
  const lines = new THREE.Object3D()
  jsonData.features.forEach((line) => {
    const pointsArr = []
    line.geometry.coordinates.forEach((coords) => {
      for (const ll of coords[0]) {
        const [x, y] = projection(ll)
        pointsArr.push(x, -y, 0)
      }
    })
    const geometry = new THREE.BufferGeometry()
    //类型数组创建顶点数据
    const vertices = new Float32Array(pointsArr)
    // 创建属性缓冲区对象
    const attribue = new THREE.BufferAttribute(vertices, 3)
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue
    // 线条渲染几何体顶点数据
    const material = new THREE.LineBasicMaterial({
      color: 0x006666, //线条颜色
    })
    const lineMesh = new THREE.Line(geometry, material)
    lines.add(lineMesh)
  })
  return lines
}

// 创建流线轨迹
function getFlyLine(jsonData, projection) {
  // const breakNum = [[150, 250], [400, 500], [1000, 1000]]
  // let segmentIndex = 0
  const lines = new THREE.Object3D()
  jsonData.features.forEach((line) => {
    const flypointsArr = []
    // for (let i = 0; i < line.geometry.coordinates.length; i++) {
    const coords = line.geometry.coordinates[0][0]
    // coords.splice(0, 1000)
    // coords.splice(1000, 1000)
    // console.log('coords', coords)
    for (const ll of coords) {
      const [x, y] = projection(ll)
      flypointsArr.push([x, -y])
    }
    // }
    const v3Arr = []
    flypointsArr.forEach(function (coord) {
      v3Arr.push(new THREE.Vector3(coord[0], coord[1], config.mapConfig.deep))
    })
    // 三维样条曲线
    const curve = new THREE.CatmullRomCurve3(v3Arr)
    //曲线上等间距返回多个顶点坐标
    const points = curve.getSpacedPoints(800) //分段数

    // const index = 20; //取点索引位置
    let index = Math.floor((points.length - 35) * Math.random()) //取点索引位置随机
    const num = 50 //从曲线上获取点数量
    let points2 = points.slice(index, index + num) //从曲线上获取一段
    const curve2 = new THREE.CatmullRomCurve3(points2)
    const newPoints2 = curve2.getSpacedPoints(100) //获取更多的点数
    const geometry2 = new THREE.BufferGeometry()
    geometry2.setFromPoints(newPoints2)

    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    const percentArr = [] //attributes.percent的数据
    // 批量计算所有顶点颜色数据
    const colorArr = []
    const half = Math.floor(newPoints2.length / 2)
    for (let i = 0; i < newPoints2.length; i++) {
      if (i < half) {
        percentArr.push(i / half)
        const color1 = new THREE.Color(0x006666) //轨迹线颜色 青色
        const color2 = new THREE.Color(0x00ffff) //更亮青色
        const color = color1.lerp(color2, i / half)
        colorArr.push(color.r, color.g, color.b)
      } else {
        percentArr.push(1 - (i - half) / half)
        const color1 = new THREE.Color(0x00ffff) //更亮青色
        const color2 = new THREE.Color(0x006666) //轨迹线颜色 青色
        const color = color1.lerp(color2, (i - half) / half)
        colorArr.push(color.r, color.g, color.b)
      }
    }
    const percentAttribue = new THREE.BufferAttribute(new Float32Array(percentArr), 1)
    geometry2.attributes.percent = percentAttribue
    // 设置几何体顶点颜色数据
    geometry2.attributes.color = new THREE.BufferAttribute(new Float32Array(colorArr), 3)

    // 点模型渲染几何体每个顶点
    const PointsMaterial = new THREE.PointsMaterial({
      // color: 0xffff00,
      size: 20.0, //点大小 考虑相机渲染范围设置
      // vertexColors: THREE.VertexColors, //使用顶点颜色渲染
      transparent: true, //开启透明计算
      depthTest: false,
    })
    const flyPoints = new THREE.Points(geometry2, PointsMaterial)

    // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
    PointsMaterial.onBeforeCompile = function (shader) {
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
        ['gl_PointSize = percent *size;'].join('\n'), // .join()把数组元素合成字符串
      )

      shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment)
    }

    // 飞线动画
    const indexMax = points.length - num //飞线取点索引范围
    // console.log('indexMax', indexMax)
    function animation() {
      // console.log('index', index)
      index += 1
      points2 = points.slice(index, index + num) //从曲线上获取一段
      const curve = new THREE.CatmullRomCurve3(points2)
      const newPoints2 = curve.getSpacedPoints(100) //获取更多的点数
      geometry2.setFromPoints(newPoints2)

      if (index > indexMax) {
        index = 0
        // segmentIndex = 0
      }
      // } else if (index > breakNum[segmentIndex][0]) {
      //   index = breakNum[segmentIndex][1]
      //   segmentIndex++
      //   // setTimeout(() => {
      //   //   requestAnimationFrame(animation)
      //   // }, 2000)
      //   // return
      // }
      requestAnimationFrame(animation)
    }

    animation()
    lines.add(flyPoints)
  })

  return lines
}

const output_fragment = `
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= transmissionAlpha + 0.1;
#endif

// 设置透明度变化
float r = distance(gl_PointCoord, vec2(0.5, 0.5));
// diffuseColor.a = diffuseColor.a*(1.0 - r/0.5);//透明度线性变化
diffuseColor.a = diffuseColor.a*pow( 1.0 - r/0.5, 6.0 );//透明度非线性变化  参数2越大，gl_PointSize要更大，可以直接设置着色器代码，可以设置材质size属性
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`

export { createLine, getFlyLine }
