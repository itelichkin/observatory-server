const observatoryDB = new require('../createDb');

module.exports = function (app) {

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

};
