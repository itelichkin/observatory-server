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

app.get('/universe', async function (req, res) {
    const universe = await observatoryDB.universe.getUniverse();
    let data = {};
    if (universe && universe.length > 0) {
        data = {
            id: universe[0]._id,
            name: universe[0].name,
            weight: universe[0].weight,
            speed: universe[0].speed,
            discoverer: universe[0].discoverer,
            position: {
                x: universe[0].position.x,
                y: universe[0].position.y
            },
            galaxiesAmount: universe[0].galaxiesAmount,
            age: universe[0].age,
            averageTemperature: universe[0].averageTemperature,
            diameter: universe[0].diameter,
            type: universe[0].type,
        };
    }
    res.send(data);
});

app.get('/galaxies', async function (req, res) {
    const galaxies = await observatoryDB.galaxies.getGalaxies();
    let data = galaxies || [];
   /* if (galaxies && galaxies.length > 0) {
        data = {
            id: universe[0]._id,
            name: universe[0].name,
            weight: universe[0].weight,
            speed: universe[0].speed,
            discoverer: universe[0].discoverer,
            position: {
                x: universe[0].position.x,
                y: universe[0].position.y
            },
            galaxiesAmount: universe[0].galaxiesAmount,
            age: universe[0].age,
            averageTemperature: universe[0].averageTemperature,
            diameter: universe[0].diameter,
            type: universe[0].type,
        };
    }*/
    res.send(data);
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

app.get('/systems', async function (req, res) {
    const systems = await observatoryDB.systems.getSystems();
    let data = systems || [];
    /* if (galaxies && galaxies.length > 0) {
         data = {
             id: universe[0]._id,
             name: universe[0].name,
             weight: universe[0].weight,
             speed: universe[0].speed,
             discoverer: universe[0].discoverer,
             position: {
                 x: universe[0].position.x,
                 y: universe[0].position.y
             },
             galaxiesAmount: universe[0].galaxiesAmount,
             age: universe[0].age,
             averageTemperature: universe[0].averageTemperature,
             diameter: universe[0].diameter,
             type: universe[0].type,
         };
     }*/
    res.send(data);
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
app.get('/central-stars', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const centralStars = await observatoryDB.centralStars.getCentralStars();
        let data = centralStars || [];
        /* if (galaxies && galaxies.length > 0) {
             data = {
                 id: universe[0]._id,
                 name: universe[0].name,
                 weight: universe[0].weight,
                 speed: universe[0].speed,
                 discoverer: universe[0].discoverer,
                 position: {
                     x: universe[0].position.x,
                     y: universe[0].position.y
                 },
                 galaxiesAmount: universe[0].galaxiesAmount,
                 age: universe[0].age,
                 averageTemperature: universe[0].averageTemperature,
                 diameter: universe[0].diameter,
                 type: universe[0].type,
             };
         }*/
        res.send(data);
    }
});


app.get('/planets', async function (req, res) {
    if (req.method === 'GET') {
        const id = req.params.id;
        const planets = await observatoryDB.planets.getPlanets();
        let data = planets || [];
        /* if (galaxies && galaxies.length > 0) {
             data = {
                 id: universe[0]._id,
                 name: universe[0].name,
                 weight: universe[0].weight,
                 speed: universe[0].speed,
                 discoverer: universe[0].discoverer,
                 position: {
                     x: universe[0].position.x,
                     y: universe[0].position.y
                 },
                 galaxiesAmount: universe[0].galaxiesAmount,
                 age: universe[0].age,
                 averageTemperature: universe[0].averageTemperature,
                 diameter: universe[0].diameter,
                 type: universe[0].type,
             };
         }*/
        res.send(data);
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
