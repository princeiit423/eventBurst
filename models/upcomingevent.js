const express=require("express");
const app= express();
const mongoose= require("mongoose");

const upcomingeventSchema= new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    posterUrl:{
        type:String,
    },
    dateOfEvent: {
        type:Date,
    },
    location:{
        type:String,
    },
    club:{
        type:String,
    },
    userregister:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userregister",
    }
    ]
})

const upcomingevent= mongoose.model("upcomingevent", upcomingeventSchema);
module.exports= upcomingevent;