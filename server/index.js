const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : 'SummativeTest123', //or TestSErver2, SummativeTest123
    database : 'fire_warden'
});

app.post('/clocking', (req, res) => {
    const staffNumber = req.body.staffNumber;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const workingLocation = req.body.workingLocation
    db.query("INSERT INTO clocking (staffNumber, firstName, lastName, workingLocation) VALUES (?,?,?,?)", [staffNumber, firstName, lastName, workingLocation], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send({name: firstName})
        }
    })
})

app.get('/clockings', (req,res) => {
    db.query('SELECT * FROM clocking', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Database Error' });
        } else {
            res.json(result);
        }
    })
})

app.get('/locations', (req,res) => {
    db.query('SELECT Name FROM locations', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Database Error' });
        } else {
            res.json(result);
        }
    })
})

app.listen(8080, () => {
    console.log('server listening on port 8080 -with db');
})