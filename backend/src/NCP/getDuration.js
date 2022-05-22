const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

async function getDuration() { // 다수의 좌표를 인자로 받음
    const args = [...arguments]; // Object타입에서 Array타입으로 캐스팅
    const config = {
        url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
        params: { start: args[0], goal: args[1], waypoints: args.slice(2,) },
        headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
    }

    let res = await axios(config);
    res = res.data['route']['traoptimal'][0]['summary']['duration'];

    return res;
}

exports.getDuration = getDuration;