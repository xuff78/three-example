import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

class Stage {
  // 渲染器
  // 初始化场景
  constructor(container, beforeRender) {
    this.beforeRender = beforeRender
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({ antialias: true })
    const { clientWidth, clientHeight } = container
    this.renderer.setSize(clientWidth * devicePixelRatio, clientHeight * devicePixelRatio, false)
    container.appendChild(this.renderer.domElement)

    this.labelRenderer = new CSS2DRenderer()
    this.labelRenderer.setSize(clientWidth, clientHeight)
    this.labelRenderer.domElement.style.position = 'absolute'
    this.labelRenderer.domElement.style.top = '0'
    // this.labelRenderer.domElement.style.pointerEvents = 'none'
    container.appendChild(this.labelRenderer.domElement)

    this.camera = new PerspectiveCamera(30, clientWidth / clientHeight, 1, 30000)
    this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement)
    // this.controls.update()
  }

  // 响应式布局
  responsive() {
    const { renderer, camera } = this
    if (this.resizeRendererToDisplaySize()) {
      const { clientWidth, clientHeight } = renderer.domElement
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
  }

  // 重置渲染尺寸
  resizeRendererToDisplaySize() {
    const { renderer } = this
    const { width, height, clientWidth, clientHeight } = renderer.domElement
    const [w, h] = [clientWidth * devicePixelRatio, clientHeight * devicePixelRatio]
    const needResize = width !== w || height !== h
    if (needResize) {
      renderer.setSize(w, h, false)
    }
    return needResize
  }

  // 连续渲染
  animate(time = 0) {
    this.responsive()
    this.beforeRender && this.beforeRender(time)
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer.render(this.scene, this.camera)
    // this.controls.update()
    requestAnimationFrame((time) => {
      this.animate(time)
    })
  }
}

export { Stage }
