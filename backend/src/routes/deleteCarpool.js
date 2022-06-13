const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');

router.post('/', async (req, res) => {
  const db_client = new Client(db_config);

  const DATA_SQL = fs.readFileSync('./sql/DeleteCarpoolById.sql').toString();
  const carpool_id = req.body.carpool_id;
  let result;

  await db_client.connect();
  try {
    result = await db_client.query(DATA_SQL, [carpool_id]);
    // console.log(JSON.stringify(result));
    console.log('요청된 카풀 id : %d ', carpool_id);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
    return;
  }
  await db_client.end();
  res.status(200).json({ message: result.rowCount + ' 행 삭제' });
});

module.exports = router;
