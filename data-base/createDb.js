const mongoose = require('../lib/mongoose');
const async = new require('async');
const config = require('../config');
require('../models/universeModel');
require('../models/galaxyModel');
require('../models/systemModel');
require('../models/centralStarModel');
require('../models/planetModel');
require('../models/observerModel');

const Schema = mongoose.Schema;

const UniverseDataSchema = mongoose.models.UniverseDataSchema;
const GalaxiesDataSchema = mongoose.models.GalaxiesDataSchema;
const SystemsDataSchema = mongoose.models.SystemsDataSchema;
const CentralStarsDataSchema = mongoose.models.CentralStarsDataSchema;
const PlanetsDataSchema = mongoose.models.PlanetsDataSchema;
const ObserversDataSchema = mongoose.models.ObserversDataSchema;

let db = mongoose.connection;

const universeSchema = new Schema();
const galaxiesSchema = new Schema();
const systemsSchema = new Schema();
const centralStarsSchema = new Schema();
const planetsSchema = new Schema();
const observersSchema = new Schema();


async.series([
    open,
    checkUniverse,
    checkGalaxies,
    checkSystems,
    checkCentralStars,
    checkPlanets,
    checkObservers
], function (err) {
    if (err) {
        return new Error(err)
    }
    console.log('INIT')
});

function open(callback) {
    mongoose.connection.on('open', function (err) {
        if (err) {
            return new Error(err)
        }
        callback(null, 'open')
    });
}

function checkUniverse(mainCallback) {
    // await UniverseDataSchema.remove({})
    async.waterfall([
        function (callback) {
            UniverseDataSchema.find({}, function (error, res) {
                if (error) {
                    return new Error(error)
                }
                callback(null, res);
            });
        },
        function (universe, callback) {
            if (!universe || universe.length === 0) {
                UniverseDataSchema.create(defaultUniverseData, function (err, res) {
                    if (err) {
                        return new Error(err)
                    }
                });
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'universe')
    });
}

function checkGalaxies(mainCallback) {
    /* await GalaxiesDataSchema.remove({}, function () {
             })*/
    async.waterfall([
        function (callback) {
            GalaxiesDataSchema.find({}, function (error, res) {
                if (error) {
                    return new Error(error)
                }
                callback(null, res);
            });
        },
        function (galaxies, callback) {
            if (!galaxies || galaxies.length === 0) {
                async.each(defaultGalaxiesData, function (galaxyData, callback) {
                    const _galaxy = new mongoose.models.GalaxiesDataSchema(galaxyData);
                    _galaxy.save();
                });
            }
            callback(null, 'done')
        }
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'galaxy')
    });
}

