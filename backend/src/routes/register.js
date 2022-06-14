const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');

const { getGeo } = require('../NCP/getGeo.js');
const { transGeo } = require('../NCP/transGeo.js');

router.post('/', async (req, res) => {
  const db_client = new Client(db_config);

  const DATA_SQL = fs.readFileSync('./sql/InsertCarpool.sql').toString();
  const driver_name = req.body.name; // 이미 알고있음
  const driver_gender = req.body.gender; // 이미 알고있음
  const max_passenger = req.body.max_passenger;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const dotw = req.body.dotw;
  const starting_point = req.body.start_name;
  const destination_point = req.body.goal_name;
  const desried_arrival_time = req.body.arrival_time;
  const car_num = req.body.car_num;
  const car_category = req.body.car_category;

  if (Array.isArray(dotw) == false) dotw = [dotw];

  await db_client.connect();
  try {
    await db_client.query(DATA_SQL, [
      req.body.client_id, // 클라이언트의 DB의 실제 id
      start_date,
      end_date,
      dotw,
      starting_point,
      await getGeo(await transGeo(starting_point)),
      destination_point,
      await getGeo(await transGeo(destination_point)),
      desried_arrival_time,
      max_passenger,
      car_category,
      car_num,
    ]);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
    return;
  }
  await db_client.end();
  console.log('새로운 카풀등록');
  res.status(200).json({
    message: '등록되었습니다.',
  });
});

module.exports = router;
