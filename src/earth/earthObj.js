import {Object3D, SphereGeometry, Mesh, TextureLoader, MeshLambertMaterial} from "three";
import { earthGlow } from "./glow";
import { controlConfig as GlobalConfig } from "./config";
import { countryLine } from "./countryPolygon";
import { getCityMeshGroup } from "./cityPoint";
import { earthAddFlyLine } from "./flyLine";

export const earth3dObj = (cityList, flyLineData) => {
  const object3D = new Object3D();
  let earthMesh = createEarthImageMesh(GlobalConfig.earthRadius);
  // let cloudMesh = createEarthCloudImageMesh(earthRadius + 0.03)
  // object3D.add(cloudMesh);
  let glow = earthGlow(GlobalConfig.earthRadius, 'public/texture/earth_glow.png', 3.05);
  let glowLight = earthGlow(GlobalConfig.earthRadius, 'public/texture/earth_glow_light.png', 3.15);
    countryLine(GlobalConfig.earthRadius + 0.01).then(lines => {
        object3D.add(lines);
    })
  object3D.add(earthMesh);
  object3D.add(glow);
  object3D.add(glowLight);

  // 添加城市标注点和飞线
  if (cityList && flyLineData) {
    let {waveMeshArr,pointMeshArr} = getCityMeshGroup(cityList);
   for (let index = 0; index < waveMeshArr.length; index++) {
     const cityWaveMesh = waveMeshArr[index];
     const cityMesh = pointMeshArr[index];
     object3D.add(cityMesh);
     object3D.add(cityWaveMesh);
   }

    //添加飞线
    let flyManager = earthAddFlyLine(object3D,flyLineData,cityList)
    return { object3D, waveMeshArr,flyManager};
  }

  return { object3D };
};

const createEarthImageMesh = (radius) => {
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
    const textureLoader = new TextureLoader();
    //加载纹理贴图
    const texture = textureLoader.load('public/earth/earth2.jpg');
    //创建一个球体几何对象
    const geometry = new SphereGeometry(radius, 96, 96);
    //材质对象Material
    // MeshLambertMaterial  MeshBasicMaterial
    console.log('texture', texture)
    const material = new MeshLambertMaterial({
        map: texture, //设置地球0颜色贴图map
        color: '#aaaaaa',
        transparent: true,
        // opacity: 0.4,
    });
    const mesh = new Mesh(geometry, material); //网格模型对象Mesh
    return mesh;
};
