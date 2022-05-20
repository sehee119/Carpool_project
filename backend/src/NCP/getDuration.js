const axios = require('axios');

const api_key_id = process.env.NCP_API_KEY_ID;
const api_key = process.env.NCP_API_KEY;

async function getDuration(x, y, new_x, new_y) {
    const config = {
        params: { start: '127.1058342,37.35970', goal: '129.075986,35.179470' },
        headers: { Accept: 'application/json', 'X-NCP-APIGW-API-KEY-ID' : api_key_id, 'X-NCP-APIGW-API-KEY' : api_key }
    }

    axios.get('https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving', config)
        .then(function(response) {
        res.json(response.data['route']['traoptimal'][0]['summary']['duration']); // duration(msec)
        })
        .catch(function(error) {
        console.log(error);
        });
}

exports.getDuration = getDuration;