var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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

var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');  // vue에 데이터를 전달할 테스트 라우
//var usersRouter = require('./routes/users');

var app = express();

app.use(require('connect-history-api-fallback')());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/movies', moviesRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
