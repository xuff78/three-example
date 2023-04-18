import { controlConfig } from './config'
import { initLight } from './light'
import { starBackground } from './starBg'
import { earth3dObj } from './earthObj'
import { cityWaveAnimate } from './cityPoint'
import { Stage } from '../utils/stage'

export default class EarthModel {

  constructor(
    containerId,
    //地球飞线城市坐标点
    cityList,
    //飞线数据
    flyLineData,
    config = {
      autoRotate: false,
      starBackground: true,
      orbitControlConfig:{
        enableZoom: true,
        enableRotate: true
      }
    }
  ) {
    const parentDom = document.getElementById(containerId)
    this.stage = new Stage(parentDom, {
      // beforeRender: this.animate.bind(this),
      camera: {
        fov: 45,
        near: 0.1,
        far: 1000,
      }
    })
    this.cityList = cityList
    this.flyLineData = flyLineData
    this.earthConfig = config
    this.init()
    this.load()
  }

  load() {
    const { scene } = this.stage
    if (this.earthConfig.starBackground) {
      scene.add(starBackground());
    }
    let { object3D, waveMeshArr, flyManager } = earth3dObj(
      this.cityList,
      this.flyLineData
    );
    this.earth3dObj = object3D;
    this.waveMeshArr = waveMeshArr;
    this.flyManager = flyManager;
    scene.add(this.earth3dObj);
    this.animate = this.animate.bind(this);
    this.animate()
    this.stage.animate()
  }

  /**
   * @description: 初始化 threeJS 环境
   * @param {*}
   * @return {*}
   */
  init() {
    const { controls, scene, camera } = this.stage
    initLight(scene);
    camera.position.set(30, 26, 10);
    controls.minZoom = controlConfig.minZoom;
    controls.maxZoom = controlConfig.maxZoom;
    controls.minPolarAngle = controlConfig.minPolarAngle;
    controls.maxPolarAngle = controlConfig.maxPolarAngle;
    controls.enableRotate = this.earthConfig.orbitControlConfig.enableRotate;
    controls.enableZoom = this.earthConfig.orbitControlConfig.enableZoom;
    controls.update();
    // console.log('controls',controls)
  }

  /**
   * @description: 帧变化需要做的动画
   * @param {*}
   * @return {*}
   */

  animate() {
    if (this.waveMeshArr) {
      cityWaveAnimate(this.waveMeshArr);
    }
    requestAnimationFrame(this.animate);
    //只是自转，不需要缩放到中国
    if (this.earth3dObj) {
      if (this.earthConfig.autoRotate) {
        this.earth3dObj.rotation.y += 0.01;
      }
    }
    this.flyManager && this.flyManager.animation();
  }
}
