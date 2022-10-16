const Fastify = require('fastify');
const app = Fastify({ logger: true });
const fs = require('fs');

const studentData = fs.readFileSync(`${__dirname}/students.json`);
const studentDataObj = JSON.parse(studentData);

//GET students data
app.get('/report', (req, res) => {
    res.send(studentData);
})

//POST - add students data
app.post('/add', (req, res) => {
    const newStudent = req.query;
    if (studentDataObj.find(el => el.studentID === newStudent.studentID))
    {
        res.send({ message: "duplicate id, please assign a new id" });
    }
    else
    {
        studentDataObj.push(newStudent);

        fs.writeFile(`${__dirname}/students.json`, JSON.stringify(studentDataObj), (err) => {
            console.log(newStudent);
            res.status(201).send({ message: "Added student", newStudent });
        });
    }

})

//POST - update students data
app.post('/update', (req, res) => {

    const studentID = req.query.studentID;
    const updateIndex = studentDataObj.findIndex(item => item.studentID === studentID);
    if (updateIndex > -1)
    {
        const updStudent = Object.assign(studentDataObj[updateIndex], req.query);
        studentDataObj[updateIndex] = updStudent;

        fs.writeFile(`${__dirname}/students.json`, JSON.stringify(studentDataObj), (err) => {
            res.send({
                message: `updated Student with id: ${studentID}`,
                updStudent
            });
        });

    }
    else
    {
        res.status(404).send(`Student with id:${studentID} not found`);
    }

})


//DELETE -delete students data
app.delete('/delete', (req, res) => {

    const studentID = req.query.studentID;
    const removeIndex = studentDataObj.findIndex(item => item.studentID === studentID);
    if (removeIndex > -1)
    {
        studentDataObj.splice(removeIndex, 1);
        fs.writeFile(`${__dirname}/students.json`, JSON.stringify(studentDataObj), (err) => {
            res.send({ message: `removed Student with id: ${studentID}` });
        });

    }
    else
    {
        res.status(404).send(`Student with id:${studentID} not found`);
    }

})

const port = 3000;
app.listen({ port }, () => {
    console.log('listening...');
});