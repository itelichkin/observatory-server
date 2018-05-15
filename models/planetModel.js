const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const planetsDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    weight: Number,
    speed: Number,
    discoverer: String,
    systemId: Number,
    position: {
        x: Number,
        y: Number
    },
    size: {
        width: Number,
        height: Number
    },
    type: String,
    imageName: String,
    parentRadius: Number,
    angle: Number,
    orbitSpeed: Number
});

exports.PlanetsDataSchema = mongoose.model('PlanetsDataSchema', planetsDataSchema);