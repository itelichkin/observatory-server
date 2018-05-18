const mongoose = require('../lib/mongoose');
const async = new require('async');
const Schema = mongoose.Schema;

const observerDataSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true
    },
    observablePlanets: [String],
});

exports.ObserversDataSchema = mongoose.model('ObserversDataSchema', observerDataSchema);