const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');

router.get('/:id', async (req, res) => {
  const db_client = new Client(db_config);

  const DATA_SQL = fs.readFileSync('./sql/QueryListByUserId.sql').toString();
  const user_id = req.params.id;
  let db_result = {};

  await db_client.connect();
  try {
    db_result = await db_client.query(DATA_SQL, [user_id]);
    // console.log(JSON.stringify(result));
    console.log('요청된 유저의 id : %d ', user_id);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message : error.message });
    return;
  }
  await db_client.end();
  res.status(200).json({ data : db_result.rows  });
});

module.exports = router;