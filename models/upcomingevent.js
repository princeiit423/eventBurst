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
    entryFee:{
        type:String,
    },
    userregister:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userregister",
    },
    ],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review",
    }]
})

const upcomingevent= mongoose.model("upcomingevent", upcomingeventSchema);
module.exports= upcomingevent;