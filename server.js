const mysql = require('mysql2')
const inquirer = require('inquirer'); 
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'satwinder',
      // Your MySQL password
      password: 'sunny',
      database: 'employee_db'
    },
    console.log('Connected to the election database.')
  );
// Main prompt starts here
  const promptUser = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all departments', 
                  'View all roles', 
                  'View all employees', 
                  'Add a department', 
                  'Add a role', 
                  'Add an employee', 
                  'Update an employee role',
                  'Update an employee manager',
                  "View employees by manager",
                  "View employees by department",
                  'Delete a department',
                  'Delete a role',
                  'Delete an employee',
                  'View department budgets',
                  'No Action']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          departments();
        }
  
        if (choices === "View all roles") {
          roles();
        }
  
        if (choices === "View all employees") {
          employees();
        }
  
        if (choices === "Add a department") {
          addDepartment();
        }
  
        if (choices === "Add a role") {
          addRole();
        }
  
        if (choices === "Add an employee") {
          addEmployee();
        }
  
        if (choices === "Update an employee role") {
          updateEmployee();
        }
  
        if (choices === "Update an employee manager") {
          updateManager();
        }
        if (choices === "View employees by manager") {
          employeeManager();
        }
  
        if (choices === "View employees by department") {
          employeeDepartment();
        }
  
        if (choices === "Delete a department") {
          deleteDepartment();
        }
  
        if (choices === "Delete a role") {
          deleteRole();
        }
  
        if (choices === "Delete an employee") {
          deleteEmployee();
        }
  
        if (choices === "View department budgets") {
          budget();
        }
  
        if (choices === "No Action") {
          console.log("You selected to quit Bye")
          db.end()
      };
    });
  };
  promptUser();

  // function to view all departments 
  departments = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
     db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };

// function to show all roles 
 roles = () => {
const sql = `SELECT role.id, role.title,role.salary, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
     db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  })
};
// function to show all employees
employees = () => {
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      promptUser();
    });
  };

  // function to add a department 
addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDepartment',
        message: "What is the name of the department?",
        validate: addDepartment => {
          if (addDepartment) {
              return true;
          } else {
              console.log('Please enter a department name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        db.query(sql, answer.addDepartment, (err, result) => {
          if (err) throw err;
          console.log('Added '+answer.addDepartment+'  to the database'); 
  
          departments();
      });
    });
  };


  // function to add role to the database
addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What is the name of the role",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role name');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (addSalary) {
              return true;
          } else {
              console.log('Please enter a salary amount');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const roleData = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`; 
         db.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "Which department is this role belong to",
            choices: dept
          }
          ])
            .then(SelectedDepart => {
              const dept = SelectedDepart.dept;
              roleData.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              db.query(sql, roleData, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to the database"); 
  
                roles();
         });
       });
     });
   });
  };

