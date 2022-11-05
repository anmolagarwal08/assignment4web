
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Anmol Agarwal Student ID: 155037211 Date: 1 November 2022
* Online (Cyclic) Link: 
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
const db = require("./modules/collegeData.js");
var app = express();
app.use(express.static("public"));

app.use((req,res,next)=>{

let userAgent=req.get("user-agent");
console.log(userAgent);
next();
})

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/htmlDemo", function(req,res){
  res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
});

app.get("/students",(req,res)=>{
  var course = req.query.course;
  if(course != "" && course > 0){
    db.getStudentsByCourse(course).then( data => {
      res.json(data);
    }).catch(err => {
      res.json( {message: err} );
    })
  } else {
    db.getAllStudents().then( data => {
        res.json(data); 
    }).catch(err => {
        res.json({message: err});
    });
  }
});

app.get("/courses",(req,res)=>{
  db.getCourses().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json({message:err})
  });
});

app.get("/tas",(req,res)=>{
  db.getTAs().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json({message:err})
  });
});

app.get('/student/:num', function(req, res) {
  var num = req.params.num;
  db.getStudentByNum(num).then(data => {
      res.json(data);
  }).catch(err=> {
      res.json({message: err});
  });
});

app.get("/students/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.get("/pta", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.post("/students/add", (req,res)=>{
  req.body.TA = (req.body.TA) ? true : false;   
    db.addStudent(req.body).then(()=>{
      res.redirect("/students");
      }).catch((err)=>{
      res.json("Error");
  });
});

app.use((req, res,next) => {
  res.status(404).sendFile(path.join(__dirname,"/views/404.html"));
});

db.initialize().then(()=>{
  app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
}).catch(err=>{
  res.json({message: err});
});