const express = require('express');
const router = express.Router();
const User = require('../models/User');

// CREATE
router.post('/', async(req,res)=>{
   const user = await User.create(req.body);
   res.json(user);
});

// GET ALL
router.get('/', async(req,res)=>{
   const users = await User.find({deleted:false});
   res.json(users);
});

// GET BY ID
router.get('/:id', async(req,res)=>{
   const user = await User.findById(req.params.id);
   res.json(user);
});

// UPDATE
router.put('/:id', async(req,res)=>{
   const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
   res.json(user);
});

// SOFT DELETE
router.delete('/:id', async(req,res)=>{
   await User.findByIdAndUpdate(req.params.id,{deleted:true});
   res.json({message:"Deleted"});
});

// ENABLE
router.post('/enable', async(req,res)=>{
   const {email,username} = req.body;

   const user = await User.findOne({email,username});

   if(!user){
      return res.json({message:"User not found"});
   }

   user.status = true;
   await user.save();

   res.json({message:"User enabled"});
});

// DISABLE
router.post('/disable', async(req,res)=>{
   const {email,username} = req.body;

   const user = await User.findOne({email,username});

   if(!user){
      return res.json({message:"User not found"});
   }

   user.status = false;
   await user.save();

   res.json({message:"User disabled"});
});

module.exports = router;