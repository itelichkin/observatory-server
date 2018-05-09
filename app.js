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
const router = express.Router();

app.use(favicon(__dirname + '/public/favicon.ico'));

if (app.get('env') === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('default'));
}

 app.use(express.urlencoded({extended: true}));

// app.use(cookieParser());

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

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

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


app.use(function (err, req, res, next) {
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

app.get('/space-objects', function (req, res) {
    console.log('space-objects')
    res.end('space-objects')
});

app.get('/space-object/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('space-object GET', id)
        res.end('space-object GET')
    } else if (req.method === 'POST') {
        const id = req.params.id;
        console.log('space-object POST', id)
        res.end('space-object POST')
    } else if (req.method === 'DELETE') {
        const id = req.params.id;
        console.log('DELETE ID', id)
        res.end('DELETE ID')
    }

});

app.get('/space-object', function (req, res) {
    if (req.method === 'POST') {
        const id = req.params.id;
        console.log('space-object NEW')
        res.ok();
        res.end('space-object NEW')
    } else {
        console.log('works NEW')
        res.end('works NEW')
    }
});

app.get('/universe', function (req, res) {
    console.log('universe ')
    res.end('universe ');
});

app.get('/galaxies', function (req, res) {
    console.log('galaxies ')
    res.end('galaxies')
});

app.get('/galaxy/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy GET', id)
        res.end('galaxy GET')
    } else if (req.method === 'POST') {
        const id = req.params.id;
        console.log('galaxy POST', id)
        res.end('galaxy POST')
    } else if (req.method === 'DELETE') {
        const id = req.params.id;
        console.log('DELETE galaxy', id)
        res.end('DELETE galaxy')
    }
});

app.get('/galaxy/:id/systems', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy systems GET', id)
        res.end('galaxy systems GET')
    }
});

app.get('/systems', function (req, res) {
    console.log('systems ')
    res.end('systems')
});

app.get('/system/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('system GET', id)
        res.end('system GET')
    } else if (req.method === 'POST') {
        const id = req.params.id;
        console.log('system POST', id)
        res.end('system POST')
    } else if (req.method === 'DELETE') {
        const id = req.params.id;
        console.log('DELETE system', id)
        res.end('DELETE system')
    }
});

app.get('/system/:id/central-star', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy systems GET', id)
        res.end('galaxy systems GET')
    }
});

app.get('/system/:id/planets', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy systems GET', id)
        res.end('galaxy systems GET')
    }
});

app.get('/central-star/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('central-star GET', id)
        res.end('central-star GET')
    } else if (req.method === 'POST') {
        const id = req.params.id;
        console.log('central-star POST', id)
        res.end('central-star POST')
    } else if (req.method === 'DELETE') {
        const id = req.params.id;
        console.log('DELETE central-star', id)
        res.end('DELETE central-star')
    }
});
app.get('/central-stars', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('central-stars', id)
        res.end('central-stars')
    }
});


app.get('/planets', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('planets', id)
        res.end('planets')
    }
});

app.get('/planet/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('planet GET', id)
        res.end('planet GET')
    } else if (req.method === 'POST') {
        const id = req.params.id;
        console.log('planet POST', id)
        res.end('planet POST')
    } else if (req.method === 'DELETE') {
        const id = req.params.id;
        console.log('DELETE planet', id)
        res.end('DELETE planet')
    }
});



const server = http.createServer(app);
server.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));

});
