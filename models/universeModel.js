const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const universeDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    weight: String,
    speed: String,
    discoverer: String,
    position: {
        x: Number,
        y: Number
    },
    galaxiesAmount: Number,
    age: String,
    averageTemperature: String,
    diameter: String,
    type: {
        type: String,
        required: true
    },
});

exports.UniverseDataSchema = mongoose.model('UniverseDataSchema', universeDataSchema);