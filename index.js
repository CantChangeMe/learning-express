const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());
const courses = [
    {courseId:'1' ,courseName:"Course1"},
    {courseId:'2' ,courseName:"Course2"},
    {courseId:'3' ,courseName:"Course3"}
];

app.get('/',(req, res) => {
    res.send("Hello express!");
});

app.get('/api/courses' ,(req,res) =>{
    res.send(courses);
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
    const course = {
        courseId: courses.length+1,
        courseName:req.body.courseName
    }
    
    courses.push(course);
    console.log(courses);
    res.send(course);
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

app.put('/api/courses/:id',(req,res) =>{
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
