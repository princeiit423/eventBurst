const mongoose= require("mongoose");
const express=require("express");

const componentSchema= new mongoose.Schema({
    component_name:String,
    quantity:Number,
    imageUrl:String,
    available:String,
    date:{
        type:Date,
        default:Date.now,
    }
})

module.exports= mongoose.model("component", componentSchema);