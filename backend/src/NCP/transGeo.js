const axios = require('axios');

const client_id = process.env.Client_ID;
const client_secret = process.env.Client_Secret;

async function transGeo(name) {
  const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    name
  )}`;
  const options = {
    method: 'GET',
    url: url,
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret,
    },
  };

  const res = await axios(options);
  if (res.data.total == 0) {
    return '';
  }
  let item = res.data.items[0];
  if (item.roadAddress == '') {
    return item.address;
  }
  console.log('%s => %s', name, item.address); //
  return item.roadAddress;
}

exports.transGeo = transGeo;
