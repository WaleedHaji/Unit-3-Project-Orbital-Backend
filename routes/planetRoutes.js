const express = require('express');
const router = require('express').Router()

const Planet = require('../models/Planet');
const User=require('../models/User')

// image upload
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


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


router.put('/:id', async (req,res)=>{

    const updatedPlanet = await Planet.findByIdAndUpdate(
        req.params.id,
        req.body,
        
        
    )
    res.json(updatedPlanet)
})


module.exports = router;