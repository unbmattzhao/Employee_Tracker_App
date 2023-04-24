const inquirer = require('inquirer')


// View department
const table = require('console.table')
// Function to view all departments
const viewDep = (connection, promptUser) => {
    connection.query(`SELECT id AS 'Department Id',
            name AS 'Department Name'
            FROM departments`,
        (err, results) => {
            console.table(results)
            promptUser()
        })
}

// add department
const addDep = (connection, promptUser) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "newDepartment",
          message: "Enter the name of the new department:",
          validate: (input) => {
            if (input) {
              return true;
            } else {
              console.log("Please enter a valid department name.");
              return false;
            }
          },
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: answer.newDepartment,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `The department '${answer.newDepartment}' has been added successfully.`
            );
            promptUser();
          }
        );
      });
  };
  


// delete department
const delDpt = (connection, promptUser) => {
    // Select department to delete
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;

        // prompt user to select a department
        inquirer.prompt([
            {
                type: 'list',
                name: 'dpt',
                message: 'Select a department to delete:',
                choices: res.map(department => department.name)
            }
        ]).then((answer) => {
            // Delete department from departments table
            connection.query('DELETE FROM departments WHERE name = ?', answer.dpt, (err, res) => {
                if (err) throw err;
                console.log(`\n${answer.dpt} has been deleted successfully.\n`);

                // return to main menu
                promptUser();
            });
        });
    });
};


//  View the total utilized budget of a department
const addTotalByDep = (connection, promptUser) => {
    // Retrieve all departments from the database
    const sql = `SELECT * FROM departments`;

    connection.query(sql, (err, res) => {
        if (err) throw err;

        // Create an array of department names for the user to choose from
        const departments = res.map((department) => {
            return department.name;
        });

        // Prompt the user to select a department
        inquirer.prompt({
            type: 'list',
            name: 'department',
            message: 'Which department would you like to view the total utilized budget for?',
            choices: departments
        }).then((choice) => {
            // Retrieve the department's ID
            const departmentId = res.find((department) => department.name === choice.department).id;

            // Retrieve the sum of all salaries for employees in the selected department
            const sql = `SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?`;

            connection.query(sql, departmentId, (err, res) => {
                if (err) throw err;

                // Log the result to the console
                console.log(`The total utilized budget of the '${choice.department}' department is '${res[0].total_budget}'`);

                // Return the user to the main menu
                promptUser();
            });
        });
    });
};

module.exports = { viewDep, addDep, delDpt, addTotalByDep }