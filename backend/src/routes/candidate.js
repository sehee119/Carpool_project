const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');

router.post('/', async (req, res) => {
  const db_client = new Client(db_config);

  const DATA_SQL = fs.readFileSync('./sql/InsertCandidate.sql').toString();
  const carpool_id = req.body.carpool_id;
  const user_id = req.body.user_id;
  const ride_spot = req.body.start_name;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const dotw = req.body.dotw;
  const desired_time = req.body.desired_time;

  let db_result; //

  if (Array.isArray(dotw) == false) dotw = [dotw];

  await db_client.connect();
  try {
    await db_client.query(DATA_SQL, [
      carpool_id,
      user_id, // 사용자 id
      ride_spot,
      start_date,
      end_date,
      dotw,
      desired_time, // 탑승 예정시간(사용자 입력)
    ]);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: error.message,
    });
    return;
  }
  // try {
  //   db_result = await db_client.query(QUERY_CARPOOL_CANDIDATE);
  // } catch (error) {
  //   console.log(error.message);
  //   res.status(400).json({
  //     message: error.message
  //   });
  //   return;
  // }
  await db_client.end();
  res.status(200).json({
    message: '등록되었습니다.',
  });
});

module.exports = router;
