const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { sql, poolPromise} = require('./db');
const { pool } = require('mssql');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('test');
});

app.post('/clocking', async (req, res) => {
    try{
        const { staffNumber, firstName, lastName, workingLocation } = req.body;
        const pool = await poolPromise
        await pool.request()
            .input('staffNumber', sql.Int, staffNumber)
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('workingLocation', sql.NVarChar, workingLocation)
            .query("INSERT INTO clocking (staffNumber, firstName, lastName, workingLocation) VALUES (@staffNumber,@firstName,@lastName,@workingLocation)")
     
        res.status(200).send({ message: 'Clocking record inserted'})
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Database Error'})
    }
})

app.post('/update', async (req,res) => {
    const { clockingId, staffNumber, firstName, lastName, workingLocation, clockingTime } = req.body
    const formattedClockingTime = new Date(clockingTime).toISOString().slice(0,19).replace('T', ' ')

    try{
        const pool = await poolPromise
        const result = await pool.request()
            .input('firstName', sql.NVarChar, firstName)
            .input('lastName', sql.NVarChar, lastName)
            .input('workingLocation', sql.NVarChar, workingLocation)
            .input('staffNumber', sql.Int, staffNumber)
            .input('clockingTime', sql.DateTime, formattedClockingTime)
            .input('clockingId', sql.Int, clockingId)
            .query('UPDATE clocking SET firstName = @firstName, lastName = @lastName, workingLocation = @workingLocation, staffNumber = @staffNumber, clockingTime = @clockingTime WHERE clockingId = @clockingId')

        res.status(200).send(result)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Database Error'})
    }
    
 })


app.post('/delete', async (req, res) => {
    const { clockingId } = req.body

    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('clockingId', sql.Int, clockingId)
            .query('DELETE FROm clocking WHERE clockingId = @clockingId')

        res.status(200).send(result)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Database Error'})
    } 
})


app.get('/clockings', async (req,res) => {
   try{
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM clocking')
    res.json(result.recordset)
   } catch (err) {
    console.log(err)
    res.status(500).send({ error: 'Database Error'})
   }
})

app.get('/edit/:id', async (req, res) => {
    const clockingId = req.params.id;

    try{
        const pool = await poolPromise
        const result = await pool.request()
            .input('clockingId', sql.Int, clockingId)
            .query('SELECT * FROM clocking WHERE clockingId = @clockingId')

        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Database Error' })
    }
    
})

app.get('/locations', async (req,res) => {
    console.log("test");
    try {
        const pool = await poolPromise
        const result = await pool.request().query('SELECT l.locationId, l.Name, l.fireWardensNeeded, COUNT(c.clockingId) AS clockingCount From locations l LEFT JOIN clocking c ON LTRIM(RTRIM(LOWER(c.workingLocation))) = LTRIM(RTRIM(LOWER(l.Name))) GROUP BY l.locationId, l.Name, l.fireWardensNeeded')
        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).send({ error: 'Database Error' })
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
