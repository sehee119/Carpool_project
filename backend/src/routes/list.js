const fs = require('fs');
const { Client } = require('pg');
const router = require('express').Router();
const db_config = require('./../../config');

router.get('/', (req, res) => {
  let row;
  const DATA_SQL = fs.readFileSync('./sql/QueryList.sql').toString();
  const db_client = new Client(db_config);

  db_client.connect();
  db_client.query(DATA_SQL, (error, results) => {
    row = error ? error.stack : results.rows; // 카풀 목록 Object
    res.status(200).json({
      message: '목록 불러오기 성공',
      data: row,
    });
    db_client.end();
  });
});

module.exports = router;
