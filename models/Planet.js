const mongoose = require('mongoose')

const planetSchema = new mongoose.Schema({
    planetName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    diameter: {
        type: Number,
        required: true
    },

    distanceFromTheSun: {
        type: Number,
        required: true
    },

    numberOfMoons: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Planet', planetSchema)