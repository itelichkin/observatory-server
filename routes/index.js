const observatoryDB = new require('../data-base/createDb');

module.exports = function (app) {

    app.get('/space-objects', async function (req, res, next) {
        let allObjects;
        try {
            allObjects = await observatoryDB.getAllSpaceObjects();
            res.send(allObjects)
        } catch (e) {
            next(e)
        }
    });

    app.delete('/space-object', async function (req, res, next) {
        const id = req.query.id;
        const type = req.query.type;
        let object;
        try {
            object = await observatoryDB.removeObject(id, type);
            res.send({removed: !!object});
        } catch (e) {
            next(e)
        }
    });

    app.get('/space-object', async function (req, res, next) {
        const id = req.query.id;
        const type = req.query.type;
        let object;
        try {
            object = await observatoryDB.getObjectById(id, type);
            res.send(object)
        } catch (e) {
            next(e)
        }
    });

    app.post('/space-object', async function (req, res, next) {
        let object;
        try {
            object = await observatoryDB.editObjectById(req.body);
            res.send({modify: !!object});
        } catch (e) {
            next(e)
        }
    });

    app.post('/space-objects', async function (req, res, next) {
        let object;
        try {
            object = await observatoryDB.createSpaceObject(req.body);
            res.send({saved: !!object});
        } catch (e) {
            next(e)
        }
    });

    app.get('/universe', async function (req, res, next) {
        let universe;
        try {
            universe = await observatoryDB.universe.getUniverse();
            res.send(universe);
        } catch (e) {
            next(e)
        }
    });

    app.get('/galaxies', async function (req, res, next) {
        let galaxies;
        try {
            galaxies = await observatoryDB.galaxies.getGalaxies();
            res.send(galaxies);
        } catch (e) {
            next(e)
        }
    });

    app.get('/galaxy', async function (req, res, next) {
        const id = req.query.id;
        let galaxy;
        try {
            galaxy = await observatoryDB.galaxies.getGalaxyById(id);
            res.send(galaxy);
        } catch (e) {
            next(e)
        }
    });

    app.get('/galaxy/systems', async function (req, res, next) {
        const id = req.query.id;
        let galaxy;
        try {
            galaxy = await observatoryDB.galaxies.getSystemsByGalaxyId(id);
            res.send(galaxy);
        } catch (e) {
            next(e)
        }
    });

    app.get('/systems', async function (req, res, next) {
        let systems;
        try {
            systems = await observatoryDB.systems.getSystems();
            res.send(systems);
        } catch (e) {
            next(e)
        }
    });

    app.get('/system', async function (req, res, next) {
        const id = req.query.id;
        let system;
        try {
            system = await observatoryDB.systems.getSystemById(id);
            res.send(system);
        } catch (e) {
            next(e)
        }
    });

    app.get('/system/central-stars', async function (req, res, next) {
        const id = req.query.id;
        let stars;
        try {
            stars = await observatoryDB.systems.getCentralStarsBySystemId(id);
            res.send(stars);
        } catch (e) {
            next(e)
        }
    });

    app.get('/system/planets', async function (req, res, next) {
        const id = req.query.id;
        let planets;
        try {
            planets = await observatoryDB.systems.getPlanetsBySystemId(id);
            res.send(planets);
        } catch (e) {
            next(e)
        }
    });

    app.get('/central-star/', async function (req, res, next) {
        const id = req.query.id;
        let star;
        try {
            star = await observatoryDB.centralStars.getCentralStarById(id);
            res.send(star);
        } catch (e) {
            next(e)
        }
    });

    app.get('/central-stars', async function (req, res, next) {
        let centralStars;
        try {
            centralStars = await observatoryDB.centralStars.getCentralStars();
            res.send(centralStars);
        } catch (e) {
            next(e)
        }
    });

    app.get('/planets', async function (req, res, next) {
        let planets;
        try {
            planets = await observatoryDB.planets.getPlanets();
            res.send(planets);
        } catch (e) {
            next(e)
        }
    });

    app.get('/planet', async function (req, res, next) {
        const id = req.query.id;
        let planet;
        try {
            planet = await observatoryDB.planets.getPlanetById(id);
            res.send(planet);
        } catch (e) {
            next(e)
        }
    });

    app.get('/observers', async function (req, res, next) {
        let observers;
        try {
            observers = await observatoryDB.observers.getObservers();
            res.send(observers);
        } catch (e) {
            next(e)
        }
    });

    app.post('/observers', async function (req, res, next) {
        let observers;
        try {
            observers = await observatoryDB.observers.setObservers(req.body);
            res.send(observers);
        } catch (e) {
            next(e)
        }
    });
};
