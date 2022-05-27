require('dotenv').config({ path: './.env' });

const { getGeo } = require('./src/NCP/getGeo.js');
const { getDuration } = require('./src/NCP/getDuration.js');

const { Client } = require('pg');
const express = require('express');
const app = express();

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

const QUERY_CARPOOL_LIST = `
SELECT
  name, gender, max_passenger, start_date, end_date, dotw, starting_point, starting_coord, destination_point, destination_coord
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id);
`

const options = {
  method: 'GET',
  url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
  headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
}
// const db_client = new Client({ // 로컬
//   user: 'sdjin',
//   host: 'localhost',
//   database: 'sdjin',
//   password: 'tls888',
//   port: 5432,
// });

async function main() {
  app.get('/list', (req, res) => { // 카풀 목록 불러오기
    const db_client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'carpool',
      password: 'postgres',
      port: 5432,
    });
    res.header('Access-Control-Allow-Origin', '*'); // CORS
    let row;
    db_client.connect();
    db_client.query(QUERY_CARPOOL_LIST, (error, results) => {
      row = (error ? error.stack : results.rows) // 카풀 목록 Object
      res.json({ data : row })
      db_client.end()
    });
  });
  app.get('/filter', async (req, res) => { // 카풀 검색(필터)하기
    const db_client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'carpool',
      password: 'postgres',
      port: 5432,
    });
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let start_name = req.query.start_name;
    let goal_name = req.query.goal_name;
    let ride_spot_name = '서울특별시 중구 통일로 13'; // 인자로 바꾸기
    let gender = req.query.gender;
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    let dotw = req.query.dotw;
    let desired_time = req.query.desired_time;
    
    if(Array.isArray(gender) == false) gender = [gender];// 성별을 한개 택했을 때도 Array로 변경
    if(Array.isArray(dotw) == false) dotw =  [dotw];
    
    const QUERY_CARPOOL_FILTER = `
    SELECT
      name, gender, max_passenger, start_date, end_date, dotw, starting_point, starting_coord, destination_point, destination_coord
    FROM app_user 
      join carpool on app_user.id = carpool.driver_id
      join driver using(driver_id)
    WHERE gender = ANY(array[${gender.map(x => `'${x}'`).join(',')}]) and
      end_date > '${start_date}' and
      dotw @> array[${dotw.map(x => `'${x}'`).join(',')}]
    ;
    `
    // DB에서 카풀목록을 불러오고 추가적으로 소요시간을 계산하기 위해 좌표도 불러온다
    db_client.connect();
    let result;
    try {
      result = await db_client.query(QUERY_CARPOOL_FILTER);
    } catch(error) {
      res.send(error.message);
    }
    await db_client.end(); // 비동기일 필요없음
    let rows = result.rows;

    if(rows.length == 0) res.send([]);// 검색결과가 없는 경우

    let data = [];
    for await (const row of rows) {
      let start = row['starting_coord'];
      let goal = row['destination_coord'];
      let ride_spot = await getGeo(ride_spot_name);
      let old_duration = await getDuration(start, goal);
      let duration = await getDuration(start, goal, ride_spot);
      
      data.push({row, 
        ride_time: 0, 
        time_difference : duration - old_duration,
        distance_difference: 0,
      });
    }
    res.json(data); // 결과 전송// res.json({data: data})
    console.log('data 갯수: ' + rows.length);
    console.log(data);
  });
  app.get('/register', async (req, res) => { // 카풀 등록하기

  });
  app.listen(3000, () => console.log('user connected?'));
}

main()
