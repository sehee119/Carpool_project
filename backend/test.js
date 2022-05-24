require('dotenv').config({ path: './.env' });

const { getDuration } = require('./src/NCP/getDuration');
const getGeo = require('./src/NCP/getGeo.js').getGeo;
const transGeo = require('./src/NCP/transGeo.js').transGeo;

async function test() {
    //let result = await getGeo('인천 부평구 광장로 16 부평민자역사'); //인천 부평구 광장로 16 부평민자역사
    let result = await transGeo('네이버 그린팩토리'); //인천 부평구 광장로 16 부평민자역사
    //console.log("x, y "+ JSON.stringify(getGeo(result2)))
    //console.log("1----" + result)
    let result2 = await getGeo(result)
    console.log(result2)

    //console.log('소요시간: %d', await getDuration('127.1058342,37.35970', '129.075986,35.179470', result));
    //console.log('소요시간: %d', await getDuration('127.1058342,37.35970', '129.075986,35.179470', result2));


}

test('a', 'b', 'c', 'd', 'e');
