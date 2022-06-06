const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

async function makeMarker() { // 다수의 좌표를 인자로 받음
    const args = [...arguments]; // Object타입에서 Array타입으로 캐스팅
    const config = {
        url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
        params: { start: args[0], goal: args[1], waypoints: args.slice(2,) },
        headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
    }

    let res = await axios(config);
    //console.log("루트 데이터 " + res.data)
    //console.log(JSON.stringify(res.data));

    //res1 = res.data['route']['traoptimal'][0]['summary']['duration'];
    var routeArr = new Array()
    res1 = res.data['route']['traoptimal'][0]['summary']['duration'];
    // start_x = res.data['route']['traoptimal'][0]['summary']['start']['location'][0];
    // start_y = res.data['route']['traoptimal'][0]['summary']['start']['location'][1];
    // goal_x = res.data['route']['traoptimal'][0]['summary']['goal']['location'][0];
    // goal_y = res.data['route']['traoptimal'][0]['summary']['goal']['location'][1];
    routeArr.push(res.data['route']['traoptimal'][0]['summary']['start']['location']);

    var i = 0
    while (res.data['route']['traoptimal'][0]['path'][i]){ //x값
      //route_x = res.data['route']['traoptimal'][0]['path'][i][0]
      //route_y = res.data['route']['traoptimal'][0]['path'][i][1]
      //console.log("route   " , res.data['route']['traoptimal'][0]['path'][i])
      routeArr.push(res.data['route']['traoptimal'][0]['path'][i])
      i = i + 1;
    }
    routeArr.push([res.data['route']['traoptimal'][0]['summary']['goal']['location'][0], res.data['route']['traoptimal'][0]['summary']['goal']['location'][1]]);

    //console.log("------" + routeArr)


    return routeArr;
}

exports.makeMarker = makeMarker;
