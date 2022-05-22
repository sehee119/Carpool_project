require('dotenv').config({ path: './.env' });

const { getDuration } = require('./src/NCP/getDuration');
const getGeo = require('./src/NCP/getGeo.js').getGeo;

async function test() {
    let result = await getGeo('인천 부평구 광장로 16 부평민자역사');

    console.log('소요시간: %d', await getDuration('127.1058342,37.35970', '129.075986,35.179470', result))
}

test('a', 'b', 'c', 'd', 'e');