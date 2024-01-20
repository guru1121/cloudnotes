const express = require('express');
const User = require('../models/Users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//creating json web token to verify user
const JWT_SECRET = 'Guru$lpha';

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
    });

    const data = {
     user: {
      id: user.id
     }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    
    // res.json({user});
    res.json({authtoken});

  }
  
  catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
})

// authenticate a user using : Post "/api/auth/login"
router.post('/login',[

  body('email','Enter a valid email').isEmail(),
  body('password','Password Cannot be blankk').exists(),
  ] , async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if (!user){
        return res.status(400).json({error:"Please try to login with correct credentials"});
      }
      const passwordCompare =await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({error:"Please try to login with correct credentials"});
      }
      const data = {
        user: {
         id: user.id
        }
       }

       const authtoken = jwt.sign(data, JWT_SECRET);
       res.json({authtoken});
   
    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server errors");
    }
})
module.exports = router