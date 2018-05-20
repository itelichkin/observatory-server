const observatoryDB = new require('../data-base/createDb');

module.exports = function (app) {

    app.get('/space-objects', async function (req, res, next) {
        let allObjects;
        try {
            allObjects = await observatoryDB.getAllSpaceObjects();
        } catch (e) {
            next(e)
        } finally {
            res.send(allObjects)
        }
    });

    app.delete('/space-object', async function (req, res, next) {
        const id = req.query.id;
        const type = req.query.type;
        let object;
        try {
            object = await observatoryDB.removeObject(id, type);
        } catch (e) {
            next(e)
        } finally {
            res.send({removed: !!object});
        }
    });

    app.get('/space-object', async function (req, res, next) {
        const id = req.query.id;
        const type = req.query.type;
        let object;
        try {
            object = await observatoryDB.getObjectById(id, type);
        } catch (e) {
            next(e)
        } finally {
            res.send(object)
        }
    });

    app.post('/space-object', async function (req, res, next) {
        let object;
        try {
            object = await observatoryDB.editObjectById(req.body);
        } catch (e) {
            next(e)
        } finally {
            res.send({modify: !!object});
        }
    });

    app.post('/space-objects', async function (req, res, next) {
        let object;
        try {
            object = await observatoryDB.createSpaceObject(req.body);
        } catch (e) {
            next(e)
        } finally {
            res.send({saved: !!object});
        }
    });

    app.get('/universe', async function (req, res, next) {
        let universe;
        try {
            universe = await observatoryDB.universe.getUniverse();
        } catch (e) {
            next(e)
        } finally {
            res.send(universe);
        }
    });

    app.get('/galaxies', async function (req, res, next) {
        let galaxies;
        try {
            galaxies = await observatoryDB.galaxies.getGalaxies();
        } catch (e) {
            next(e)
        } finally {
            res.send(galaxies);
        }
    });

    app.get('/galaxy', async function (req, res, next) {
        const id = req.query.id;
        let galaxy;
        try {
            galaxy = await observatoryDB.galaxies.getGalaxyById(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(galaxy);
        }
    });

    app.get('/galaxy/systems', async function (req, res, next) {
        const id = req.query.id;
        let galaxy;
        try {
            galaxy = await observatoryDB.galaxies.getSystemsByGalaxyId(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(galaxy);
        }
    });

    app.get('/systems', async function (req, res, next) {
        let systems;
        try {
            systems = await observatoryDB.systems.getSystems();
        } catch (e) {
            next(e)
        } finally {
            res.send(systems);
        }
    });

    app.get('/system', async function (req, res, next) {
        const id = req.query.id;
        let system;
        try {
            system = await observatoryDB.systems.getSystemById(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(system);
        }
    });

    app.get('/system/central-stars', async function (req, res, next) {
        const id = req.query.id;
        let stars;
        try {
            stars = await observatoryDB.systems.getCentralStarsBySystemId(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(stars);
        }
    });

    app.get('/system/planets', async function (req, res, next) {
        const id = req.query.id;
        let planets;
        try {
            planets = await observatoryDB.systems.getPlanetsBySystemId(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(planets);
        }
    });

    app.get('/central-star/', async function (req, res, next) {
        const id = req.query.id;
        let star;
        try {
            star = await observatoryDB.centralStars.getCentralStarById(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(star);
        }
    });

    app.get('/central-stars', async function (req, res, next) {
        let centralStars;
        try {
            centralStars = await observatoryDB.centralStars.getCentralStars();
        } catch (e) {
            next(e)
        } finally {
            res.send(centralStars);
        }
    });

    app.get('/planets', async function (req, res, next) {
        let planets;
        try {
            planets = await observatoryDB.planets.getPlanets();
        } catch (e) {
            next(e)
        } finally {
            res.send(planets);
        }
    });

    app.get('/planet', async function (req, res, next) {
        const id = req.query.id;
        let planet;
        try {
            planet = await observatoryDB.planets.getPlanetById(id);
        } catch (e) {
            next(e)
        } finally {
            res.send(planet);
        }
    });

    app.get('/observers', async function (req, res, next) {
        let observers;
        try {
            observers = await observatoryDB.observers.getObservers();
        } catch (e) {
            next(e)
        } finally {
            res.send(observers);
        }
    });

    app.post('/observers', async function (req, res, next) {
        let observers;
        try {
            observers = await observatoryDB.observers.setObservers(req.body);
        } catch (e) {
            next(e)
        } finally {
            res.send(observers);
        }
    });
};
