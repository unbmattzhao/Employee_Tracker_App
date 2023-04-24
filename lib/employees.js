// const { promptUser } = require('../server.js')
const inquirer = require('inquirer');


// View all employee

const viewEmp = (connection, promptUser) => {
    // Query to get employee data
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id;
    `;
  
    // Execute the query and display the employee data in the console
    connection.query(query, (err, res) => {
      if (err) throw err;
  
      console.table(res);
  
      // Call the promptUser function to return to the main menu
      promptUser();
    });
  };
    

// View Employees by Department

const viewEmpByDep = (connection, promptUser) => {
    // First, query the departments to let the user choose one
    connection.query('SELECT * FROM departments', (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select a department to view its employees:',
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          // Query to get employee data by department
          const query = `
            SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employees e
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d ON r.department_id = d.id
            LEFT JOIN employees m ON e.manager_id = m.id
            WHERE d.id = ?;
          `;
  
          // Execute the query and display the employee data in the console
          connection.query(query, [answer.departmentId], (err, res) => {
            if (err) throw err;
  
            console.table(res);
  
            // Call the promptUser function to return to the main menu
            promptUser();
          });
        });
    });
  };
  

//  View Employees by Manager
const viewEmpByManager = (connection, promptUser) => {
  // Query to select all distinct manager names from employees table
  const managerQuery = `SELECT DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
                        FROM employees e
                        INNER JOIN employees manager ON manager.id = e.manager_id`;

  // Query to select all employees with the specified manager
  const employeeQuery = `SELECT e.id, e.first_name, e.last_name, roles.title AS role, departments.name AS department
                         FROM employees e
                         INNER JOIN roles ON roles.id = e.role_id
                         INNER JOIN departments ON departments.id = roles.department_id
                         INNER JOIN employees manager ON manager.id = e.manager_id
                         WHERE CONCAT(manager.first_name, ' ', manager.last_name) = ?
                         ORDER BY e.id`;

  // Execute the manager query to get all distinct manager names
  connection.query(managerQuery, (err, res) => {
      if (err) throw err;

      // Extract the manager names from the result set
      const managers = res.map((row) => row.manager_name);

      // Use inquirer to prompt the user to select a manager from the list
      inquirer.prompt({
          type: 'list',
          name: 'manager',
          message: 'Select a manager to view their employees:',
          choices: managers
      }).then((answer) => {
          // Store the selected manager name in a variable
          const managerName = answer.manager;

          // Execute the employee query to retrieve all employees with the selected manager
          connection.query(employeeQuery, [managerName], (err, res) => {
              if (err) throw err;

              // If there are no employees with the specified manager, inform the user
              if (res.length === 0) {
                  console.log(`There are no employees managed by ${managerName}.`);
              } else {
                  // Otherwise, display the employee data in a table
                  console.table(res);
              }

              // Return to the main prompt
              promptUser();
          });
      }).catch((err) => {
          console.log(err);
      });
  });
};



// Add a new employee
const addEmp = (connection, promptUser) => {
    // Query to get all roles
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;
  
      // Map roles to choices for inquirer
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
  
      // Prompt user for employee's first name, last name, and role
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
            validate: (value) => (value ? true : "Please enter a first name."),
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
            validate: (value) => (value ? true : "Please enter a last name."),
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the employee's role:",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          // Get departmentId for the selected role
          const role = roles.find((role) => role.id === answers.roleId);
          const departmentId = role.department_id;
  
          // Check if the selected role is a manager role
          const isManager = role.title.toLowerCase().includes("manager");
  
          // If the employee is a manager, set their manager_id to null
          if (isManager) {
            connection.query(
              "INSERT INTO employees SET ?",
              {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: null,
              },
              (err, res) => {
                if (err) throw err;
                console.log(
                  `The employee '${answers.firstName} ${answers.lastName}' has been added successfully.`
                );
                promptUser();
              }
            );
          } else {
            // Query to get all managers in the same department as the new employee
            connection.query(
              "SELECT * FROM employees INNER JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = ? AND roles.title LIKE '%manager%'",
              [departmentId],
              (err, managers) => {
                if (err) throw err;
  
                // Map managers to choices for inquirer
                const managerChoices = managers.map((manager) => ({
                  name: `${manager.first_name} ${manager.last_name}`,
                  value: manager.id,
                }));
                managerChoices.push({ name: "none", value: null });
  
                // Prompt user to select a manager or choose "none"
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "managerId",
                      message: "Select the employee's manager:",
                      choices: managerChoices,
                    },
                  ])
                  .then((managerAnswer) => {
                    // Insert the new employee with the selected manager_id
                    connection.query(
                      "INSERT INTO employees SET ?",
                      {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: answers.roleId,
                        manager_id: managerAnswer.managerId,
                      },
                      (err, res) => {
                        if (err) throw err;
                        console.log(
                          `The employee '${answers.firstName} ${answers.lastName}' has been added successfully.`
                        );
                        promptUser();
                      }
                    );
                  });
              }
            );
          }
        });
    });
  };
   

// update an employee's role

const upEmpByRole = (connection, promptUser) => {
    // Get all employees from database to use for employee list prompt
    const employeesQuery = 'SELECT * FROM employees';
    connection.query(employeesQuery, (err, res) => {
      if (err) throw err;
  
      // Prompt user to select employee to update
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Which employee do you want to update?',
          choices: res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        // Prompt user to select new role for employee
        {
          type: 'list',
          name: 'role',
          message: 'What is the employee\'s new role?',
          choices: () => {
            return new Promise((resolve, reject) => {
              const rolesQuery = 'SELECT * FROM roles';
              connection.query(rolesQuery, (err, res) => {
                if (err) reject(err);
                resolve(res.map((role) => ({
                  name: role.title,
                  value: role.id,
                })));
              });
            });
          },
        },
      ]).then((answers) => {
        // Update the employee's role in the database
        const updateQuery = `UPDATE employees SET role_id = ${answers.role} WHERE id = ${answers.employee}`;
        connection.query(updateQuery, (err, res) => {
          if (err) throw err;
  
          // Get the department for the new role
          const departmentQuery = `SELECT departments.name FROM departments JOIN roles ON departments.id = roles.department_id WHERE roles.id = ${answers.role}`;
          connection.query(departmentQuery, (err, res) => {
            if (err) throw err;
  
            // Notify the user of the department change
            console.log(`Employee's department has been changed to ${res[0].name}.`);
            
            // Return to the main prompt
            promptUser();
          });
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  };



