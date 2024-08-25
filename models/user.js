const express= require("express");
const mongoose= require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true,
    },
    branch: String,
    fullname:String,
    roll:Number,
    semester:Number,
    year:Number,
    role:String,

});
userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", userSchema);