INSERT INTO department (name)
VALUES 
('Software Engineering'),
('Food Industory'),
('Sales & Marketing'),
('Construction');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 70000, 1),
('Software Engineer', 50000, 1),
('Cook', 40000, 2), 
('Manager', 130000, 2),
('Contractor', 80000, 3), 
('Shift Manager', 90000, 3),
('Designer', 120000, 4),
('Civil engineer', 140000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Satwinder', 'Singh', 1, 1),
('Jagroop', 'Singh', 2, null),
('Sheenu', 'Sharan', 4, null),
('Shiv', 'singh', 6, null),
('George', 'George', 3, 3),
('Ruman', 'Rumen', 5, 5),
('Harry', 'Harry', 7, null),
('Stella', 'Stella', 8, 7);