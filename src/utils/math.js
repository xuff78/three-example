/**
 * 经纬度坐标转墨卡托坐标
 * @param {经度(角度值)} longitude 
 * @param {维度(角度值)} latitude
 */
// 墨卡托坐标系：展开地球，赤道作为x轴，向东为x轴正方，本初子午线作为y轴，向北为y轴正方向。
// 数字20037508.34是地球赤道周长的一半：地球半径6378137米，赤道周长2*PI*r = 2 * 20037508.3427892，墨卡托坐标x轴区间[-20037508.3427892,20037508.3427892]
function lon2xy(longitude, latitude) {
    var E = longitude;
    var N = latitude;
    var x = E * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + N) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return {
        x: x, //墨卡托x坐标——对应经度
        y: y, //墨卡托y坐标——对应维度
    }
}
export {
    lon2xy
}