
const router = require("express").Router();

const Astronaut = require("../models/Astronaut");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const validateObjectId = require("../middleware/validateObjectId");
const upload = require("../middleware/upload");

// GET all astronauts
router.get("/", async (req, res) => {
  try {
    const astronauts = await Astronaut.find().populate("missions", "missionName image launchDate");
    res.status(200).json(astronauts);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET one astronaut
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const astronaut = await Astronaut.findById(req.params.id).populate("missions", "missionName image launchDate");

    if (!astronaut) {
      return res.status(404).json({ message: "Astronaut not found" });
    }

    res.status(200).json(astronaut);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// CREATE astronaut (Admin only)
router.post("/", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const astronautData = { ...req.body };

    if (req.file) {
      astronautData.image = `/uploads/${req.file.filename}`;
    }

    const astronaut = await Astronaut.create(astronautData);
    res.status(201).json(astronaut);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE astronaut (Admin only)
router.put("/:id", verifyToken, isAdmin, validateObjectId, upload.single("image"), async (req, res) => {
  try {
    const astronautData = { ...req.body };

    if (req.file) {
      astronautData.image = `/uploads/${req.file.filename}`;
    }

    const astronaut = await Astronaut.findByIdAndUpdate(
      req.params.id,
      astronautData,
      { new: true, runValidators: true }
    );

    if (!astronaut) {
      return res.status(404).json({ message: "Astronaut not found" });
    }

    res.status(200).json(astronaut);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE astronaut (Admin only)
router.delete("/:id", verifyToken, isAdmin, validateObjectId, async (req, res) => {
  try {
    const astronaut = await Astronaut.findByIdAndDelete(req.params.id);

    if (!astronaut) {
      return res.status(404).json({ message: "Astronaut not found" });
    }

    res.status(200).json({ message: "Astronaut deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