function checkSystems(mainCallback) {
//      await SystemsDataSchema.remove({});
    async.waterfall([
        function (callback) {
            SystemsDataSchema.find({}, function (error, res) {
                if (error) {
                    return new Error(error)
                }
                callback(null, res);
            });
        },
        function (systems, callback) {
            if (!systems || systems.length === 0) {
                async.waterfall([
                    function (callback_2) {
                        GalaxiesDataSchema.findOne({name: 'Milky Way'}, function (err, galaxy) {
                            if (err) {
                                return new Error(err)
                            }
                            callback_2(null, galaxy);
                        })
                    }, function (galaxy, callback_2) {
                        async.each(defaultSystemsData, function (systemData, callback) {
                            if (galaxy) {
                                systemData.galaxyId = galaxy._id
                            }
                            const _system = new mongoose.models.SystemsDataSchema(systemData);
                            _system.save();
                        });
                    }
                ]);
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'system')
    });
}

function checkCentralStars(mainCallback) {
    // await CentralStarsDataSchema.remove({});
    async.waterfall([
        function (callback) {
            CentralStarsDataSchema.find({}, function (err, res) {
                if (err) {
                    return new Error(err)
                }
                callback(null, res);
            });
        },
        function (centralStars, callback) {
            if (!centralStars || centralStars.length === 0) {
                async.waterfall([
                    function (callback_2) {
                        SystemsDataSchema.findOne({name: 'Solar System'}, function (err, system) {
                            if (err) {
                                return new Error(err)
                            }
                            callback_2(null, system);
                        })
                    }, function (system, callback_2) {
                        async.each(defaultCentralStarsData, function (starData, callback) {
                            if (system) {
                                starData.systemId = system._id
                            }
                            const _star = new mongoose.models.CentralStarsDataSchema(starData);
                            _star.save();
                        });
                    }
                ]);
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'star')
    });
}

function checkPlanets(mainCallback) {
    //  await PlanetsDataSchema.remove({});
    async.waterfall([
        function (callback) {
            PlanetsDataSchema.find({}, function (err, res) {
                if (err) {
                    return new Error(err)
                }
                callback(null, res);
            });
        },
        function (planets, callback) {
            if (!planets || planets.length === 0) {
                async.waterfall([
                    function (callback_2) {
                        SystemsDataSchema.findOne({name: 'Solar System'}, function (err, system) {
                            if (err) {
                                return new Error(err)
                            }
                            callback_2(null, system);
                        })
                    }, function (system, callback_2) {
                        async.each(defaultPlanetsData, function (planetData, callback) {
                            if (system) {
                                planetData.systemId = system._id
                            }
                            const _planet = new mongoose.models.PlanetsDataSchema(planetData);
                            _planet.save();
                        });
                    }
                ]);
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'planet')
    });
}

function checkObservers(mainCallback) {
    // ObserversDataSchema.remove({});
    async.waterfall([
        function (callback) {
            ObserversDataSchema.find({}, function (err, res) {
                if (err) {
                    return new Error(err)
                }
                callback(null, res);
            });
        },
        function (observers, callback) {
            if (!observers || observers.length === 0) {
                async.each(defaultObserversData, function (observerData, callback) {
                    const _observer = new mongoose.models.ObserversDataSchema(observerData);
                    _observer.save(callback);
                }, callback);
            }
            callback(null, 'done');
        },
    ], function (err, result) {
        if (err) {
            return new Error(err)
        }
        mainCallback(null, 'observer')
    });
}

universeSchema.statics.getUniverse = async function () {
    return new Promise((resolve, reject) => {
        UniverseDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            if (res && res.length > 0) {
                resolve(generateUniverseData(res[0]));
            }
        });
    });
};

function generateUniverseData(univ) {
    return {
        id: univ._id,
        name: univ.name,
        weight: univ.weight,
        speed: univ.speed,
        discoverer: univ.discoverer,
        position: {
            x: univ.position.x,
            y: univ.position.y
        },
        galaxiesAmount: univ.galaxiesAmount,
        age: univ.age,
        averageTemperature: univ.averageTemperature,
        diameter: univ.diameter,
        type: univ.type,
    }
}

galaxiesSchema.statics.getGalaxies = async function () {
    return new Promise((resolve, reject) => {
        GalaxiesDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            if (res) {
                let _galaxies = [];
                res.forEach((gal) => {
                    const galaxy = generateGalaxyData(gal);
                    _galaxies.push(galaxy);
                });
                resolve(_galaxies);
            }
        });
    });
};

galaxiesSchema.statics.getGalaxyById = async function (id) {
    let galaxy;
    await GalaxiesDataSchema.findOne({_id: id}, function (err, data) {
        if (err) {

        }
        if (data) {
            galaxy = generateGalaxyData(data);
        }
    });
    return galaxy;
};

function generateGalaxyData(gal) {
    return {
        id: gal._id,
        name: gal.name,
        weight: gal.weight,
        speed: gal.speed,
        discoverer: gal.discoverer,
        position: {
            x: gal.position.x,
            y: gal.position.y
        },
        diameter: gal.diameter,
        numberOfStars: gal.numberOfStars,
        thickness: gal.thickness,
        type: gal.type
    }
}

galaxiesSchema.statics.getSystemsByGalaxyId = async function (id) {
    let systems = [];
    await SystemsDataSchema.find({galaxyId: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            data.forEach((system) => {
                systems.push(generateSystemData(system))
            });
        }
    });
    return systems;
};

systemsSchema.statics.getSystems = async function () {
    return new Promise((resolve, reject) => {
        SystemsDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            if (res) {
                let _systems = [];
                res.forEach((sys) => {
                    const system = generateSystemData(sys);
                    _systems.push(system);
                });
                resolve(_systems);
            }
        });
    });
};

systemsSchema.statics.getSystemById = async function (id) {
    let system;
    await SystemsDataSchema.findOne({_id: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            system = generateSystemData(data);
        }
    });
    return system;
};

function generateSystemData(sys) {
    return {
        id: sys._id,
        name: sys.name,
        weight: sys.weight,
        speed: sys.speed,
        discoverer: sys.discoverer,
        galaxyId: sys.galaxyId,
        position: {
            x: sys.position.x,
            y: sys.position.y
        },
        type: sys.type,
        imageName: sys.imageName,
        age: sys.age,
        starsAmount: sys.starsAmount,
        planetsAmount: sys.planetsAmount,
        dwarfPlanetAmount: sys.dwarfPlanetAmount,
        satellitesAmount: sys.satellitesAmount,
        smallBodyAmount: sys.smallBodyAmount,
        cometAmount: sys.cometAmount
    }
}

systemsSchema.statics.getCentralStarsBySystemId = async function (id) {
    let stars = [];
    await CentralStarsDataSchema.find({systemId: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            data.forEach((star) => {
                stars.push(generatePlanetData(star))
            });
        }
    });
    return stars;
};

