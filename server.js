const inquirer = require('inquirer')
const mysql = require('mysql2')
const table = require('console.table')
const { viewEmp, viewEmpByDep, viewEmpByManager, addEmp, upEmpByRole, upEmpByManager, delEmp } = require('./lib/employees');
const { viewDep, addDep, delDpt, addTotalByDep } = require('./lib/dept_methods');  
const { viewRoles, addRole, delRole } = require('./lib/roles_methods');  
require('dotenv').config();


// connect to database
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.MY_SQL_PASSWORD,
        database: 'employee_db'
    },
    console.log(`'employee_db' database is now connected`)
)

connection.connect((err) => {
    if (err) throw err;
});

// Initial Prompt - Main Menu
const promptUser = () => {
        // Prompt the user options
        inquirer.prompt({
            type: 'list',
            name: 'begin choices',
            message: 'Select what you would like to do',
            choices: 
            ['View All Departments', 
             'View All Roles', 
             'View All Employees', 
             'Add a Department', 
             'Add a Role', 
             'Add an Employee',
             'View employees by manager',
             'View employees by department',
             'Update employees by role',
             'Update employees by manager',
             'Delete departments',       
             'Delete roles',       
             'Delete employees',       
             'View the total utilized budget of a department',
             'Exit'                    
            ]
        })
        // Take the data and use switch statements to decide what to do per option
        .then((choice) => {
            switch (choice['begin choices']) {
                case 'View All Departments':
                    viewDep(connection, promptUser);  
                    break;
                case 'View All Roles':
                    viewRoles(connection, promptUser);  
                    break;
                case 'View All Employees':
                    viewEmp(connection, promptUser); 
                    break;
                case 'Add a Department':
                    addDep(connection, promptUser); 
                    break;
                case 'Add a Role':
                    addRole(connection, promptUser); 
                    break;
                case 'Add an Employee':
                    addEmp(connection, promptUser);
                    break;
                case 'View employees by manager':
                    viewEmpByManager(connection, promptUser);
                    break;
                case 'View employees by department':
                    viewEmpByDep(connection, promptUser);
                    break;
                case 'Update employees by role':
                    upEmpByRole(connection, promptUser);
                    break;
                case 'Update employees by manager':
                    upEmpByManager(connection, promptUser);
                    break;
                case 'Delete departments':
                    delDpt(connection, promptUser); 
                    break;
                case 'Delete roles':
                    delRole(connection, promptUser); 
                    break;            
                case 'Delete employees':
                    delEmp(connection, promptUser);
                    break;              
                case 'View the total utilized budget of a department':
                    addTotalByDep(connection, promptUser); 
                    break;
                case 'Exit':
                    connection.end();
                    process.exit();
            }
        }).catch((err) => {
            console.log(err);
        })
};

promptUser()