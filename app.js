var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//dependacies from older project

var CronJob = require('cron').CronJob;
var mysql = require("mysql");
var request = require("request");

var PORT = process.env.PORT || 3001;


var index = require('./routes/index');
var users = require('./routes/users');
var expenses = require('./routes/expenses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/expenses', expenses);

//adding mysql
var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'root',
 database : 'saveup_db',
});

app.get('/users', function(req, res) {
	
    var query = "SELECT * FROM users"

    connection.query(query, function(err, users) {
        res.json(users);
    });
});
app.get('/expenses', function(req, res) {
  
    var query = "SELECT * FROM expenses"

    connection.query(query, function(err, expenses) {
        res.json(expenses);
    });
});

/*insert into users 
	(username, email, password_hash) values ('dummy', 'dummy@dummies.com', '123words'), ('else', 'else@goons.com', '123goons');*/

	

// Cron Job to check spent v. budget and give a grade every minute

// new CronJob('1 * * * * *', function() {
//  console.log('You will see this message every minute');
//  connection.query("INSERT INTO income_frequencies" + " SET ?", {
//          type: "food",
//        }, function(err, res) { console.log('completed!')});
// }, null, true, 'America/New_York');





/*
 if we don't do this here then we'll get this error in apps that use this api

 Fetch API cannot load No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

 read up on CORs here: https://www.maxcdn.com/one/visual-glossary/cors/
*/
 //allow the api to be accessed by other apps

 

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
   next();
 });

app.get("/budget", function(req, res) {
  res.json(this.state.pay);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(PORT, function() {
   console.log(':earth_americas: ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
 });



module.exports = app;
