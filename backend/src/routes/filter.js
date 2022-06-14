const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');
require('dotenv').config({ path: './.env' });

const { getGeo } = require('../NCP/getGeo.js');
const { transGeo } = require('../NCP/transGeo.js');
const { getDuration } = require('../NCP/getDuration');

router.get('/', async (req, res) => {
    const db_client = new Client(db_config);

    const DATA_SQL = fs.readFileSync('./sql/FilterList.sql').toString();
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const desired_time = req.query.desired_time;
    const ride_start_name = req.query.start_name;
    const ride_goal_name = req.query.goal_name;
    const gender = req.query.gender;
    const dotw = req.query.dotw;
    let db_result = {}; // DB 쿼리 결과값 저장

    if (Array.isArray(gender) == false) gender = [gender]; // 성별을 한개 택했을 때도 Array로 변경
    if (Array.isArray(dotw) == false) dotw = [dotw];

    await db_client.connect();

    try {
      db_result = await db_client.query(DATA_SQL, [
        gender,
        start_date,
        end_date,
        dotw,
      ]);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message }); // 결과 전송 to client
      return;
    }
    await db_client.end();

    let search_data = []; // NCP API 결과값 저장
    for await (const row of db_result.rows) {
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
        ride_time: row.desried_arrival_time - duration, // 여러명일경우, 경유지마다 시간 필요함
        time_difference: duration - old_duration,
        distance_difference: 0,
      });
    }
    res.status(200).json({
      message: '목록 불러오기 성공',
      data: search_data,
    }); // 결과 전송 to Client
  });

module.exports = router;
