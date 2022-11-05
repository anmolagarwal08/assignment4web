

const fs = require("fs");

//creating class with constructor to help manage our data fro json files 
//constructor contains two parameters
class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}


//
let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        // to read content from courses.json
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to read courses.json"); return;
            }
// to read content from students.json
            fs.readFile('./data/student.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to read students.json"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

// student function to get student objects
module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("no results returned"); return;
        }

        resolve(dataCollection.students);
    })
}

// TA function to get student objects with TA:true

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("no results returned"); return;
        }

        resolve(filteredStudents);
    });
};


// courses function to get courses object 
module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("no results retunred"); return;
    }

    resolve(dataCollection.courses);
   });
}


module.exports.getStudentsByCourse = function(course){
    return new Promise((resolve,reject)=>{
      let studentcourse = [];
  
      for(let i = 0; i < dataCollection.students.length; i++){
        if(dataCollection.students[i].course == course){
          studentcourse.push(dataCollection.students[i]);
        }
      }
  
      if(studentcourse.length > 0){
        resolve(studentcourse);
      }else{
        reject("No results returned")
      }
    });
  }
  
  module.exports.getStudentByNum = function(num){
    return new Promise((resolve, reject) => {
      if (num < 0) { 
        reject("Invalid student number"); 
        return false; 
      }
      let studentinfo = null; 
      for (let i = 1; i < dataCollection.students.length; i++) {
        if(dataCollection.students[i]["studentNum"] == num){
          studentinfo = dataCollection.students[i]; break;
        }
      }
      if (dataCollection.students.length == 0){
        reject("No results returned" + num);
      }
      resolve(studentinfo);
    });
  }

  module.exports.addStudent=function(studentData){
    return new Promise(function(resolve,reject){
      var newNumber = dataCollection.students.length;
      newNumber = newNumber+1;
       
      let returnedTarget = Object.assign({studentNum: newNumber}, studentData);       
      if( dataCollection.students.push(returnedTarget)){
        resolve("Student added")
        return;
      }    
      else{
        reject("Error")
      }
    });
  }