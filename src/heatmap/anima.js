import anime from 'animejs'

function resetCameraTween(controller, camera, cameraPosArr) {
  //关闭控制器
  controller.enabled = false

  const begin = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  }
  anime({
    targets: begin,
    x: cameraPosArr[cameraPosArr.length - 1].x,
    y: cameraPosArr[cameraPosArr.length - 1].y,
    z: cameraPosArr[cameraPosArr.length - 1].z,
    easing: 'easeInCirc',
    duration: 500,
    update: () => {
      camera.position.x = begin.x
      camera.position.y = begin.y
      camera.position.z = begin.z

      camera.lookAt(0, 0, 0)

      // 控制器更新
      controller.update()
    },
    complete: () => {
      controller.enabled = true
    },
  })
}
export { resetCameraTween }
