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
    event:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "upcomingevent",
    },
    ]

});
userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User", userSchema);