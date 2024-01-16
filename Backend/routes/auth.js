const express = require('express');
const User = require('../models/Users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


//create a user using:Post "/api/auth"
router.post('/createuser',[

    body('name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 }),

] , async(req, res)=>{
  // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether user with the same email exists
    try{
    let user = await User.findOne({email:req.body.email});
    if (user){
        return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    
    //create a new user
     user = await User.create({
      name:req.body.name,
      email: req.body.email,
      password: secPass,
    })
    res.json({user});

  }catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
})

module.exports = router