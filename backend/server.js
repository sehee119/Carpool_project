require('dotenv').config({ path: './.env' });

const { getGeo } = require('./src/NCP/getGeo.js');
const { getDuration } = require('./src/NCP/getDuration.js');

const { Client } = require('pg');
const express = require('express');
const { transGeo } = require('./src/NCP/transGeo.js');
const app = express();

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

const QUERY_CARPOOL_LIST = `
SELECT
  name, gender, max_passenger, start_date, end_date, dotw, starting_point, starting_coord, destination_point, destination_coord
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id);
`;

const options = {
  method: 'GET',
  url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
  headers: {
    Accept: 'application/json',
    'X-NCP-APIGW-API-KEY-ID': api_key_id,
    'X-NCP-APIGW-API-KEY': api_key,
  },
};

async function main() {
  // 카풀 목록 불러오기
  app.get('/list', (req, res) => {
    const db_client = new Client({
      // 로컬
      user: 'postgres',
      host: 'ec2-18-117-73-79.us-east-2.compute.amazonaws.com',
      database: 'carpool',
      password: 'postgres',
      port: 5432,
    });
    // const db_client = new Client({
    //   user: "postgres",
    //   host: "localhost",
    //   database: "carpool",
    //   password: "postgres",
    //   port: 5432,
    // });
    res.header('Access-Control-Allow-Origin', '*'); // CORS
    let row;
    db_client.connect();
    db_client.query(QUERY_CARPOOL_LIST, (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res.json({ data: row });
      db_client.end();
    });
  });
  // 카풀 검색(필터)하기
  app.get('/filter', async (req, res) => {
    const db_client = new Client({
      // 로컬
      user: 'postgres',
      host: 'ec2-18-117-73-79.us-east-2.compute.amazonaws.com',
      database: 'carpool',
      password: 'postgres',
      port: 5432,
    });
    // const db_client = new Client({
    //   user: 'postgres',
    //   host: 'localhost',
    //   database: 'carpool',
    //   password: 'postgres',
    //   port: 5432,
    // });
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    // let desired_time = req.query.desired_time;
    // let ride_start_name = req.query.start_name; // 탑승지 // 주소말고 장소이름으로 가능하도록 바꿔야함
    let ride_start_name = req.query.start_name;
    let ride_goal_name = req.query.goal_name;
    let gender = req.query.gender;
    let dotw = req.query.dotw;

    if (Array.isArray(gender) == false) gender = [gender]; // 성별을 한개 택했을 때도 Array로 변경
    if (Array.isArray(dotw) == false) dotw = [dotw];

    const QUERY_CARPOOL_FILTER = `
    SELECT
      name, gender, max_passenger, start_date::text, end_date::text, dotw, starting_point, starting_coord, destination_point, destination_coord
    FROM app_user 
      join carpool on app_user.id = carpool.driver_id
      join driver using(driver_id)
    WHERE gender = ANY($1) AND
      (start_date <= $2 OR end_date >= $3) AND
      dotw @> $4
    ;`;
    // DB에서 카풀목록을 불러오고 추가적으로 소요시간을 계산하기 위해 좌표도 불러온다
    db_client.connect();
    let db_result;
    try {
      db_result = await db_client.query(QUERY_CARPOOL_FILTER, [
        gender,
        start_date,
        end_date,
        dotw,
      ]);
    } catch (error) {
      res.send(error.message);
    }
    await db_client.end();
    if (db_result == null) {
      res.send({ data: [] }); // 검색결과가 없는 경우
      return;
    }
    let rows = db_result.rows;
    let search_data = [];

    for await (const row of rows) {
      let start = row['starting_coord'];
      let goal = row['destination_coord'];
      let ride_spot = await getGeo(transGeo(ride_start_name));
      let old_duration = await getDuration(start, goal);
      let duration = await getDuration(start, goal, ride_spot);

      console.log(
        '이전 소요시간: %d, 현재 소요시간: %d',
        old_duration,
        duration
      ); //
      search_data.push({
        ...row,
        ride_time: 0,
        time_difference: duration - old_duration,
        distance_difference: 0,
      });
    }
    res.json({ data: search_data }); // 결과 전송 to client
  });
  app.get('/register', async (req, res) => {
    // 카풀 등록하기
  });
  app.listen(3000, () => console.log('user connected?'));
}

main();
