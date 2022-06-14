const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

async function getRouteDuration() { // 다수의 좌표를 인자로 받음
    const args = [...arguments]; // Object타입에서 Array타입으로 캐스팅
    const config = {
        url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
        params: { start: args[0], goal: args[1], waypoints: args.slice(2).join() },
        headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
    }

    // console.log(args.slice(2));// 
    let res = await axios(config);

    // console.log(JSON.stringify(res.data['route']));//////
    let guide = res.data['route']['traoptimal'][0]['guide'];
    // console.log('시간 합 비교\n %d <=> %d', duration, guide.map(x => x.duration).reduce((a,b) => a+b, 0))//
    let du = 0; // temporary duration
    let durations = [];
    for(let i = 0; i < guide.length; ++i) {
        // console.log(JSON.stringify(guide[i]));
        du += guide[i].duration;
        if(guide[i].type == 87 || guide[i].type == 88) { // 경유지 또는 도착지일 때
            durations.push(du);
            du = 0;
        };
    }
    console.log('구간별 소요시간: ', durations);
    //
    return durations;
}

exports.getRouteDuration = getRouteDuration;