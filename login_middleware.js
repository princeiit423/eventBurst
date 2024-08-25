const fs = require('fs');
const nodemailer= require("nodemailer");
const path = require("path");
const ejs = require("ejs");

isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        res.redirect("/login");
    }
    else{
    next();
}
}
module.exports= isLoggedIn;
