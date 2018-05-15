const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const systemsDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    weight: Number,
    speed: Number,
    discoverer: String,
    galaxyId: Number,
    position: {
        x: Number,
        y: Number
    },
    type: String,
    imageName: String,
    age: String,
    starsAmount: String,
    planetsAmount: String,
    dwarfPlanetAmount: String,
    satellitesAmount: String,
    smallBodyAmount: String,
    cometAmount: String
});

exports.SystemsDataSchema = mongoose.model('SystemsDataSchema', systemsDataSchema);