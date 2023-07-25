const dotenv = require('dotenv');
const express= require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

dotenv.config({ path: './.env' });

const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname+ "/signup.html");
   
})

app.post("/", function(req,res){

    const firstName= req.body.fN;
    const lastName= req.body.lN;
    const email= req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_field: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData= JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/0d93978590";

    const options= {
        method : "post",
        auth: process.env.API_KEY,
    }

    const request = https.request(url, options, function(response) {
     
     if (response.statusCode === 200) {
        res.sendFile(__dirname+ "/success.html");

     } else {
        res.sendFile(__dirname+"/fail.html");
     }
        response.on("data" , function(data) {
        console.log(JSON.parse(data));
      })   
    })

    
request.write(jsonData);
request.end();

})

app.post("/fail", function(req,res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function() {
    console.log("Server is ported on 3000 ");
})