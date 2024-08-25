const express= require("express");
const mongoose= require("mongoose");

const eventSchema= new mongoose.Schema({
    title: String,
    description: String,
    posterUrl: String,
    eventUrl: String,
    dateOfEvent: Date,
    location: String,
    link: String,
    studentPresent: [{
        student: String,
    }
    ]
});

module.exports= mongoose.model("Event", eventSchema);