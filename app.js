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

app.delete('/space-object', async function (req, res) {
    const id = req.query.id;
    const type = req.query.type;
    const object = await observatoryDB.removeObject(id, type);
    res.send({removed: !!object});
});


app.get('/space-object', async function (req, res) {
        const id = req.query.id;
        const type = req.query.type;
        const object = await observatoryDB.getObjectById(id, type);
        res.send(object)
});

app.post('/space-object', async function (req, res) {
    const object = await observatoryDB.editObjectById(req.body);
    res.send({modify: !!object});
});

app.post('/space-objects', async function (req, res) {
    const object = await observatoryDB.createSpaceObject(req.body);
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

app.get('/galaxy', async function (req, res) {
    const id = req.query.id;
    const galaxy = await observatoryDB.galaxies.getGalaxyById(id);
    res.send(galaxy);
});

app.get('/galaxy/systems', async function (req, res) {
    const id = req.query.id;
    const galaxy = await observatoryDB.galaxies.getSystemsByGalaxyId(id);
    res.send(galaxy);
});

app.get('/systems', async function (req, res) {
    const systems = await observatoryDB.systems.getSystems();
    res.send(systems);
});

app.get('/system', async function (req, res) {
    const id = req.query.id;
    const system = await observatoryDB.systems.getSystemById(id);
    res.send(system);
});

app.get('/system/central-stars', async function (req, res) {
    const id = req.query.id;
    const stars = await observatoryDB.systems.getCentralStarsBySystemId(id);
    res.send(stars);
});

app.get('/system/planets', async function (req, res) {
    const id = req.query.id;
    const planets = await observatoryDB.systems.getPlanetsBySystemId(id);
    res.send(planets);
});

app.get('/central-star/', async function (req, res) {
    const id = req.query.id;
    const star = await observatoryDB.centralStars.getCentralStarById(id);
    res.send(star);
});
app.get('/central-stars', async function (req, res) {
    const centralStars = await observatoryDB.centralStars.getCentralStars();
    res.send(centralStars);
});


app.get('/planets', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const planets = await observatoryDB.planets.getPlanets();
        res.send(planets);
    }
});

app.get('/planet', async function (req, res) {
    const id = req.query.id;
    const planet = await observatoryDB.planets.getPlanetById(id);
    res.send(planet);
});

app.get('/observers', async function (req, res) {
    const observers = await observatoryDB.observers.getObservers();
    res.send(observers);
});

app.post('/observers', async function (req, res) {
    const observers = await observatoryDB.observers.setObservers(req.body);
    res.send(observers);
});


const server = http.createServer(app);
server.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});
