require('dotenv').config({ path: './.env' });

const fs = require('fs');
const { Client } = require('pg');
const express = require('express');
const app = express();
const cors = require('cors');

const { getGeo } = require('./src/NCP/getGeo.js');
const { getDuration } = require('./src/NCP/getDuration.js');
const { transGeo } = require('./src/NCP/transGeo.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const db_config = {
  user: 'postgres',
  host: 'localhost',
  database: 'carpool',
  password: 'postgres',
  port: 5432,
};
const db_config_debug = {
  user: 'postgres',
  host: 'ec2-3-37-128-210.ap-northeast-2.compute.amazonaws.com',
  database: 'carpool',
  password: 'postgres',
  port: 5432,
};

// 카풀 목록 불러오기
async function main() {
  app.get('/list', (req, res) => {
    let row;
    const DATA_SQL = fs.readFileSync('./sql/QueryList.sql').toString();
    const db_client = new Client(db_config);
    // const db_client = new Client(db_config_debug); // 로컬

    db_client.connect();
    db_client.query(DATA_SQL, (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res.status(200).json({
        status: 'success',
        message: '목록 불러오기 성공',
        data: row,
      });
      db_client.end();
    });
  });
  app.get('/list/:id', (req, res) => {
    const DATA_SQL = fs.readFileSync('./sql/QueryListById.sql').toString();
    let row;
    let carpool_id = req.params.id;

    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);

    db_client.connect();
    db_client.query(DATA_SQL, [carpool_id], (error, results) => {
      row = error ? error.stack : results.rows; // 카풀 목록 Object
      res.status(200).json({
        status: 'success',
        message: '목록 불러오기 성공',
        data: row,
      });
      db_client.end();
    });
  });
  // 카풀 검색(필터)하기
  app.get('/filter', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
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
      res.status(400).json({
        status: 'error',
        message: error.message,
      }); // 결과 전송 to client
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
      status: 'success',
      message: '목록 불러오기 성공',
      data: search_data,
    }); // 결과 전송 to client
  });
  // 카풀 등록하기
  app.post('/register', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
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
      status: 'success',
      message: '등록되었습니다.',
    });
  });
  // 카풀 신청하기
  app.post('/candidate', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
    const db_client = new Client(db_config);

    const DATA_SQL = fs.readFileSync('./sql/InsertCandidaate.sql').toString();
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
      status: 'success',
      message: '등록되었습니다.',
    });
  });
  app.post('/delete/carpool', async (req, res) => {
    // const db_client = new Client(db_config_debug); // 로컬
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
    res
      .status(200)
      .json({ status: 'success', message: result.rowCount + ' 행 삭제' });
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

  app.listen(3000, () => console.log('user connected?'));
}

main();
