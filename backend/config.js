require('dotenv').config({ path: './.env' });

const config = {
    default : { // in aws server
        user: 'postgres',
        host: 'localhost',
        database: 'carpool',
        password: 'postgres',
        port: 5432,
    },
    local : { // 로컬 테스트용
        user: 'postgres',
        host: 'ec2-3-37-128-210.ap-northeast-2.compute.amazonaws.com',
        database: 'carpool',
        password: 'postgres',
        port: 5432,
    }
};

// module.exports = config.local;
module.exports = config.default;