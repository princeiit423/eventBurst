const express= require("express");
const mongoose= require("mongoose");

const reviewSchema= mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        "default":5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
})
module.exports= mongoose.model("review", reviewSchema);