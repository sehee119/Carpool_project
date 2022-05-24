const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

async function getGeo(name) {
    const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(name)}`;
    const options = {
        method: 'GET',
        url: url,
        // url: url + '?query=' + encodeURIComponent(name),
        // params: { query: encodeURIComponent(name) },
        headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
    }
    let res;
    try {
        res = await axios(options);
    } catch(err) {
        console.error('Geo 정보를 불러오지 못했습니다.');
    }
    let address = res.data.addresses[0];
    console.log('쿼리 주소: ' + name);//

    return address.x + ',' + address.y;
}

exports.getGeo = getGeo;

