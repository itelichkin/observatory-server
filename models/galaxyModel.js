const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const galaxiesDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
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
