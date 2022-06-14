require('dotenv').config({ path: './.env' });
const fs = require('fs');
const { Client } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

const { getGeo } = require('./src/NCP/getGeo.js');
const { transGeo } = require('./src/NCP/transGeo.js');
const { makeMarker } = require('./src/NCP/makeMarker.js');
const list = require('./src/routes/list');
const filter = require('./src/routes/filter');
const register = require('./src/routes/register');
const candidate = require('./src/routes/candidate');
const deleteCarpool = require('./src/routes/deleteCarpool');
const passenger = require('./src/routes/passenger');
const driver = require('./src/routes/driver');
const map = require('./src/routes/map');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('views', './views');
app.set('view engine', 'ejs');

// Routers
app.use('/list', list);
app.use('/filter', filter);
app.use('/register', register);
app.use('/candidate', candidate);
app.use('/delete/carpool', deleteCarpool);
app.use('/passenger', passenger);
app.use('/driver', driver);
app.use('/map', map);

function main() {
  app.get('/list/:id', (req, res) => {
    const DATA_SQL = fs.readFileSync('./sql/QueryListById.sql').toString();
    let row;
    let carpool_id = req.params.id;

    const db_client = new Client(db_config);

    db_client.connect();
    db_client.query(DATA_SQL, [carpool_id], (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res.status(200).json({
        message: '목록 불러오기 성공',
        data: row,
      });
      db_client.end();
    });
  });

  app.listen(3000, () => console.log('Listening ...'));
}

main();