// function to add an employee 
addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "Enter the employee's first name?",
        validate: firstNm => {
          if (firstNm) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name?",
        validate: lastnm => {
          if (lastnm) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const empData = [answer.fistName, answer.lastName]
      const roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (err, data) => {
        if (err) throw err; 
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "Please select the employers role in the company",
                choices: roles
              }
            ])
              .then(roleList => {
                const role = roleList.role;
                empData.push(role);
                const managerSql = `SELECT * FROM employee WHERE manager_id IS NULL`;
                db.query(managerSql, (err, data) => {
                  if (err) throw err;
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(selectedManager => {
                      const manager = selectedManager.manager;
                      empData.push(manager);
                      const sql = `INSERT INTO employee 
                      (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
                      db.query(sql, empData, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added to the database")
                      employees();
                });
              });
            });
          });
       });
    });
  };

// function to update an employee 
updateEmployee = () => {
    const empSql = `SELECT * FROM employee`;
  
    db.query(empSql, (err, data) => {
      if (err) throw err; 
      const employeeLi = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employeeLi
        }
      ])
        .then(selectedEmp => {
          const employee = selectedEmp.name;
          const empData = []; 
          empData.push(employee);
          const roleSql = `SELECT * FROM role`;
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(selectedRole => {
                  const role = selectedRole.role;
                  empData.push(role); 
                  let employee = empData[0]
                  empData[0] = role
                  empData[1] = employee 
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                  db.query(sql, empData, (err, result) => {
                    if (err) throw err;
                  console.log("Employee has been updated to the database");
                  employees();
            });
          });
        });
      });
    });
  };

  // function to update an employee 
updateManager = () => {
  const employeeSql = `SELECT * FROM employee WHERE manager_id IS NOT NULL`;
  db.query(employeeSql, (err, data) => {
  if (err) throw err; 
  const employeeLi = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employeeLi
      }
    ])
      .then(selectedEmp => {
        const employee = selectedEmp.name;
        const empData = []; 
        empData.push(employee);
        const managerSql = `SELECT * FROM employee where manager_id IS NULL`;
        db.query(managerSql, (err, data) => {
            if (err) throw err; 
        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
       inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Please select the new manager",
                  choices: managers
                }
              ])
                  .then(selectedManger => {
                    const manager = selectedManger.manager;
                    empData.push(manager); 
                    let employee = empData[0]
                    empData[0] = manager
                    empData[1] = employee 
                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                    db.query(sql, empData, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated to the database");
                    employees();
          });
        });
      });
    });
  });
};
// function to view employee by manager name
employeeManager = () => {
  const sql = `SELECT first_name,id FROM employee WHERE manager_id IS NULL`;
    db.query(sql, (err, data) => {
    if (err) throw err; 
    const managerLi = data.map(({first_name,id}) => ({ name: first_name,value:id }));
    console.log(managerLi);
    inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message: "Please select the manager to view employees",
        choices: managerLi
      }
    ])
        .then(selectedManger => {
          const manager = selectedManger.manager;
          const sql = `SELECT * from employee WHERE manager_id = ? `;
          db.query(sql, manager, (err, result) => {
            if (err) throw err;
          console.table(result);
          promptUser();
}); 
});

  });          
};
// function to view employee by department name
employeeDepartment = () => {
  const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  });          
};

// function to delete department
deleteDepartment = () => {
  const deptSql = `SELECT * FROM department`; 

  db.query(deptSql, (err, data) => {
    if (err) throw err; 
    const dept = data.map(({ name, id }) => ({ name: name, value: id }));
    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "Which department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        db.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Department has successfully deleted from database"); 

        departments();
      });
    });
  });
};
// function to delete role
deleteRole = () => {
  const roleSql = `SELECT * FROM role`; 
  db.query(roleSql, (err, data) => {
    if (err) throw err; 
    const role = data.map(({ title, id }) => ({ name: title, value: id }));
    inquirer.prompt([
      {
        type: 'list', 
        name: 'role',
        message: "Which role do you want to delete?",
        choices: role
      }
    ])
      .then(selectedRole => {
        const role = selectedRole.role;
        const sql = `DELETE FROM role WHERE id = ?`;
        db.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Role has been deleted from database"); 
          roles();
      });
    });
  });
};
// function to delete employees
deleteEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;
  db.query(employeeSql, (err, data) => {
    if (err) throw err; 
  const employeeLi = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to delete?",
        choices: employeeLi
      }
    ])
      .then(selectedEmp => {
        const employee = selectedEmp.name;
        const sql = `DELETE FROM employee WHERE id = ?`;
        db.query(sql, employee, (err, result) => {
        if (err) throw err;
        console.log("employee has been successfully deleted");
         employees();
    });
  });
 });
};
// view department budget 
budget = () => {
  const sql = `SELECT department_id AS id, 
                      department.name AS department,
                      SUM(salary) AS budget
               FROM  role  
               JOIN department ON role.department_id = department.id GROUP BY  department_id`;
  
  db.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    promptUser(); 
  });            
};
  