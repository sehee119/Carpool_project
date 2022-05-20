require('dotenv').config({ path: './.env' });

const getGeo = require('./src/NCP/getGeo.js').getGeo;

async function test() {
    let result = await getGeo('인천 부평구 광장로 16 부평민자역사');
    console.log(result);
}

test();