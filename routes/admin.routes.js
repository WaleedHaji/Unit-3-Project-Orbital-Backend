const router = require('express').Router()

const User = require('../models/User')
const verifyToken = require('../middleware/verifyToken')
const isAdmin = require('../middleware/isAdmin')



// Get all users
router.get('/', verifyToken, isAdmin, async (req,res)=>{
    try{
        const allUsers = await User.find({isDeleted: false}).populate('username')
        res.status(200).json(allUsers)
    }
    catch(err){
        console.log(err)
    }
})

// Toggle User/Admin roles:
router.put('/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the target user
    const user = await User.findOne({
      _id: userId,
      isDeleted: { $ne: true }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found or has been deleted."
      });
    }

    // Prevent an admin from demoting themselves
    if (req.user._id.toString() === user._id.toString() &&
        user.role === "admin") {
      return res.status(403).json({
        message: "You cannot change your own admin role."
      });
    }

    // Check whether this is a demotion
    if (user.role === "admin") {

      // Count all active administrators
      const adminCount = await User.countDocuments({
        role: "admin",
        isDeleted: { $ne: true }
      });

      // Prevent demoting the last administrator
      if (adminCount <= 1) {
        return res.status(403).json({
          message: "Cannot demote the last remaining administrator."
        });
      }
    }

    // Toggle the role
    const newRole = user.role === "admin" ? "user" : "admin";

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: `User role successfully changed to ${newRole}.`,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal Server Error."
    });
  }
});


router.put('/:userId', verifyToken, isAdmin, async (req,res)=> {
  try{
    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    res.status(204).json(deleteUser)
  }
  catch(err){
    console.log(err)
  }
})

module.exports = router;