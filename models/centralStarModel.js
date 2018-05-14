const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const centralStarsDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
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
    imageName: String
});

exports.CentralStarsDataSchema = mongoose.model('CentralStarsDataSchema', centralStarsDataSchema);