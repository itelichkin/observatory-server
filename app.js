const express = require('express');
const http = require('http');
const path = require('path');
const config = require('./config');
const log = require('./lib/log')(module);
const mongoose = require('./lib/mongoose');
const HttpError = require('./error').HttpError;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session');
const favicon = require('express-favicon');
const sessionStore = require('./lib/sessionStore');
const errorHandler = require('errorhandler');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || config.get('port');


app.use(favicon(__dirname + '/public/favicon.ico'));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('default'));
}

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));


app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://observatory-ui.herokuapp.com');
  //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);

  // Pass to next layer of middleware
  next();
});

require('./routes')(app);

app.use(function (err, req, res, next) {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

const server = http.createServer(app);
server.listen(PORT, function () {
  log.info('Express server listening on port ' + config.get('port'));
  console.log('Express server listening on port ' + config.get('port'));
});
