// const { promptUser } = require('../server.js');
const inquirer = require('inquirer');

// View all the roles
const viewRoles = (connection, promptUser) => {
    connection.query(
        `SELECT roles.id AS 'Role ID', roles.title, roles.salary, departments.name
            FROM roles
            LEFT JOIN departments
            ON roles.department_id = departments.id `,
        function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    );
};

// add role
const addRole = (connection, promptUser) => {
    connection.query("SELECT * FROM departments", (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: "input",
            name: "newRole",
            message: "Enter the name of the new role:",
            validate: (input) => {
              if (input) {
                return true;
              } else {
                console.log("Please enter a valid role name.");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "salary",
            message: "Enter the salary for the new role:",
            validate: (input) => {
              if (!isNaN(input) && input > 0) {
                return true;
              } else {
                console.log("Please enter a valid salary.");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "department_id",
            message: "Select the department for the new role:",
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: answer.newRole,
              salary: answer.salary,
              department_id: answer.department_id,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `The role '${answer.newRole}' has been added successfully.`
              );
              promptUser();
            }
          );
        });
    });
  };
  

// delete role
// Function to delete a role
const delRole = (connection, promptUser) => {
  // Query to get all roles
  const query = `SELECT id, title FROM roles`;

  // Query to delete a role
  const deleteQuery = `DELETE FROM roles WHERE id = ?`;

  // Get all roles from the database
  connection.query(query, (err, results) => {
      if (err) throw err;

      // Prompt the user to select a role to delete
      inquirer.prompt({
          type: 'list',
          name: 'roleToDelete',
          message: 'Select the role to delete:',
          choices: () => {
              // Map the results to a list of choices
              return results.map(role => `${role.title}`);
          }
      })
      .then((choice) => {
          // Find the role id based on the role name
          const roleId = results.find(role => role.title === choice.roleToDelete).id;

          // Delete the role from the database
          connection.query(deleteQuery, roleId, (err, results) => {
              if (err) throw err;

              // Log success message to the console
              console.log(`The role "${choice.roleToDelete}" has been deleted successfully.\n`);

              // Prompt the user again
              promptUser();
          });
      })
      .catch((err) => {
          console.log(err);
      });
  });
};

module.exports = { delRole };



module.exports = { viewRoles, addRole, delRole };