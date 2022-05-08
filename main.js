var http = require('http');
var fs = require('fs');
var url = require('url');
const { Client } = require('pg');

const client = new Client({
    user : 'postgres',
    host : 'localhost',
    database : 'postgres',
    password : '0119',
    port : 5432,
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
});

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
        client.query(`SELECT * FROM driver`, function(error,drivers){
          console.log(drivers);
          response.writeHead(200);
          response.end('Success');
        });
      });
    }
}});
app.listen(3000);
