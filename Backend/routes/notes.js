const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
//Route:1 Get all the notes using : GET "api/auth/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async(req, res)=>{  
        const notes = await Notes.find({user: req.user.id});
    res.json([notes])
})

module.exports = router;