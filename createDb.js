const mongoose = require('./lib/mongoose');
const async = new require('async');
const config = require('./config');
require('./models/universeModel');
require('./models/galaxyModel');
require('./models/systemModel');
require('./models/centralStarModel');
require('./models/planetModel');

const Schema = mongoose.Schema;

const UniverseDataSchema = mongoose.models.UniverseDataSchema;
const GalaxiesDataSchema = mongoose.models.GalaxiesDataSchema;
const SystemsDataSchema = mongoose.models.SystemsDataSchema;
const CentralStarsDataSchema = mongoose.models.CentralStarsDataSchema;
const PlanetsDataSchema = mongoose.models.PlanetsDataSchema;

let db = mongoose.connection;

const universeSchema = new Schema();
const galaxiesSchema = new Schema();
const systemsSchema = new Schema();
const centralStarsSchema = new Schema();
const planetsSchema = new Schema();


async.series([
    open,
    checkUniverse,
    checkGalaxies,
    checkSystems,
    checkCentralStars,
    checkPlanets
], function (err) {
    if (err) {
        console.log(err)
        process.exit(err ? 255 : 0);
        throw new Error(err);
    }
    console.log('INIT')
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

async function checkUniverse(callback) {
    let _universe;
    await UniverseDataSchema.find({type: 'Universe'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _universe = res;
    });
    if (!_universe || _universe.length === 0) {
        await UniverseDataSchema.create(defaultUniverseData, function (err) {
            if (err) {
                throw new Error(err);
            }
        });
    }
    // callback(null)
}

async function checkGalaxies(callback) {
    let _galaxies;
    await GalaxiesDataSchema.find({type: 'Galaxy'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _galaxies = res;
    });
    if (!_galaxies || _galaxies.length === 0) {
        async.each(defaultGalaxiesData, function (galaxyData, callback) {
            const _galaxy = new mongoose.models.GalaxiesDataSchema(galaxyData);
            _galaxy.save(callback);
        }, callback);
    }
}

async function checkSystems(callback) {
    let _systems;
    await SystemsDataSchema.find({type: 'System'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _systems = res;
    });
    if (!_systems || _systems.length === 0) {
        async.each(defaultSystemsData, function (systemData, callback) {
            const _system = new mongoose.models.SystemsDataSchema(systemData);
            _system.save(callback);
        }, callback);
    }
}

async function checkCentralStars(callback) {
    let _centralStars;
    await CentralStarsDataSchema.find({type: 'Star'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _centralStars = res;
    });
    if (!_centralStars || _centralStars.length === 0) {
        async.each(defaultCentralStarsData, function (starData, callback) {
            const _star = new mongoose.models.CentralStarsDataSchema(starData);
            _star.save(callback);
        }, callback);
    }
}

async function checkPlanets(callback) {
    let _planets;
    await PlanetsDataSchema.find({type: 'Planet'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _planets = res;
    });
    if (!_planets || _planets.length === 0) {
        async.each(defaultPlanetsData, function (planetData, callback) {
            const _planet = new mongoose.models.PlanetsDataSchema(planetData);
            _planet.save(callback);
        }, callback);
    }
}

universeSchema.statics.getUniverse = async function () {
    let _universe;
    await UniverseDataSchema.find({type: 'Universe'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _universe = res;
    });
    return _universe || [];
};

galaxiesSchema.statics.getGalaxies = async function () {
    let _glaxies;
    await GalaxiesDataSchema.find({type: 'Galaxy'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _glaxies = res;
    });
    return _glaxies || [];
};

systemsSchema.statics.getSystems = async function () {
    let _systems;
    await SystemsDataSchema.find({type: 'System'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _systems = res;
    });
    return _systems || [];
};

centralStarsSchema.statics.getCentralStars = async function () {
    let _centralStars;
    await CentralStarsDataSchema.find({type: 'Star'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _centralStars = res;
    });
    return _centralStars || [];
};

planetsSchema.statics.getPlanets = async function () {
    let _planets;
    await PlanetsDataSchema.find({type: 'Planet'}, function (error, res) {
        if (error) {
            throw new Error(error);
        }
        _planets = res;
    });
    return _planets || [];
};

const Universe = mongoose.model('Universe', universeSchema);
const Galaxies = mongoose.model('Galaxies', galaxiesSchema);
const Systems = mongoose.model('Systems', systemsSchema);
const CentralStars = mongoose.model('CentralStars', centralStarsSchema);
const Planets = mongoose.model('Planets', planetsSchema);

const defaultUniverseData = {
    name: 'Universe',
    weight: null,
    speed: null,
    discoverer: null,
    position: {
        x: null,
        y: null
    },
    galaxiesAmount: 1600000,
    age: '13.799 billion years',
    averageTemperature: '2.72548 K',
    diameter: '47.8 – 170 billion parsecs',
    type: 'Universe',
    isUniverse: true
};
const defaultGalaxiesData = [
    {
        name: 'Milky Way',
        weight: 480000000000,
        speed: 552,
        discoverer: 'William Herschel',
        position: {
            x: null,
            y: null
        },
        diameter: '100–180k light years',
        numberOfStars: '100–400 billion',
        thickness: '2k light years',
        type: 'Galaxy',
    },
    {
        name: 'Andromeda',
        weight: 1230000000000,
        speed: 300,
        discoverer: 'Simon Marius',
        position: {
            x: null,
            y: null
        },
        diameter: '220k light years',
        numberOfStars: '1 trillion',
        thickness: '260k light years',
        type: 'Galaxy',
    },
    {
        name: 'Large Magellanic Cloud',
        weight: 100000000000,
        speed: null,
        discoverer: 'Amerigo Vespucci',
        position: {
            x: null,
            y: null
        },
        diameter: '14000 light years',
        numberOfStars: '30 billion',
        thickness: 'unknown',
        type: 'Galaxy',
    }];
const defaultSystemsData = [
    {
        name: 'Solar System',
        weight: 1.0014,
        speed: 250,
        discoverer: null,
        galaxyId: 2,
        position: {
            x: null,
            y: null
        },
        type: 'System',
        imageName: 'solar-star',
        age: '4,5682 billion years',
        starsAmount: '1',
        planetsAmount: '8',
        dwarfPlanetAmount: '5',
        satellitesAmount: `415 (172 - planets' & 243 - small bodies'`,
        smallBodyAmount: 'over 700k',
        cometAmount: '3441'
    },
    {
        name: 'Betelgeuse',
        weight: 15,
        speed: 22,
        discoverer: null,
        galaxyId: 2,
        position: {
            x: null,
            y: null
        },
        type: 'System',
        imageName: 'orange-star',
        age: '10 million years',
        starsAmount: 'unknown',
        planetsAmount: 'unknown',
        dwarfPlanetAmount: 'unknown',
        satellitesAmount: 'unknown',
        smallBodyAmount: 'unknown',
        cometAmount: 'unknown'
    },
    {
        name: 'Antares',
        weight: 1.24,
        speed: 3.4,
        discoverer: 'Johann Tobias Bürg',
        galaxyId: 2,
        position: {
            x: null,
            y: null
        },
        type: 'System',
        imageName: 'yellow-star',
        age: 'unknown',
        starsAmount: '1',
        planetsAmount: 'unknown',
        dwarfPlanetAmount: 'unknown',
        satellitesAmount: 'unknown',
        smallBodyAmount: 'unknown',
        cometAmount: 'unknown'
    }, {
        name: 'Kefron',
        weight: 2.3,
        speed: 26,
        discoverer: null,
        galaxyId: 2,
        position: {
            x: null,
            y: null
        },
        type: 'System',
        imageName: 'blue-star',
        age: 'unknown',
        starsAmount: '1',
        planetsAmount: 'unknown',
        dwarfPlanetAmount: 'unknown',
        satellitesAmount: 'unknown',
        smallBodyAmount: 'unknown',
        cometAmount: 'unknown'
    }
];
const defaultCentralStarsData = [
    {
        name: 'Sun',
        weight: 1,
        speed: 2.2,
        discoverer: null,
        systemId: 5,
        position: {
            x: 600,
            y: 380
        },
        size: {
            width: 105,
            height: 100
        },
        type: 'Star',
        imageName: 'sun'
    }
];
const defaultPlanetsData = [
    {
        name: 'Mercury',
        weight: 0.000003,
        speed: null,
        discoverer: null,
        systemId: 5,
        position: {
            x: 510,
            y: 450
        },
        size: {
            width: 15,
            height: 15
        },
        type: 'Planet',
        imageName: 'mercury',
        parentRadius: 70,
        angle: 90,
        orbitSpeed: 88
    },
    {
        name: 'Venus',
        weight: 0.00004,
        speed: null,
        discoverer: null,
        systemId: 5,
        position: {
            x: 500,
            y: 380
        },
        size: {
            width: 22,
            height: 22
        },
        type: 'Planet',
        imageName: 'venus',
        parentRadius: 100,
        angle: 90,
        orbitSpeed: 116
    },
    {
        name: 'Earth',
        weight: 0.00006,
        speed: null,
        discoverer: null,
        systemId: 5,
        position: {
            x: 495,
            y: 305
        },
        size: {
            width: 25,
            height: 25
        },
        type: 'Planet',
        imageName: 'earth',
        parentRadius: 133,
        angle: 90,
        orbitSpeed: 365
    },
    {
        name: 'Mars',
        weight: 0.000006,
        speed: null,
        discoverer: null,
        systemId: 5,
        position: {
            x: 510,
            y: 265
        },
        size: {
            width: 20,
            height: 20
        },
        type: 'Planet',
        imageName: 'mars',
        parentRadius: 160,
        angle: 90,
        orbitSpeed: 687
    },
    {
        name: 'Jupiter',
        weight: 0.0019,
        speed: null,
        discoverer: 'Galileo Galilei',
        systemId: 5,
        position: {
            x: 490,
            y: 190
        },
        size: {
            width: 45,
            height: 45
        },
        type: 'Planet',
        imageName: 'jupiter',
        parentRadius: 200,
        angle: 90,
        orbitSpeed: 4343
    },
    {
        name: 'Saturn',
        weight: 0.0006,
        speed: null,
        discoverer: 'Robert Hooke',
        systemId: 5,
        position: {
            x: 455,
            y: 120
        },
        size: {
            width: 90,
            height: 40
        },
        type: 'Planet',
        imageName: 'saturn',
        parentRadius: 300,
        angle: 90,
        orbitSpeed: 10759
    },
    {
        name: 'Uranus',
        weight: 0.0008,
        speed: null,
        discoverer: 'William Herschel',
        systemId: 5,
        position: {
            x: 500,
            y: 65
        },
        size: {
            width: 32,
            height: 32
        },
        type: 'Planet',
        imageName: 'uranus',
        parentRadius: 350,
        angle: 90,
        orbitSpeed: 30660
    },
    {
        name: 'Neptune',
        weight: 0.0001,
        speed: null,
        discoverer: 'Urbain Le Verrier',
        systemId: 5,
        position: {
            x: 500,
            y: 10
        },
        size: {
            width: 30,
            height: 30
        },
        type: 'Planet',
        imageName: 'neptune',
        parentRadius: 400,
        angle: 90,
        orbitSpeed: 60148
    }
];

const observatorySchema = new Schema({
    universe: Object,
    galaxies: Object,
    systems: Object,
    centralStars: Object,
    planets: Object,
});

const ObservatoryModel = mongoose.model('ObservatoryModel', observatorySchema);

const Observatory = new ObservatoryModel({
    universe: Universe,
    galaxies: Galaxies,
    systems: Systems,
    centralStars: CentralStars,
    planets: Planets
});

module.exports = Observatory;
