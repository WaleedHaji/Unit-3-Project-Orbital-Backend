const express = require('express');
const router = require('express').Router()

const Planet = require('../models/Planet');

// create a new planet
router.post('/', async (req, res) => {
    try {
        const newPlanet = await Planet.create(req.body)
        res.status(201).json(newPlanet)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// read 

router.get('/', async (req,res)=>{

    const allPlanets = await Planet.find()

    res.json(allPlanets)

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
        req.body
    )
    res.json(updatedPlanet)
})



module.exports = router;