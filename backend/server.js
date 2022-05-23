require('dotenv').config({ path: './.env' });

const { getGeo } = require('./src/NCP/getGeo.js');
const { getDuration } = require('./src/NCP/getDuration.js');

const { Client } = require('pg');
const express = require('express');
const app = express();
const axios = require('axios');

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
    const db_client = new Client({ // AWS 서버
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
    const db_client = new Client({ // AWS 서버
      user: 'postgres',
      host: 'localhost',
      database: 'carpool',
      password: 'postgres',
      port: 5432,
    });
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    let dotw = req.query.dotw;
    let desired_time = req.query.desired_time;
    let gender = req.query.gender;
    let start, goal, ride_spot; // 좌표 문자열
    let duration;
    let row;

    // DB에서 카풀목록을 불러오고 추가적으로 소요시간을 계산하기 위해 좌표도 불러온다
    db_client.connect();
    let result = await db_client.query(QUERY_CARPOOL_LIST);
    row = result.rows[0]; // 모든 리스트에 대해 계산하도록 만들기
    res.json(row);
    await db_client.end();

    start = row['starting_coord'];
    goal = row['destination_coord'];
    ride_spot = await getGeo('서울특별시 중구 통일로 13'); // 탑승자의 좌표를 인자로 받도록 만들기
    old_duration = await getDuration(start, goal);
    duration = await getDuration(start, goal, ride_spot);
    
    console.log('기존: %d, 경유지포함: %d', old_duration, duration);//
  });

  app.listen(3000, () => console.log('user connected?'));
}

main()
