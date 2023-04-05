import axios from 'axios'
import * as THREE from 'three'
import { lon2xy } from '../utils/math.js'

const addRiver = async (buildGroup) => {
    const result = await axios.get(`/public/data/huangpujiang.json`)
    const fs = result.data.features
    fs.forEach((f) => {
        buildGroup.add(ShapeMesh([f.geometry.coordinates]))
    })
}
function ShapeMesh(pointsArrs) {
    const shapeArr = [] //轮廓形状Shape集合
    pointsArrs.forEach(pointsArr => {
        const vector2Arr = []
        // 转化为Vector2构成的顶点数组
        pointsArr[0].forEach(elem => {
            const xy = lon2xy(elem[0],elem[1]);//经纬度转墨卡托坐标
            vector2Arr.push(new THREE.Vector2(xy.x, xy.y));
        })
        const shape = new THREE.Shape(vector2Arr);
        shapeArr.push(shape);
    })
    const geometry = new THREE.ShapeGeometry( //填充多边形
        shapeArr,
    )
    const material = new THREE.MeshLambertMaterial({
        color: '#0D6DC6',
        // color: 0x001c1a,
    })
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象
    return mesh
}
export { addRiver }
