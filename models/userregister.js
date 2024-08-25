const express= require("express");
const mongoose  = require("mongoose");

const userregisterSchema= new mongoose.Schema({
        name:{
                type:String,
                required:true
        },
        email:{
                type:String,
                required:true,
        },
        department:String,
        roll:Number,
        semester:Number,
        date:{
                type: Date,
		default: Date.now,
        }
})

const newregister= mongoose.model("userregister", userregisterSchema);
module.exports= newregister;