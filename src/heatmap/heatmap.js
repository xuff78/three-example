import { vertexShader, fragmentShader } from './glsl'
import * as THREE from 'three'
class HeatmapImage {
  constructor(scene) {
    const radius = 10
    this.heatmap = window.h337.create({
      container: document.getElementById('heatmap'),
      gradient: {
        0.5: '#1fc2e1',
        0.6: '#24d560',
        0.7: '#9cd522',
        0.8: '#f1e12a',
        0.9: '#ffbf3a',
        1.0: '#ff0000',
      },
      // blur: 0.75,
      radius: radius,
      maxOpacity: 1,
    })
    this.greymap = window.h337.create({
      container: document.getElementById('greymap'),
      gradient: {
        0: 'black',
        '1.0': 'white',
      },
      radius: radius,
      maxOpacity: 1,
    })
    // console.log('greymap', this.greymap)
    this.initMesh(scene)
  }

  setRandomData(points, projection) {
    points = points.map((point) => {
      const [x, y] = projection([point[1], point[0]])
      // console.log('points', x, y)
      return { x: Math.floor(x * 5 + 250), y: Math.floor(y * 5 + 250), value: point[2] }
    })
    // console.log('points', points)
    const max = 30000
    const min = 0
    this.heatmap.setData({
      max,
      min,
      data: points,
    })
    this.greymap.setData({
      max,
      min,
      data: points,
    })
  }

  setHeatData(points, projection) {
    this.setRandomData(points, projection)
    let texture = new THREE.Texture(this.heatmap._config.container.children[0])
    texture.needsUpdate = true
    let texture2 = new THREE.Texture(this.greymap._config.container.children[0])
    texture2.needsUpdate = true
    this.heatMapPlane.material.uniforms.heatMap.value = texture
    this.heatMapPlane.material.side = THREE.DoubleSide // 双面渲染
    this.heatMapPlane.material.uniforms.greyMap.value = texture2
  }

  initMesh(scene) {
    let geometry = new THREE.PlaneGeometry(100, 100, 500, 500)
    let material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        heatMap: {
          value: { value: undefined },
        },
        greyMap: {
          value: { value: undefined },
        },
        Zscale: { value: 4.0 },
        u_color: {
          value: new THREE.Color('rgb(255, 255, 255)'),
        },
        u_opacity: {
          value: 1.0,
        },
      },
    })

    this.heatMapPlane = new THREE.Mesh(geometry, material)
    this.heatMapPlane.position.set(0, 0, 4)
    scene.add(this.heatMapPlane)
  }
}

export { HeatmapImage }
