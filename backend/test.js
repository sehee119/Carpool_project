require('dotenv').config({ path: './.env' });

const { Client } = require('pg');
const { getDuration } = require('./src/NCP/getDuration');
const getGeo = require('./src/NCP/getGeo.js').getGeo;

const QUERY_CARPOOL_LIST = `
SELECT
  name, gender, max_passenger, start_date, end_date, dotw, starting_point, starting_coord, destination_point, destination_coord, duration
FROM app_user 
	join carpool on app_user.id = carpool.driver_id
	join driver using(driver_id);
`

async function test() {
    let spot1 = await getGeo('미추홀구 인하로 100');
    let spot2 = await getGeo('서울특별시 중구 통일로 13');
    let spot3 = await getGeo('인천 부평구 광장로 16 부평민자역사');
    let spot4 = await getGeo('인천 중구 항동7가');
    
    let spot5 = await getGeo('가석로 257');

    let time = await getDuration(spot2, spot4);
    // time = (((time / 1000)/60)/60);

    const db_client = new Client({
        user: 'sdjin',
        host: 'localhost',
        database: 'sdjin',
        password: 'tls888',
        port: 5432,
      });
    await db_client.connect();
    let result = await db_client.query(QUERY_CARPOOL_LIST);
    db_client.end();
    result = result.rows[0];


    // console.log('소요시간: %d', time);
    // console.log(result['starting_coord']);
    console.log('인하대:%s, 부평역:%s , 석남역:%s', spot1, spot3, spot5);
}

test('a', 'b', 'c', 'd', 'e');