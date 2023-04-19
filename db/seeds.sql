INSERT INTO departments (name) 
VALUES
    ('Sales')
    ('Human resources'),
    ('Marketing'),
    ('Information Technology'),
    ('Accounting and Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Representative', 8000.00, 1),
    ('Sales Manager', 10000.00, 1),
    ('HR Specialist' 7000.00, 2),
    ('HR Manager', 9000.00, 2),
    ('Marketing Specialist', 9000.00, 3),
    ('Marketing Manager', 7500.00, 3),
    ('IT Engineer', 8500.00, 4),
    ('IT Manager', 11000.00, 4),
    ('Financial Specialist', 7000.00, 5),
    ('Financial Manager', 9000.00, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('James', 'SMITH', 1, 6,),
    ('Mary', 'JOHNSON', 1, 6,),
    ('Robert', 'WILLIAMS', 1, 6,),
    ('Susan', 'WILSON', 1, 6,),
    ('Joseph', 'ANDERSON', 1, 6,),
    ('Patricia', 'BROWN', 2, null,),
    ('John', 'JONES', 3, 8,),
    ('Jessica', 'THOMAS', 4, null,),
    ('Thomas', 'TAYLOR', 5, 11,),
    ('Jennifer', 'GARCIA',5, 11,),
    ('Michael', 'MILLER', 6, null,),
    ('Linda', 'DAVIS', 7, 14,),
    ('David', 'RODRIGUEZ', 7, 14,),
    ('Elizabeth', 'MARTINEZ', 8, null,),
    ('William', 'HERNANDEZ', 9, 17,),
    ('Barbara', 'LOPEZ', 9, 17,),
    ('Richard', 'GONZALEZ', 10, null,);
