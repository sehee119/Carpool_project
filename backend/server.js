require('dotenv').config({ path: './.env' });

const getGeo = require('./src/NCP/getGeo.js').getGeo;
const getDuration = require('./src/NCP/getDuration.js').getDuration;

const { Client } = require('pg');
const express = require('express');
const app = express();
const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

const CARPOOL_LIST = `
SELECT
  name, gender, max_passenger, start_date, end_date, dotw, starting_point, destination_point
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id);
`
const options = {
  method: 'GET',
  url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
  headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
}


async function main() {
  const client = new Client({
    user: 'sdjin',
    host: 'localhost',
    database: 'sdjin',
    password: 'tls888',
    port: 5432,
  });
  app.get('/list', (req, res) => { // 카풀 목록 불러오기
    let row;
    client.connect();
    client.query(CARPOOL_LIST, (error, results) => {
      row = (error ? error.stack : results.rows)
      res.json(row[0])
      client.end()
    });
  });
  app.get('/filter', (req, res) => { // 카풀 검색(필터)하기
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    let dotw = req.query.dotw;
    let desired_time = req.query.desired_time;
    let gender = req.query.gender;

    getGeo('미추홀구 인하로 100')
      .then(result => {
        res.json({ x: result.addresses[0].x, y: result.addresses[0].y });
      });
  });

  app.listen(3000, () => console.log('user connected?'));
}

main()
