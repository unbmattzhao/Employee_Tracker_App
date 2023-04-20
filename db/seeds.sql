INSERT INTO departments (name) 
VALUES ('Sales'),
       ('Human resources'),
       ('Marketing'),
       ('Information Technology'),
       ('Accounting and Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Manager', 10000, 1),
    ('Sales Representative', 8000, 1),
    ('HR Manager', 9000, 2),
    ('HR Specialist', 7000, 2),
    ('Marketing Manager', 7500, 3),
    ('Marketing Specialist', 9000, 3),
    ('IT Manager', 11000, 4),
    ('IT Engineer', 8500, 4),
    ('Financial Specialist', 7000, 5),
    ('Financial Manager', 9000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('James', 'SMITH', 1, null),
    ('Mary', 'JOHNSON', 2, 1),
    ('Joseph', 'ANDERSON', 3, null),
    ('Susan', 'WILSON', 4, 3),
    ('Jessica', 'THOMAS', 5, null),
    ('John', 'JONES', 6, 5),
    ('Thomas', 'TAYLOR', 7, null),
    ('Jennifer', 'GARCIA',8, 7),
    ('Michael', 'MILLER', 9, null),
    ('Linda', 'DAVIS', 10, 9);
    -- ('David', 'RODRIGUEZ', 1, null),
    -- ('Patricia', 'BROWN', 2, 4),
    -- ('Elizabeth', 'MARTINEZ', 8, null),
    -- ('Robert', 'WILLIAMS', 8, 1),
    -- ('William', 'HERNANDEZ', 9, 17),
    -- ('Barbara', 'LOPEZ', 9, 17),
    -- ('Richard', 'GONZALEZ', 10, null);
