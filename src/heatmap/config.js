import * as THREE from 'three'
export const config = {
  camera: null,
  scene: null,
  renderer: null,
  labelRenderer: null,
  container: null,
  // mesh: null,
  controller: null,
  map: null,
  raycaster: null,
  mouse: null,
  tooltip: null,
  lastPick: null,

  // 每个屏幕模型一组
  groupOne: new THREE.Group(),
  groupTwo: new THREE.Group(),
  groupThree: new THREE.Group(),
  groupFour: new THREE.Group(),

  // 城市信息
  mapConfig: {
    deep: 3,
  },
  // 摄像机移动位置，初始：0, -5, 1
}
