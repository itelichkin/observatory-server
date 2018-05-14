const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const galaxiesDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    weight: Number,
    speed: Number,
    discoverer: String,
    position: {
        x: Number,
        y: Number
    },
    diameter: String,
    numberOfStars: String,
    thickness: String,
    type: String,
});

exports.GalaxiesDataSchema = mongoose.model('GalaxiesDataSchema', galaxiesDataSchema);
