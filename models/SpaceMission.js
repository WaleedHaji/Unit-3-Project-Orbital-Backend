
const mongoose = require("mongoose");

const spaceMissionSchema = new mongoose.Schema(
  {
    missionName: {
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
    launchDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const SpaceMission = mongoose.model("SpaceMission", spaceMissionSchema);

module.exports = SpaceMission;
