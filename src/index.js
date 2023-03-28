import './public.css'
import { Stage } from './heatmap/stage'
import { getEarth, getMapGeometry, loadJSON } from './heatmap/render'
import { resetCameraTween } from './heatmap/anima'
import { getFlyLine } from './heatmap/flyline'
import { HeatmapImage } from './heatmap/heatmap'
import CurveLine from './heatmap/curve_line'
import * as THREE from 'three'
import * as d3 from 'd3'
import axios from 'axios'

let stage, lastPick, container, heatmapImage
const edgeLightObj = {
    mapEdgePoints: [],
    lightOpacityGeometry: null, // 单独把geometry提出来，动画用
    // 边缘流光参数
    lightSpeed: 1,
    lightCurrentPos: 0,
    lightOpacitys: null,
}
const cameraPosArr = [{ x: -3.1918956749280327, y: -63.516983111305684, z: 134.45709969517597 }] // [{ x: -2.65, y: -98.26, z: 111.63 }]
const raycaster = new THREE.Raycaster()
const mousePos = new THREE.Vector2()
let projection
const setData = async () => {
    const { scene } = stage
    scene.add(getEarth())
    const provinceData = await loadJSON('/public/data/province.json')
    scene.add(getMapGeometry(provinceData, edgeLightObj, projection))
    const chinaData = await loadJSON('/public/data/china2.json')
    scene.add(getFlyLine(chinaData, projection))
    const curveLine = new CurveLine(scene, projection)
    const listData = [
        { start: [116.397128, 39.916527], end: [86.559634, 41.851607] },
        { start: [116.397128, 39.916527], end: [120.11188, 44.479308] },
        { start: [116.397128, 39.916527], end: [94.008364, 37.873169] },
        { start: [116.397128, 39.916527], end: [88.855776, 29.365955] },
        { start: [116.397128, 39.916527], end: [114.278139, 30.579343] },
        { start: [116.397128, 39.916527], end: [105.675845, 29.628917] },
        { start: [116.397128, 39.916527], end: [112.201723, 44.416564] },
    ]
    curveLine.setCurvelines(listData)
    // curveLine.startAnimation()
    stage.animate()
    heatmapImage = new HeatmapImage(scene)
    const result = await axios.get(`/public/data/heatmapData.json`)
    heatmapImage.setHeatData(result.data.data, projection)
}

const beforeRender = () => {
    animationMouseover()
}

const initStage = (stage) => {
    const { controls, scene, camera } = stage
    controls.enablePan = false
    controls.minDistance = 50
    controls.maxDistance = 160
    controls.minAzimuthAngle = -Math.PI / 4
    controls.maxAzimuthAngle = Math.PI / 4
    controls.minPolarAngle = 1
    controls.maxPolarAngle = Math.PI - 0.1
    const ambientLight = new THREE.AmbientLight(0x404040, 1.8)
    scene.add(ambientLight)
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
    // scene.add(directionalLight)

    const test = new THREE.PointLight('#ffffff', 1.8, 20)
    test.position.set(10, 15, 7)
    scene.add(test)
    const testHelperMap = new THREE.PointLightHelper(test)
    scene.add(testHelperMap)

    const pointLightMap = new THREE.PointLight('#4161ff', 1.4, 20)
    pointLightMap.position.set(0, 7, 3)
    scene.add(pointLightMap)

    camera.position.set(-2.65, -98.26, 111.63) // 0, -5, 1
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // 点击地图事件
    const onClick = () => {
        // console.log('click', camera.position)
        if (lastPick && 'point' in lastPick) {
            // console.log('click', lastPick.object.parent.properties._centroid, lastPick.point)
            // mapClickTween(lastPick.object.parent.properties._centroid, controls, camera)
        } else resetCameraTween(controls, camera, cameraPosArr)
    }

    const onMouseMove = (event) => {
        mousePos.x = (event.layerX / container.clientWidth) * 2 - 1
        mousePos.y = -(event.layerY / container.clientHeight) * 2 + 1
    }
    container.addEventListener('mousemove', onMouseMove, false)
    container.addEventListener('dblclick', onClick)
}

const animationMouseover = () => {
    const { scene, camera } = stage
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mousePos, camera)
    // 计算物体和射线的焦点，与当场景相交的对象有那些
    const intersects = raycaster.intersectObjects(
        scene.children,
        true, // true，则同时也会检测所有物体的后代
    )
    // 恢复上一次清空的
    if (lastPick) {
        lastPick.object.material[0].color.set('#4161ff')
        lastPick.object.material[0].opacity = 0.4
        lastPick.object.parent.position.set(0, 0, 0)
        const lines = lastPick.object.parent.children.filter((item) => item.type === 'Line')
        if (lines) {
            lines.forEach((line) => line.material.color.set('#bbbbbb'))
        }
        // lastPick.object.material[1].color.set('#00035d');
    }
    lastPick = null
    lastPick = intersects.find(
        (item) => item.object.material && item.object.material.length === 2, // 选择map object
    )
    if (lastPick) {
        // console.log('parent', lastPick.object.parent)
        const lines = lastPick.object.parent.children.filter((item) => item.type === 'Line')
        if (lines) {
            lines.forEach((line) => line.material.color.set('#ffffff'))
        }
        // lastPick.object.parent.childre[2]
        lastPick.object.parent.position.set(0, 0, 1.6)
        lastPick.object.material[0].color.set('#ff0000')
        lastPick.object.material[0].opacity = 0.7
        // lastPick.object.material[1].color.set('#00035d');
    }
}

container = document.getElementById('container')
if (container) {
    projection = d3
        .geoMercator()
        .center([111, 36]) //
        // .scale(2000)
        .translate([0, 0]) // container.clientWidth / 2, container.clientHeight / 2
    stage = new Stage(container, beforeRender)
    initStage(stage)
    setData()
}
