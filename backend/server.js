require('dotenv').config({
  path: './.env'
});

const {
  Client
} = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const {
  getGeo
} = require('./src/NCP/getGeo.js');
const {
  getDuration
} = require('./src/NCP/getDuration.js');
const {
  transGeo
} = require('./src/NCP/transGeo.js');

const db_config = {
  user: 'postgres',
  host: 'localhost',
  database: 'carpool',
  password: 'postgres',
  port: 5432,
};
const db_config_debug = {
  user: 'postgres',
  host: 'ec2-18-117-73-79.us-east-2.compute.amazonaws.com',
  database: 'carpool',
  password: 'postgres',
  port: 5432,
}
const QUERY_CARPOOL_LIST = `
SELECT
	carpool.id as carpool_id, name, gender, max_passenger, start_date, end_date, dotw, starting_point, destination_point, desired_arrival_time
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id)
ORDERY BY created
;`;
const QUERY_CARPOOL_LIST_BY_ID = `
SELECT
	carpool.id as carpool_id, name, gender, max_passenger, start_date, end_date, dotw, starting_point, destination_point, desired_arrival_time
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id)
WHERE
	carpool.id = $1
;`;
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
const INSERT_CARPOOL_NEW = `
WITH new_carpool AS (
  INSERT INTO carpool VALUES(
    default, $1, $2, $3, $4, 
      $5, $6,
      $7, $8, 
      $9, $10, NOW())
  RETURNING driver_id)
INSERT INTO driver 
  (SELECT driver_id, $11, $12, 0 FROM new_carpool)
  ON CONFLICT DO NOTHING;
`;
const INSERT_CARPOOL_CANDIDATE = `
INSERT INTO candidate VALUES (
  $1, $2, $3,
  $4, $5,
  $6, $7, false);
`;
const DELETE_CARPOOL = `
DELETE FROM carpool
WHERE id = $1;
`;
// 카풀 목록 불러오기
async function main() {
  app.get('/list', (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS
    let row;
    db_client.connect();
    db_client.query(QUERY_CARPOOL_LIST, (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res
        .status(200)
        .json({
          status: 'success',
          message: '목록 불러오기 성공',
          data: row
        });
      db_client.end();
    });
  });
  app.get('/list/:id', (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS
    let row;
    let carpool_id = req.params.id;
    db_client.connect();
    db_client.query(QUERY_CARPOOL_LIST_BY_ID, [carpool_id], (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res
        .status(200)
        .json({
          status: 'success',
          message: '목록 불러오기 성공',
          data: row
        });
      db_client.end();
    });
  });
  // 카풀 검색(필터)하기
  app.get('/filter', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    let desired_time = req.query.desired_time;
    let ride_start_name = req.query.start_name;
    let ride_goal_name = req.query.goal_name;
    let gender = req.query.gender;
    let dotw = req.query.dotw;

    if (Array.isArray(gender) == false) gender = [gender]; // 성별을 한개 택했을 때도 Array로 변경
    if (Array.isArray(dotw) == false) dotw = [dotw];

    await db_client.connect();

    let db_result = {}; // DB 쿼리 결과값 저장
    try {
      db_result = await db_client.query(QUERY_CARPOOL_FILTER, [
        gender,
        start_date,
        end_date,
        dotw,
      ]);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        status: 'error',
        message: error.message
      }); // 결과 전송 to client
      return;
    }
    await db_client.end();

    console.log('DB 쿼리 Output: %d개\n', db_result.rowCount); //

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
        ride_time: 0,
        time_difference: duration - old_duration,
        distance_difference: 0,
      });
    }
    res.status(200).json({
      status: 'success',
      message: '목록 불러오기 성공',
      data: search_data,
    }); // 결과 전송 to client
  });
  // 카풀 등록하기
  app.post('/register', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let driver_name = req.body.name; // 이미 알고있음
    let driver_gender = req.body.gender; // 이미 알고있음
    let max_passenger = req.body.max_passenger;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let dotw = req.body.dotw;
    let starting_point = req.body.start_name;
    let destination_point = req.body.goal_name;
    let desried_arrival_time = req.body.arrival_time;
    let car_num = req.body.car_num;
    let car_category = req.body.car_category;

    if (Array.isArray(dotw) == false) dotw = [dotw];

    await db_client.connect();
    try {
      await db_client.query(INSERT_CARPOOL_NEW, [
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
        message: error.message
      });
      return;
    }
    await db_client.end();
    console.log('새로운 카풀등록');
    res.status(200).json({
      status: 'success',
      message: '등록되었습니다.'
    });
  });
  // 카풀 신청하기
  app.post('/candidate', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let carpool_id = req.body.carpool_id;
    let user_id = req.body.user_id;
    let ride_spot = req.body.start_name;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let dotw = req.body.dotw;
    let desired_time = req.body.desired_time;

    if (Array.isArray(dotw) == false) dotw = [dotw];

    await db_client.connect();
    try {
      await db_client.query(INSERT_CARPOOL_CANDIDATE, [
        carpool_id,
        user_id, // 사용자 id
        ride_spot,
        start_date,
        end_date,
        dotw,
        desired_time // 탑승 예정시간(사용자 입력)
      ]);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        message: error.message
      });
      return;
    }
    await db_client.end();
    res.status(200).json({
      status: 'success',
      message: '등록되었습니다.'
    });
  });
	app.post('/delete/carpool', async (req, res) => {
    const db_client = new Client(db_config);
    res.header('Access-Control-Allow-Origin', '*'); // CORS

    let carpool_id = req.body.carpool_id;

    await db_client.connect();
    try {
      await db_client.query(DELETE_CARPOOL, [carpool_id]);
    } catch(error) {
      console.log(error.message);
      res.status(400).json({ message : error.message });
      return;
    }
    await db_client.end();
    res.status(200).json({ status: 'success', message: '삭제되었습니다.' });
  })





  app.get('/map', (req, res) => {
    res.sendFile(__dirname + '/map.html');
  })
  app.post('/map', (req, res) => {
    var start = function() {
      return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(transGeo(req.body.start_place));
          }, 1000);
        })
        .then(function(result) {
          return getGeo(result);
        })
    };

    var goal = function() {
      return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(transGeo(req.body.goal_place));
          }, 1000);
        })
        .then(function(result) {
          return getGeo(result);
        })
    };

    if (req.body.stops1_place) {
      var stops1 = function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve(transGeo(req.body.stops1_place));
            }, 1000);
          })
          .then(function(result) {
            return getGeo(result);
          })
      };
    }
    if (req.body.stops2_place) {
      var stops2 = function() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve(transGeo(req.body.stops2_place));
            }, 1000);
          })
          .then(function(result) {
            return getGeo(result);
          })
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
      Promise.all([cnt, start(), goal(), stops1(), stops2(), route()]).then(function(values) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values
        })
      });
    } else if (cnt == 3) {
      Promise.all([cnt, start(), goal(), stops1(), route()]).then(function(values) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values
        })
      });
    } else if (cnt == 2) {
      Promise.all([cnt, start(), goal(), route()]).then(function(values) {
        //console.log("모두 완료됨", values);
        res.render('map', {
          xy: values
        })
      });
    }
  })

  app.listen(3000, () => console.log('user connected?'));
}

main();
