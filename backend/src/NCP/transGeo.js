const axios = require('axios');

const client_id = process.env.Client_ID;
const client_secret = process.env.Client_Secret;

async function transGeo(name) {
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(name)}`;
    const options = {
        method: 'GET',
        url: url,
        headers: { 'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret }
    }

    let res = await axios(options);
    let address = res.data.items[0].roadAddress;

    console.log("address   " + address)
    return address;
}

exports.transGeo = transGeo;
