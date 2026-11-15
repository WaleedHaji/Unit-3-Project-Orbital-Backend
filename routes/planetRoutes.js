const express = require('express');
const router = require('express').Router()

const Planet = require('../models/Planet');
const User=require('../models/User')

// image upload
// Image upload
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname)

        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`)
    }

})

const upload = multer({ storage })


// Create a new planet with an uploaded image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const planetData = {...req.body,image: req.file ? req.file.filename : ''}
        const planet = await Planet.create(planetData)

        res.json(planet)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// read 

router.get('/', async (req,res)=>{

    const allPlanets = await Planet.find()

    res.json(allPlanets)

})

// track updated and new planets

router.get('/recent-activity', async (req,res)=>{
    const planets = await Planet.find().sort({createdAt:-1}).limit(1)
    const updatedPlanets = await Planet.find().sort({ updatedAt: -1 }).limit(2)
    res.json({planets,updatedPlanets
    })

})



// read for one planet
router.get('/:id', async (req,res)=>{

    const foundPlanet = await Planet.findById(req.params.id)
    console.log(foundPlanet)
    res.json(foundPlanet)

})

// delete the planet

router.delete('/:id', async (req,res)=>{

    const deletedPlanet = await Planet.findByIdAndDelete(req.params.id)
    res.json(deletedPlanet)
})


// update


router.put('/:id', upload.single('image'), async (req, res) => {
    try {

        const updatedData = {
            ...req.body
        }

        // Only update the image if a new one was uploaded
        if (req.file) {
            updatedData.image = req.file.filename
        }

        const updatedPlanet = await Planet.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        )

        res.json(updatedPlanet)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


module.exports = router;