// Function to update an employee manager
const upEmpByManager = (connection, promptUser) => {
  // Prompt the user to select the employee they want to update
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee you want to update:',
      choices: () => {
        // Return a Promise that selects all employees who are not managers
        return new Promise((resolve, reject) => {
          const query = `SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employees WHERE role_id != 1`;
          connection.query(query, (err, res) => {
            if (err) reject(err);
            const choicesArray = res.map((employee) => {
              return {
                name: employee.employee_name,
                value: employee.id,
              };
            });
            resolve(choicesArray);
          });
        });
      },
    },
  ])
    .then((employeeChoice) => {
      // Once the user has selected the employee, prompt them to select the new manager for the employee
      inquirer.prompt([
        {
          type: 'list',
          name: 'new_manager_id',
          message: `Select the new manager for ${
            employeeChoice.employee_id
          }:`,
          choices: () => {
            // Return a Promise that selects all employees who are managers
            return new Promise((resolve, reject) => {
              const query = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees WHERE role_id = 1`;
              connection.query(query, (err, res) => {
                if (err) reject(err);
                const choicesArray = res.map((manager) => {
                  return {
                    name: manager.manager_name,
                    value: manager.id,
                  };
                });
                resolve(choicesArray);
              });
            });
          },
        },
      ])
        .then((managerChoice) => {
          // Once the user has selected the new manager, update the employee's manager_id in the employees table
          const query = `UPDATE employees SET manager_id = ? WHERE id = ?`;
          connection.query(
            query,
            [managerChoice.new_manager_id, employeeChoice.employee_id],
            (err, res) => {
              if (err) throw err;
              console.log('Employee manager has been updated!');
              // Prompt the user with the main menu options again
              promptUser();
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Delete an employee
const delEmp = (connection, promptUser) => {
  // Query to get all employees
  const queryEmp = `SELECT CONCAT_WS(" ", first_name, last_name) AS name, id FROM employees`;
  // Query to delete employee by id
  const queryDelEmp = `DELETE FROM employees WHERE id = ?`;

  // Get all employees
  connection.query(queryEmp, (err, results) => {
      if (err) throw err;
      // Map employee results to an array of employee names
      const employeeNames = results.map(emp => emp.name);

      // Prompt the user to select an employee to delete
      inquirer.prompt({
          type: 'list',
          name: 'employeeToDelete',
          message: 'Select an employee to delete',
          choices: employeeNames
      }).then((answer) => {
          // Get the ID of the employee to delete
          const employeeId = results.find(emp => emp.name === answer.employeeToDelete).id;
          // Delete the employee from the database
          connection.query(queryDelEmp, employeeId, (err, result) => {
              if (err) throw err;
              console.log(`\n${answer.employeeToDelete} has been deleted from the employee list.\n`);
              // Return to main menu
              promptUser();
          });
      });
  });
};





module.exports = { viewEmp, viewEmpByDep, viewEmpByManager, addEmp, upEmpByRole, upEmpByManager, delEmp};