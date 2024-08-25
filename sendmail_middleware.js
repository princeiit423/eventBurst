const fs = require('fs');
const nodemailer= require("nodemailer");
const path = require("path");
const ejs = require("ejs");

//send mail middleware
sendmail= async (req,res,next)=>{
    //let testAccount = await nodemailer.createTestAccount();
    const {name, department,roll,semester,year}= req.body;
    console.log(req.body);

    //read template path
    const templatePath = path.join(__dirname, 'views/test/emailtemplate.ejs');
    const templateStr = fs.readFileSync(templatePath, 'utf8');

    //render template
    const htmlContent = ejs.render(templateStr,{name,department,roll,semester,year});

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: 'api',
        pass: 'fffe9857dda802500aa3c9bec8013f0e'
    },
  });

  let info = await transporter.sendMail({
    from: `"prince" <noreply@demomailtrap.com>`, // sender address
    to: "princeiit423@gmail.com", // list of receivers
    subject: "You register successfull !", // Subject line
    text: "Name= Apoorva , Department= ECE , Roll no.= 10800322069 , Status= Success", // plain text body
    html: htmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(info);
  next();

}
module.exports= sendmail;
