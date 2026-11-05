
const mongoose = require('mongoose')

const astronautSchema = new mongoose.Schema({
  astronautName: {
    type: String,
    required: true,
  },
  spaceAgency: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  debutYear: {
    type: Number,
    required: true,
  },
  missions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpaceMission',
  }],
})

module.exports = mongoose.model('Astronaut', astronautSchema)
