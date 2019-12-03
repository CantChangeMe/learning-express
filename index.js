const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const courses = [
    {courseId:'1' ,courseName:"Course1"},
    {courseId:'2' ,courseName:"Course2"},
    {courseId:'3' ,courseName:"Course3"}
];

//Connecting to Mysql Database.
const mysqlConnection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mydb'
});

app.get('/',(req, res) => {
    res.send("Hello express!");
});

app.get('/api/courses' ,(req,res) =>{
    mysqlConnection.query(
        `Select * from course;`,
        (err, courses) =>{
            if (err) {
              return res.send(err);
            }else{
               return res.json({courses});
               // console.log(courses);
            }
        }
    );
})

app.get('/api/posts/:year/:month',(req,res) => {
    res.send(req.params);
})
app.get('/api/courses/:id',(req,res) => {
    const course  = courses.find(c => c.courseId == parseInt(req.params.id));
    if (!course) {
        res.status('404').send("Course not found");
    }
    res.send(course);
})

app.post('/api/courses',(req,res) => {
    const schema = {
        courseName:Joi.string().min(3).required()
    }
    const result = Joi.validate(req.body,schema); 
    console.log( );
    if(result.error){
        res.status('404').send(result.error.message);
    }
    //Mysql insert starts here.
    const courseId = 0;
    const courseName = req.body.courseName;
    console.log(courseName);
    const INSERT_MYSQL_QUERY =`Insert into course values('${courseId}','${courseName}');`
    mysqlConnection.query(
        INSERT_MYSQL_QUERY,
        (err, courses) =>{
            if (err) {
              return res.send(err);
            }else{
               return res.send('Successfully added the product');
            }
        }
    );    
})

app.put('/api/courses/:id',(req,res) =>{
    const course  = courses.find(c => c.courseId == parseInt(req.params.id));
    if (!course) {
        res.status('404').send("Course not found");
    }

    const {error} = validateCourse(req.body);
    if(error){
        res.status('404').send(error.details[0].message);
        return;
    }
    course.courseName = req.body.courseName;

    res.status('200').send(course);
})

app.delete('/api/courses/:id',(req,res) =>{
    const course  = courses.find(c => c.courseId == parseInt(req.params.id));
    if (!course) {
        res.status('404').send("Course not found");
    }
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
})

function validateCourse(course) {
    const schema = {
        courseName:Joi.string().min(3).required()
    }
    return Joi.validate(course,schema); 
}

const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})
 