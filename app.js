var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')

var app = express();

// allow cores
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// mount index file as middleware
app.use(require('./routes/index'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// mongoose promise depricated
mongoose.Promise = global.Promise;

// Connect to Mongo on start
// should get url from config
mongoose.connect('mongodb://vikas:vikas@ds111078.mlab.com:11078/scrap_images', { useMongoClient: true, })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log('Connection established to momngo lab');
  },
  err => {
    /** handle initial connection error */
    console.log('Unable to connect to Mongo.', err)
    process.exit(1)
  });

// catch all promise that are not haldled
process.on('unhandledRejection', (reason, p) => {
  // application specific logging, throwing an error, or other logic here
  console.log('error', `Unhandled Rejection at: ${reason}`);
});


module.exports = app;