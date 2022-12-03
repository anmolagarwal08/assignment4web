
/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Anmol Agarwal Student ID: 155037211 Date: 2 December 2022
* Online (Cyclic) Link: https://cute-cyan-vulture-hose.cyclic.app  
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const userMod = require("./modules/collegeData.js");
var app = express();
app.use(express.static("public"));
// setup a 'route' to listen on the default url path
app.use((req,res,next)=>{


    let userAgent=req.get("user-agent");
    console.log(userAgent);
    next();
    })
    
    app.use(express.urlencoded({extended: true}));
    app.use(function (req, res, next) {
        let route = req.path.substring(1);
        app.locals.activeRoute =
          "/" +
          (isNaN(route.split("/")[1])
            ? route.replace(/\/(?!.*)/, "")
            : route.replace(/\/(.*)/, ""));
        next();
      });
      
      app.engine(
        ".hbs",
        exphbs.engine({
          extname: ".hbs",
          helpers: {
            navLink: function (url, options) {
              return (
                "<li" +
                (url == app.locals.activeRoute
                  ? ' class="nav-item active" '
                  : ' class="nav-item" ') +
                '><a class="nav-link" href="' +
                url +
                '">' +
                options.fn(this) +
                "</a></li>"
              );
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                return options.inverse(this);
                } else {
                return options.fn(this);
                }
               }
          },
        })
      );
      
      app.set("view engine", ".hbs");
    
      app.get("/", (req,res)=>{
        //res.sendFile(path.join(__dirname, "/views/home.html"));
        res.render("home");
    });
    
    app.get("/htmlDemo", (req,res)=>{
        
        res.render("htmlDemo");
    });
    
    app.get("/home", (req,res)=>{
        
        res.render("home");
    });
    
    app.get("/students", (req,res)=>{
    
        if(req.query.course){
            userMod.getStudentsByCourse(req.query.course).then(data=>{
               res.render("students",{students: data});
                console.log(data);
            }).catch(err=>{
               
                res.json({message:"no results"});
            })
    
        }else{
            userMod.getAllStudents().then(data=>{
                if(data.length>0){
                    res.render("students",{students: data});
                }else{
                        res.render("students",{ message: "no results" });
                } 
            }).catch(err=>{
                res.send({message:"no results"}); // show the error to the user
            });
        }
    });
    
    
    app.get("/courses", (req,res)=>{
    
        userMod.getCourses().then(data=>{
            if(data.length>0){
                res.render("courses", {courses: data});
            }else{
                res.render("courses",{ message: "no results" });
            }
             
        }).catch(err=>{
            res.render("courses", {message: "no results"}); 
        });
    });
    app.get("/student/:studentNum", (req, res) => {
      // initialize an empty object to store the values
      let viewData = {};
      data.getStudentByNum(req.params.studentNum).then((data) => {
      if (data) {
      viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
      viewData.student = null; // set student to null if none were returned
      }
      }).catch(() => {
      viewData.student = null; // set student to null if there was an error
      }).then(data.getCourses)
      .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"
      // loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching
      // viewData.courses object
      for (let i = 0; i < viewData.courses.length; i++) {
      if (viewData.courses[i].courseId == viewData.student.course) {
      viewData.courses[i].selected = true;
      }
      }
      }).catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
      }).then(() => {
      if (viewData.student == null) { // if no student - return an error
      res.status(404).send("Student Not Found");
      } else {
      res.render("student", { viewData: viewData }); // render the "student" view
      }
      });
     });
    
    
    app.post("/student/update", (req, res) => {
        req.body.TA = (req.body.TA) ? true : false;  
        userMod.updateStudent(req.body);
        res.redirect("/students");
    });
    
    app.get("/course/:id", (req,res)=>{
        
        userMod.getCourseById(req.params.id).then(data=>{
            if(data){
                res.render("course", {course: data});
               
            }else{
                 res.status(404).send("Course Not Found")
            }
           
        }).catch(err=>{
            
            res.json({message:"no results"}); 
        });
    });
    
    app.get("/student/delete/:studentNum",(req,res)=>{
        userMod.deleteStudentByNum(req.params.studentNum).then(()=>{
            res.redirect("/students");
        }).catch(err=>{
            res.status(505).send("Unable to Remove Student ( Student not found )")
        })
    });
    
    app.get("/course/delete/:id", (req,res)=>{
    
        userMod.deleteCourseById(req.params.id).then(()=>{
            res.redirect("/courses");
        }).catch(err=>{
            res.status(505).send("Unable to Remove Course ( Course not found )")
        })
    
    });
    
   
    
    app.get("/students/add", (req,res)=>{
       userMod.getAllStudents().then(data=>{
            res.render("addStudent");
       }).catch(err=>{
        res.render("addStudent", {students: []});
       })
    });
    
    app.get("/courses/add", (req,res)=>{
        res.render("addCourse")
    });
    
    app.get("/about", (req,res)=>{ 
        
        //res.sendFile(path.join(__dirname, "/views/about.html"));
        res.render("about");
       
    });
    
    app.post("/courses/add", (req,res)=>{
            userMod.addCourses(req.body).then(()=>{
            res.redirect("/courses");
        }).catch((err)=>{
            res.json("Error");
    });
        
    });
    app.post("/students/add", (req,res)=>{
        req.body.TA = (req.body.TA) ? true : false;   
          userMod.addStudent(req.body).then((data)=>{
            res.render("students", {students: data});
            }).catch((err)=>{
                console.log(err);
            
            res.json("Error");
        });
        
    });
    
    app.post("/course/update", (req, res) => {
        userMod.updateCourse(req.body);
    
        res.redirect("/courses"); 
    });
    
    
        app.use((req,res,next)=>{
        res.status(404).render("route");
    });
    
    userMod.initialize().then((message)=>{
        app.listen(HTTP_PORT, ()=>{
            console.log("server listening on: " + HTTP_PORT);
        });
        console.log(message);
    }).catch(err=>{
        console.log(err)
    });
    