require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')

const { SERVER_PORT, ROLLBAR_TOKEN } = process.env;

var rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.use(express.json());

// students
const students = ["Robert", "Kaylee", "Damian"]

//endpoint
app.get('/', (req, res) => {
    rollbar.info('Someone visited our site')

    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.post('/api/students', (req, res) => {
    const { name } = req.body;

    if (!name)
    {
        rollbar.error('Someone tried to add an empty name!')

        return res.status(403).send('You must provide a name')
    }

    const index = students.findIndex(studentName => name === studentName)

    if (index === -1)
    {
        rollbar.info('Someone added a student!')

        students.push(name);

        res.status(200).send(students)
    }
    else
    {
        rollbar.error('Someone tried to add an existing student!')

        res.status(403).send('Student already exists')
    }
})

rollbar.log('Server started')

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server running on ${port}`));