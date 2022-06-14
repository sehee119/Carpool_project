require('dotenv').config({ path: './.env' });
const fs = require('fs');
const { Client } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

const { getGeo } = require('./src/NCP/getGeo.js');
const { transGeo } = require('./src/NCP/transGeo.js');
const list = require('./src/routes/list');
const filter = require('./src/routes/filter');
const register = require('./src/routes/register');
const candidate = require('./src/routes/candidate');
const deleteCarpool = require('./src/routes/deleteCarpool');
const passenger = require('./src/routes/passenger');
const driver = require('./src/routes/driver');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routers
app.use('/list', list);
app.use('/filter', filter);
app.use('/register', register);
app.use('/candidate', candidate);
app.use('/deleteCarpool', deleteCarpool);
app.use('/passenger', passenger);
app.use('/driver', driver);

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

  app.get('/map', (req, res) => {
    res.sendFile(__dirname + '/map.html');
  });
  app.post('/map', (req, res) => {
    var start = function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(transGeo(req.body.start_place));
        }, 1000);
      }).then(function (result) {
        return getGeo(result);
      });
    };

    var goal = function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(transGeo(req.body.goal_place));
        }, 1000);
      }).then(function (result) {
        return getGeo(result);
      });
    };

    if (req.body.stops1_place) {
      var stops1 = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(transGeo(req.body.stops1_place));
          }, 1000);
        }).then(function (result) {
          return getGeo(result);
        });
      };
    }
    if (req.body.stops2_place) {
      var stops2 = function () {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(transGeo(req.body.stops2_place));
          }, 1000);
        }).then(function (result) {
          return getGeo(result);
        });
      };
    }

    async function route() {
      let a = await start();
      let b = await goal();
      if (req.body.stops1_place) {
        let c = await stops1();
        if (req.body.stops2_place) {
          let d = await stops2();
          return makeMarker(a, b, c, d);
        }
        return makeMarker(a, b, c);
      }
      return makeMarker(a, b);
    }

    if (req.body.stops2_place) {
      var cnt = 4;
    } else {
      if (req.body.stops1_place) {
        var cnt = 3;
      } else {
        var cnt = 2;
      }
    }

    if (cnt == 4) {
      Promise.all([cnt, start(), goal(), stops1(), stops2(), route()]).then(
        function (values) {
          //console.log("모두 완료됨", values);
          res.render('map', {
            xy: values,
          });
        }
      );
    } else if (cnt == 3) {
      Promise.all([cnt, start(), goal(), stops1(), route()]).then(function (
        values
      ) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values,
        });
      });
    } else if (cnt == 2) {
      Promise.all([cnt, start(), goal(), route()]).then(function (values) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values,
        });
      });
    }
  });

  app.listen(3000, () => console.log('Listening ...'));
}

main();
