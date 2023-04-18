import {
  BufferGeometry,
  BufferAttribute,
  LineBasicMaterial,
  LineSegments
} from "three";
//引入国家边界数据
import { controlConfig } from "./config";
import axios from "axios";
// R:球面半径
async function countryLine(R) {
  const result = await axios.get(`/public/data/earth.json`)
  const fs = result.data
  var geometry = new BufferGeometry(); //创建一个Buffer类型几何体对象
  //类型数组创建顶点数据
  var vertices = new Float32Array(fs);
  // 创建属性缓冲区对象
  var attribute = new BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribute;
  // 线条渲染几何体顶点数据
  var material = new LineBasicMaterial({
    color: controlConfig.color, //线条颜色
  }); //材质对象
  var line = new LineSegments(geometry, material); //间隔绘制直线
  line.scale.set(R, R, R); //lineData.js对应球面半径是1，需要缩放R倍
  return line;
}

export { countryLine };
