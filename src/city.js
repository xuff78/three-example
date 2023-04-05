import '@/public.css'
import { Stage } from '@/utils/stage'
import * as THREE from 'three'
import { addBuildings } from './city/building'
import { lon2xy } from './utils/math.js'
import { addRiver } from './city/river'

const mousePos = new THREE.Vector2()
let stage, container
const setData = async () => {
    const { scene } = stage
    const buildGroup = new THREE.Group()
    await addBuildings(buildGroup)
    await addRiver(buildGroup)
    scene.add(buildGroup)
    // scene.add(getEarth())
    // const result = await axios.get(`/public/data/heatmapData.json`)
    // scene.add(getMapGeometry(provinceData, edgeLightObj, projection))
    stage.animate()
}

const initStage = (stage) => {
    const { controls, scene, camera } = stage
    controls.enablePan = true
    controls.minDistance = 100
    controls.maxDistance = 20000
    controls.minAzimuthAngle = -Math.PI / 4
    controls.maxAzimuthAngle = Math.PI / 4
    // controls.minPolarAngle = 1
    // controls.maxPolarAngle = Math.PI - 0.1

    // const ambientLight = new THREE.AmbientLight(0x404040, 1.8)
    // scene.add(ambientLight)
    //
    // const test = new THREE.PointLight('#ffffff', 1.8, 1000)
    // test.position.set(200, 400, 300)
    // scene.add(test)
    // const testHelperMap = new THREE.PointLightHelper(test)
    // scene.add(testHelperMap)
    //
    // const pointLightMap = new THREE.PointLight('#4161ff', 1.4, 20)
    // pointLightMap.position.set(0, 7, 3)
    // scene.add(pointLightMap)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 400, 300)
    scene.add(directionalLight)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-200, -400, 300);
    scene.add(directionalLight2)
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // camera.position.set(-2, -2, 11.63) // 0, -5, 1
    const E = 121.49526536464691;//东方明珠经纬度坐标
    const N = 31.24189350905988;
    const p = lon2xy(E,N);
    camera.position.set(13524889, 3657486, 5465)
    camera.lookAt(p.x, p.y, 0)
    controls.target.set(p.x, p.y,0);

    // 点击地图事件
    const onClick = () => {}

    const onMouseMove = (event) => {
        mousePos.x = (event.layerX / container.clientWidth) * 2 - 1
        mousePos.y = -(event.layerY / container.clientHeight) * 2 + 1
    }
    container.addEventListener('mousemove', onMouseMove, false)
    container.addEventListener('click', onClick)
}

container = document.getElementById('container')
if (container) {
    stage = new Stage(container)
    initStage(stage)
    setData()
}
