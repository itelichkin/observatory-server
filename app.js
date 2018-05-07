const express = require('express');
const http = require('http');
const path = require('path');
const config = require('./config');
const log = require('./lib/log')(module);
const mongoose = require('./lib/mongoose');
const HttpError = require('./error').HttpError;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const favicon = require('express-favicon');

const app = express();


app.use(favicon(__dirname + '/public/favicon.ico'));
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('default'));
}

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    resave: true,
    saveUninitialized: true
  //  store: sessionStore
}));


app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
    if (typeof err === 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') === 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

const server = http.createServer(app);
server.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
