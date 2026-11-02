
const router = require("express").Router();

const SpaceMission = require("../models/SpaceMission");
const verifyToken = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");

// GET all missions
router.get("/", async (req, res) => {
  try {
    const missions = await SpaceMission.find();
    res.status(200).json(missions);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET one mission
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const mission = await SpaceMission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.status(200).json(mission);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// CREATE mission
router.post("/", verifyToken, async (req, res) => {
  try {
    const mission = await SpaceMission.create(req.body);
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE mission
router.put("/:id", verifyToken, validateObjectId, async (req, res) => {
  try {
    const mission = await SpaceMission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.status(200).json(mission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE mission
router.delete("/:id", verifyToken, validateObjectId, async (req, res) => {
  try {
    const mission = await SpaceMission.findByIdAndDelete(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.status(200).json({ message: "Mission deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
