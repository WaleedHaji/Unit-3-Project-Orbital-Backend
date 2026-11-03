const router = require('express').Router()

const User = require('../models/User')
const verifyToken = require('../middleware/verifyToken')
const isAdmin = require('../middleware/isAdmin')



// Get all users
router.get('/', verifyToken, isAdmin, async (req,res)=>{
    try{
        const allUsers = await User.find().populate('username')
        res.status(200).json(allUsers)
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router;