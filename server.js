const express = require('express')
const sequelize = require('./config/connection')
const inquirer = require('inquirer')
const mysql = require('mysql2')
const table = require('console.table')


const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res)=>(
    res.send('This is home page')
))

// sequelize.sync({ force: true }).then(() => {
//     app.listen(PORT, () => console.log(`Server started and listening on: http://localhost: + ${PORT}`));
//   });
  
app.listen(PORT, ()=>{
    console.log(`Server started and listening on: http://localhost:${PORT}`);
})