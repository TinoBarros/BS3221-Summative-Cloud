require('dotenv').config();
const sql = require('mssql')

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    requestTimeout: 30000,
    options: {
        encrypt: true,
        trustServerCertificate: false
        
    }
    

}


const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
    console.log('Connected to Azure SQL')
    return pool
})
.catch(err => {
    console.error('Database connection failed:', err)
    process.exit(1)
})

module.exports = { sql, poolPromise }
