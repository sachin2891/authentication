//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
// mongoose-encryption
const app = express();







app.use(express.static("public"));

app.set('view engine', 'ejs');
//  app.use(bodyparser.urlencoded({extended:true}));

// Then you can simply get the POST content from req.body

// app.post("/yourpath", (req, res)=>{

//     var postData = req.body;
//     //then work with your data

//     //or if this doesn't work, for string body
//     var postData = JSON.parse(req.body);
// });
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);



app.get("/", function (req, res) {
    res.render("home")
});
app.get("/register", function (req, res) {
    res.render("register")
});
app.get("/login", function (req, res) {
    res.render("login")
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if (!err) {
            res.render("secrets")
        } else {
            res.render(err)
        }
    })
});
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            res.send("You are not a valid person to get to know about this please register first ");
            // console.log(password);// res.redirect("/register")
            // console.log(foundUser);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })
})



app.listen(3000, function () {
    console.log("Server Is Started at 3000 Port");
})