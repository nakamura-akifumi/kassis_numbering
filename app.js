var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');

var listen_port = process.env.KASSIS_NUMBER_LISTEN_PORT || 3000;

var routes = require('./server/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, './client', 'public')));
app.use('/', routes);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

app.listen(listen_port, function() {
  //console.log("database connect:"+conString);
  console.log('kassis numbering is Running on http://localhost:'+listen_port);
})