systemsSchema.statics.getPlanetsBySystemId = async function (id) {
    let planets = [];
    await PlanetsDataSchema.find({systemId: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data && data.length > 0) {
            data.forEach((planet) => {
                planets.push(generatePlanetData(planet))
            });
        }
    });
    return planets;
};

centralStarsSchema.statics.getCentralStars = async function () {
    return new Promise((resolve, reject) => {
        CentralStarsDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            if (res) {
                let _centralStars = [];
                res.forEach((center) => {
                    const star = generateStarData(center);
                    _centralStars.push(star);
                });
                resolve(_centralStars)
            }
        });
    });
};

centralStarsSchema.statics.getCentralStarById = async function (id) {
    let star;
    await CentralStarsDataSchema.findOne({_id: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            star = generateStarData(data);
        }
    });
    return star;
};

function generateStarData(center) {
    return {
        id: center._id,
        name: center.name,
        weight: center.weight,
        speed: center.speed,
        discoverer: center.discoverer,
        systemId: center.systemId,
        position: {
            x: center.position.x,
            y: center.position.y
        },
        size: {
            width: center.size.width,
            height: center.size.height
        },
        type: center.type,
        imageName: center.imageName
    };
}

planetsSchema.statics.getPlanets = function () {
    return new Promise((resolve, reject) => {
        PlanetsDataSchema.find({}, function (err, res) {
            if (err) {
                return new Error(err)
            }
            if (res) {
                let _planets = [];
                res.forEach((plan) => {
                    const planet = generatePlanetData(plan);
                    _planets.push(planet);
                });
                resolve(_planets);
            }
        })
    });
};

planetsSchema.statics.getPlanetById = async function (id) {
    let planet = null;
    await PlanetsDataSchema.findOne({_id: id}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            planet = generatePlanetData(data);
        }
    });
    return planet;
};

function generatePlanetData(plan) {
    return {
        id: plan._id,
        name: plan.name,
        weight: plan.weight,
        speed: plan.speed,
        discoverer: plan.discoverer,
        systemId: plan.systemId,
        position: {
            x: plan.position.x,
            y: plan.position.y
        },
        size: {
            width: plan.size.width,
            height: plan.size.height
        },
        type: plan.type,
        imageName: plan.imageName,
        parentRadius: plan.parentRadius,
        angle: plan.angle,
        orbitSpeed: plan.orbitSpeed,
        observers: plan.observers
    };
}

observersSchema.statics.getObservers = async function () {
    let observers = [];
    await ObserversDataSchema.find({}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data && data.length > 0) {
            data.forEach((observer) => {
                observers.push({id: observer._id, name: observer.name, observablePlanets: observer.observablePlanets});
            })
        }
    });
    return observers;
};

observersSchema.statics.setObservers = async function (data) {
    const observerId = data['observerId'];
    const planetId = data['planetId'];
    await ObserversDataSchema.findOne({_id: observerId}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            if (data.observablePlanets && data.observablePlanets.length > 0) {
                let isExist = false;
                data.observablePlanets.some((planet) => {
                    if (planet === planetId) {
                        isExist = true;
                        return true;
                    }
                });
                if (!isExist) {
                    data.observablePlanets.push(planetId);
                    data.save();
                }
            } else {
                data.observablePlanets.push(planetId);
                data.save();
            }
        }
    });
    await PlanetsDataSchema.findOne({_id: planetId}, function (err, data) {
        if (err) {
            return new Error(err)
        }
        if (data) {
            if (data.observers && data.observers.length > 0) {
                let isExist = false;
                data.observers.some((observer) => {
                    if (observer === observerId) {
                        isExist = true;
                        return true;
                    }
                });
                if (!isExist) {
                    data.observers.push(observerId);
                    data.save();
                }
            } else {
                data.observers.push(observerId);
                data.save();
            }
        }
    });
    return {modify: true}
};

const Universe = mongoose.model('Universe', universeSchema);
const Galaxies = mongoose.model('Galaxies', galaxiesSchema);
const Systems = mongoose.model('Systems', systemsSchema);
const CentralStars = mongoose.model('CentralStars', centralStarsSchema);
const Planets = mongoose.model('Planets', planetsSchema);
const Observers = mongoose.model('Observers', observersSchema);

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
        orbitSpeed: 88,
        observers: []
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
        orbitSpeed: 116,
        observers: []
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
        orbitSpeed: 365,
        observers: []
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
        orbitSpeed: 687,
        observers: []
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
        orbitSpeed: 4343,
        observers: []
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
        orbitSpeed: 10759,
        observers: []
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
        orbitSpeed: 30660,
        observers: []
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
        orbitSpeed: 60148,
        observers: []
    }
];
const defaultObserversData = [
    {name: 'Ukraine', observablePlanets: []},
    {name: 'USA', observablePlanets: []},
    {name: 'CANADA', observablePlanets: []},
    {name: 'France', observablePlanets: []},
];

