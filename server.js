
/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Anmol Agarwal Student ID: 155037211 Date: 1 November 2022
* Online (Cyclic) Link: https://cute-cyan-vulture-hose.cyclic.app
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
const db = require("./modules/collegeData.js");

var app = express();
app.use(express.static("public"));
const exphbs = require("express-handlebars");
const res = require("express/lib/response");

const userMod = require("./modules/collegeData.js");


app.use((req,res,next)=>{

let userAgent=req.get("user-agent");
console.log(userAgent);
next();
})

app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
 });
 
 app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs', 
  defaultLayout: "main",
  helpers: {
    navLink: function(url, options){
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    
    equal: function(lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');


app.get("/", (req,res)=>{
  res.render("home");
  
});




app.get("/htmlDemo", (req,res)=>{
  //res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
  res.render("htmlDemo");
});

app.get("/home", (req,res)=>{
  //res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render("home");
});


app.get("/students/add", (req,res)=>{
  res.render("addStudent")
});

app.get("/about", (req,res)=>{ 
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
 
});


app.get("/students",(req,res)=>{
  var course = req.query.course;
  if(course != "" && course > 0){
    db.getStudentsByCourse(course).then( data => {
      res.render("students", {students: data}); 
    }).catch(err => {
      res.render("students", {message: "No Results available"});
    })
  } else {
    db.getAllStudents().then( data => {
      res.render("students", {students:data}); 
    }).catch(err => {
      res.render("students", {message: "No Results available"});
    });
  }
});

app.get("/courses", (req,res)=>{
  userMod.getCourses().then(data=>{
      res.render("courses", {courses: data}); 
  }).catch(err=>{
      res.render("courses", {message: "no results"}); 
  });
});

app.get("/course/:id", (req, res) => {
  db.getCourseById(req.params.id).then((data) => {
    res.render("course", { course: data });
  }).catch(err=> {
    res.json({message: err});
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
  db.getStudentByNum(req.params.num).then(data => {
    res.render("student", { student: data });
  }).catch(err=> {
      res.json({message: "no results"});
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


app.post("/students/add", (req,res)=>{
  req.body.TA = (req.body.TA) ? true : false;   
    db.addStudent(req.body).then(()=>{
      res.redirect("/students");
      }).catch((err)=>{
      res.json("Error");
  });
});

app.post("/student/update", (req, res) => {
  req.body.TA = (req.body.TA) ? true : false;
  db.updateStudent(req.body).then(()=>{
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