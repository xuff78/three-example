import { TextureLoader, SpriteMaterial,Sprite} from 'three'
export const earthGlow =  (radius, img, scale) =>{
  // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
  const textureLoader = new TextureLoader()
  const texture = textureLoader.load(img) //加载纹理贴图
  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new SpriteMaterial({
    map: texture, //设置精灵纹理贴图
    transparent: true, //开启透明
    // opacity: 0.5,//可以通过透明度整体调节光圈
  })
  // 创建表示地球光圈的精灵模型
  const sprite = new Sprite(spriteMaterial)
  sprite.scale.set(radius * scale, radius * scale, 1) //适当缩放精灵

  return sprite
}
