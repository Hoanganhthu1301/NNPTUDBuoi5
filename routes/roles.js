const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// CREATE
router.post('/', async(req,res)=>{
    const role = await Role.create(req.body);
    res.json(role);
});

// GET ALL
router.get('/', async(req,res)=>{
    const roles = await Role.find({deleted:false});
    res.json(roles);
});

// GET BY ID
router.get('/:id', async(req,res)=>{
    const role = await Role.findById(req.params.id);
    res.json(role);
});

// UPDATE
router.put('/:id', async(req,res)=>{
    const role = await Role.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(role);
});

// SOFT DELETE
router.delete('/:id', async(req,res)=>{
    await Role.findByIdAndUpdate(req.params.id,{deleted:true});
    res.json({message:"Deleted"});
});

module.exports = router;