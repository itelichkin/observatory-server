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

const app = express();
const router = express.Router();


const observatoryDB = new require('./createDb');

//const observatoryDB = new Observatory();

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

app.get('/space-objects', async function (req, res) {
    const allObjects = await observatoryDB.getAllSpaceObjects();
    res.send(allObjects)
});

app.post('/space-object/:type/:id', async function (req, res) {
    const id = req.params.id;
    const type = req.params.type;
    const object = await observatoryDB.editObjectById(id, type, req.body);
    res.send({modify: !!object});
});

app.delete('/space-object/:type/:id', async function (req, res) {
    const id = req.params.id;
    const type = req.params.type;
    const object = await observatoryDB.removeObject(id, type);
    res.send({removed: !!object});
});


app.get('/space-object/:type/:id', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const type = req.params.type;
        const object = await observatoryDB.getObjectById(id, type);
        res.send(object)
    }
});

app.post('/space-object', async function (req, res) {
    const id = req.params.id;
    const type = req.params.type;
    const object = await observatoryDB.createSpaceObject(id, type, req.body);
    res.send({saved: !!object});
});

app.get('/universe', async function (req, res) {
    const universe = await observatoryDB.universe.getUniverse();
    res.send(universe);
});

app.get('/galaxies', async function (req, res) {
    const galaxies = await observatoryDB.galaxies.getGalaxies();
    res.send(galaxies);
});

app.get('/galaxy/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy GET', id)
        res.end('galaxy GET')
    }
});

app.get('/galaxy/:id/systems', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('galaxy systems GET', id)
        res.end('galaxy systems GET')
    }
});

app.get('/systems', async function (req, res) {
    const systems = await observatoryDB.systems.getSystems();
    res.send(systems);
});

app.get('/system/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('system GET', id)
        res.end('system GET')
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
    }
});
app.get('/central-stars', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const centralStars = await observatoryDB.centralStars.getCentralStars();
        res.send(centralStars);
    }
});


app.get('/planets', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const planets = await observatoryDB.planets.getPlanets();
        res.send(planets);
    }
});

app.get('/planet/:id', function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        console.log('planet GET', id)
        res.end('planet GET')
    }
});


const server = http.createServer(app);
server.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});
