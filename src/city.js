import '@/public.css'
import { Stage } from '@/utils/stage'
import * as THREE from 'three'
import { addBuildings, buildingShader } from './city/building'
import { lon2xy } from './utils/math.js'
import { addRiver } from './city/river'
import {addWallFlow} from "./city/wall_flow";

const mousePos = new THREE.Vector2()
const E = 121.49526536464691;//东方明珠经纬度坐标
const N = 31.24189350905988;
const p = lon2xy(E,N);
const raycaster = new THREE.Raycaster()
let stage, container, selected
const setData = async () => {
    const { scene } = stage
    const buildGroup = new THREE.Group()
    await addBuildings(buildGroup)
    await addRiver(buildGroup)
    addWallFlow(buildGroup, [
        [121.4827080779454, 31.23102212832272],
        [121.48209547853901, 31.23303292575372],
        [121.48286947682897, 31.233163969393857],
        [121.48369928619132, 31.233784499775922],
        [121.48537531113146, 31.234282118877687],
        [121.48723781999996, 31.23516032258314],
        [121.48847884883389, 31.23406043267481],
        [121.49067953365375, 31.231900243388253],
        [121.48952761013715, 31.231339526931038],
        [121.48606718662649, 31.23151216481915],
        [121.48452024077199, 31.231407686518992],
        [121.4825603152699, 31.230997110455306],
        [121.4823524748806, 31.232094638993914],
        [121.4827080779454, 31.23102212832272],
    ])
    const geometry = new THREE.PlaneGeometry(5800, 5800, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 1,
        side: THREE.FrontSide,
        // depthTest: true,
    })

    const ground = new THREE.Mesh(geometry, material)
    ground.position.set(p.x, p.y, -20)
    ground.name = 'ground'
    buildGroup.add(ground)
    scene.add(buildGroup)
    // scene.add(getEarth())
    // const result = await axios.get(`/public/data/heatmapData.json`)
    // scene.add(getMapGeometry(provinceData, edgeLightObj, projection))
    stage.animate()
    updateTime()
}

const initStage = (stage) => {
    const { controls, scene, camera } = stage
    controls.enablePan = true
    controls.minDistance = 100
    controls.maxDistance = 20000
    controls.minAzimuthAngle = -Math.PI / 4
    controls.maxAzimuthAngle = Math.PI / 4

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 400, 300)
    scene.add(directionalLight)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-200, -400, 300);
    scene.add(directionalLight2)
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    camera.position.set(13524889, 3657486, 5465)
    camera.lookAt(p.x, p.y, 0)
    controls.target.set(p.x, p.y,0);

    // 点击地图事件
    const onClick = () => {
        // updateTime()
    }

    const onMouseMove = (event) => {
        mousePos.x = (event.layerX / container.clientWidth) * 2 - 1
        mousePos.y = -(event.layerY / container.clientHeight) * 2 + 1
    }
    container.addEventListener('mousemove', onMouseMove, false)
    container.addEventListener('click', onClick)
}

const handleMouseover = () => {
    raycaster.setFromCamera(mousePos, stage.camera)
    const intersects = raycaster.intersectObjects(
        stage.scene.children,
        true, // true，则同时也会检测所有物体的后代
    )
    if (intersects.length > 0) {
        selected = intersects.find(i => i.object.name === 'ground')
        // console.log('intersects', intersects)
        // console.log("x坐标:"+selected.point.x)
        // console.log("y坐标:"+selected.point.y)
        // console.log("z坐标:"+selected.point.z)
    }
}

container = document.getElementById('container')
if (container) {
    stage = new Stage(container,  {
      beforeRender: () => {
        handleMouseover()
      }
    })
    initStage(stage)
    setData()
}

const clock = new THREE.Clock()
function updateTime() {
    const deltaTime = clock.getDelta()
    const time = buildingShader.uniforms.time
    time.value += deltaTime
    if (time.value > 10) time.value = 0
    if (selected) {
        const uClickPosition = buildingShader.uniforms.uClickPosition
        uClickPosition.value = [selected.point.x, selected.point.y]
    }
    requestAnimationFrame(updateTime)
}