const observatorySchema = new Schema({
    universe: Object,
    galaxies: Object,
    systems: Object,
    centralStars: Object,
    planets: Object,
    observers: Object
});

observatorySchema.methods.getAllSpaceObjects = async function () {
    const universe = [await Observatory.universe.getUniverse()];
    const galaxies = await Observatory.galaxies.getGalaxies();
    const systems = await Observatory.systems.getSystems();
    const centralStars = await Observatory.centralStars.getCentralStars();
    const planets = await Observatory.planets.getPlanets();
    return universe.concat(galaxies, systems, centralStars, planets);
};

async function getSpaceObject(id, type, callBack) {
    let object;
    switch (type) {
        case 'Universe':
            const universe = await Observatory.universe.getUniverse();
            if (universe.id.toString() === id.toString()) object = generateUniverseData(universe);
            break;
        case 'Galaxy':
            await GalaxiesDataSchema.findOne({_id: id}, function (err, data) {
                if (err) {
                    return new Error(err)
                } else {
                    if (data && !callBack) {
                        object = generateGalaxyData(data);
                    } else if (data && callBack) {
                        callBack(data);
                        object = true;
                    } else {
                        object = null;
                    }
                }
            });
            break;
        case 'System':
            await SystemsDataSchema.findOne({_id: id}, function (err, data) {
                if (err) {
                    return new Error(err)
                } else {
                    if (data && !callBack) {
                        object = generateGalaxyData(data);
                    } else if (data && callBack) {
                        callBack(data);
                        object = true;
                    } else {
                        object = null;
                    }
                }
            });
            break;
        case 'Star':
            await CentralStarsDataSchema.findOne({_id: id}, function (err, data) {
                if (err) {
                    return new Error(err)
                } else {
                    if (data && !callBack) {
                        object = generateStarData(data);
                    } else if (data && callBack) {
                        callBack(data);
                        object = true;
                    } else {
                        object = null;
                    }
                }
            });
            break;
        case 'Planet':
            await PlanetsDataSchema.findOne({_id: id}, function (err, data) {
                if (err) {
                    return new Error(err)
                } else {
                    if (data && !callBack) {
                        object = generatePlanetData(data);
                    } else if (data && callBack) {
                        callBack(data);
                        object = true;
                    } else {
                        object = null;
                    }
                }
            });
            break;
        default:
            object = null;
    }
    return object;
}

observatorySchema.methods.getObjectById = async function (id, type) {
    return await getSpaceObject(id, type, null);
};

observatorySchema.methods.createSpaceObject = async function (data) {
    let result;
    switch (data.type) {
        case 'Universe':
            const universe = new mongoose.models.UniverseDataSchema(data);
            universe.save();
            result = true;
            break;
        case 'Galaxy':
            const galaxy = new mongoose.models.GalaxiesDataSchema(data);
            galaxy.save();
            result = true;
            break;
        case 'System':
            const system = new mongoose.models.SystemsDataSchema(data);
            system.save();
            result = true;
            break;
        case 'Star':
            const star = new mongoose.models.CentralStarsDataSchema(data);
            star.save();
            result = true;
            break;
        case 'Planet':
            const planet = new mongoose.models.PlanetsDataSchema(data);
            planet.save();
            result = true;
            break;
        default:
            result = false;
    }
    return result;
};

observatorySchema.methods.editObjectById = async function (data) {
    const callBack = (object) => {
        switch (data.type) {
            case 'Universe':
            case 'Galaxy':
            case 'System':
            case 'Star':
            case 'Planet':
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        if ((key !== 'id' || key !== '_id') && !!object[key] && key !== 'type') {
                            object[key] = data[key];
                        }
                    }
                }
                object.save();
                break;
        }
    };
    return await getSpaceObject(data.id, data.type, callBack);
};

observatorySchema.methods.removeObject = async function (id, type) {
    const callBack = (object) => {
        switch (type) {
            case 'Universe':
            case 'Galaxy':
            case 'System':
            case 'Star':
            case 'Planet':
                object.remove();
                break;
        }
    };
    return await getSpaceObject(id, type, callBack);
};

ObservatoryModel = mongoose.model('ObservatoryModel', observatorySchema);

const Observatory = new ObservatoryModel({
    universe: Universe,
    galaxies: Galaxies,
    systems: Systems,
    centralStars: CentralStars,
    planets: Planets,
    observers: Observers
});

module.exports = Observatory;
