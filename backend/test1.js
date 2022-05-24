const axios = require('axios');

async function test1() {
    const options = {
        method: 'GET',
        url: 'http://ec2-18-117-73-79.us-east-2.compute.amazonaws.com:3000/list',
    }

    let res = await axios(options);

    console.log(res.data);
}

test1();