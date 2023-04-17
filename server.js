const express = require('express')
const inquirer = require('inquirer')
const mysql = require('mysql2')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const db = mysql.CreateConnection(
    {
        host: 'localhost',
        username: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD,
        database:'employee_db'
    }

)

app.listen(PORT, ()=>{
    console.log(`Server started and listening on: http://localhost: + ${PORT}`);
})