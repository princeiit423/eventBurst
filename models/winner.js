const mongoose= require("mongoose");
const express=require("express");

const winnerSchema= new mongoose.Schema({
    name:String,
    department:String,
    imageUrl:String,
    semester:Number,
    year:Number,
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports= mongoose.model("winner", winnerSchema);