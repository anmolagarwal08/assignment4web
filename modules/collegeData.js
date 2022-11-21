

const fs = require("fs");

//creating class with constructor to help manage our data fro json files 
//constructor contains two parameters
class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}



 dataCollection = null;

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
module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      return resolve(dataCollection.students);
    } else {
      return reject("No results returned");
    }
  });
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
module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length > 0) {
      return resolve(dataCollection.courses);
    } else {
      return reject("No results returned");
    }
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
  
  module.exports.getStudentByNum=function(num){
    return new Promise(function(resolve,reject){
        var student = new Object();
        dataCollection.students.forEach((item) =>{
            if(item.studentNum==num){
                student=item;
            } 
            }
        ); 
        if(Object.entries(student).length === 0){
          reject("No student details found with Student Number:" + num);
        }else{
            resolve(student);
        }
     
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

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    var course = null;

    for (let i = 0; i < dataCollection.courses.length; i++) {
      if (dataCollection.courses[i]["courseId"] == id) {
        course = dataCollection.courses[i];
      }
    }

    if (!course) {
      reject("query returned 0 results"); return;
    }
    resolve(course);
  })
}

  module.exports.updateStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
  
      dataCollection.students.forEach((item) => {
        if (item.studentNum == studentData.studentNum) {
          dataCollection.students.splice(item.studentNum - 1, 1, studentData)
        }
      }
      );
      resolve("It Worked");
    });
  }