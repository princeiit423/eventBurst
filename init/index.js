const express=require("express");
const mongoose= require("mongoose");
const Event = require("../models/event.js");
const admin= require("../models/admin.js");
const app = express();
port= 3000;

app.use(express.json());

try {
    mongoose.connect("mongodb://127.0.0.1:27017/eventburst", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB");
  } catch (error) {
    console.log("error", error.message);
  }

//app.get("/data",async (req,res)=>{
 //   const data1= {"title": "WEBINAR - TRENDS ON HIGH FREQUENCY COMMUNICATIONS",
   //         "description": "After the Pandemic surpassed a Webinar on the topic “Trends on High Frequency Communications” was organized on 20th February, 2022. It was conducted by Dr. Somak Bhattacharyya, Department of Electronics Engineering at IIT (BHU, Varanasi. Around 100 students from 1st year, 2nd year, 3rd year, and 4th year of the ECE department attended the event.The event was opened by Mr. Shiv Charan Puri, In-Charge, Innovation Centre. Dr. Bhattacharyya then delivered his knowledge about High Frequency Communications. The webinar threw some light on basic principles of Communication and Trends, the advantages, the demand, and the need to study on this field, thereby allowing the students to assess themselves and work on their profiles.",
     //       "posterUrl": "https://www.example.com/images/cybersecurity-symposium-2023.jpg",
       //     "eventUrl": "",
         //   "dateOfEvent": "2022-02-20",
        //    "location": "Innovation Centre, Asansol Engineering College",
        //    "link": "https://www.cybersecuritysymposium2023.com",
        //    } ;
   // const list= await new Event(data1);
   // await list.save();
  //  console.log("success");
   // res.send("data transfer");

//  })

app.get("/admin", async(req,res)=>{
  const admin1={"adminName": "iei001",
                "adminPassword":"sic9999"
  }
  const adminData=await new admin(admin1);
  await adminData.save();
  res.send("successfully saved!");
  
})

app.listen(port,(req,res)=>{
    console.log(`server running on port:${port}`);
})