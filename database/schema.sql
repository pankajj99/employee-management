-- ==========================================================
-- Employee Management System - MySQL Database Script
-- ==========================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employee_db;

-- Drop table if exists (for re-runs)
DROP TABLE IF EXISTS employees;

-- ==========================================================
-- Employees Table
-- ==========================================================
CREATE TABLE employees (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100)   NOT NULL,
    last_name   VARCHAR(100)   NOT NULL,
    email       VARCHAR(150)   NOT NULL UNIQUE,
    phone       VARCHAR(20),
    department  VARCHAR(100)   NOT NULL,
    position    VARCHAR(150)   NOT NULL,
    salary      DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    hire_date   DATE           NOT NULL,
    status      ENUM('Active', 'Inactive', 'On Leave') NOT NULL DEFAULT 'Active',
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================================
-- Seed Data — 10 Sample Employees
-- ==========================================================
INSERT INTO employees (first_name, last_name, email, phone, department, position, salary, hire_date, status) VALUES
('Aarav',    'Sharma',    'aarav.sharma@company.com',    '9876543210', 'Engineering',  'Senior Software Engineer',   95000.00, '2021-03-15', 'Active'),
('Priya',    'Patel',     'priya.patel@company.com',     '9876543211', 'Engineering',  'Frontend Developer',         72000.00, '2022-06-01', 'Active'),
('Rohan',    'Mehta',     'rohan.mehta@company.com',     '9876543212', 'Product',      'Product Manager',            88000.00, '2020-11-20', 'Active'),
('Sneha',    'Gupta',     'sneha.gupta@company.com',     '9876543213', 'Design',       'UX Designer',                67000.00, '2023-01-10', 'Active'),
('Vikram',   'Singh',     'vikram.singh@company.com',    '9876543214', 'Engineering',  'Backend Developer',          80000.00, '2021-08-05', 'On Leave'),
('Ananya',   'Reddy',     'ananya.reddy@company.com',    '9876543215', 'Marketing',    'Marketing Manager',          75000.00, '2019-04-22', 'Active'),
('Karthik',  'Nair',      'karthik.nair@company.com',    '9876543216', 'Finance',      'Financial Analyst',          70000.00, '2022-09-14', 'Active'),
('Divya',    'Krishnan',  'divya.krishnan@company.com',  '9876543217', 'HR',           'HR Business Partner',        65000.00, '2020-07-30', 'Active'),
('Arjun',    'Verma',     'arjun.verma@company.com',     '9876543218', 'Engineering',  'DevOps Engineer',            85000.00, '2021-12-01', 'Active'),
('Meera',    'Iyer',      'meera.iyer@company.com',      '9876543219', 'Operations',   'Operations Analyst',         60000.00, '2023-03-18', 'Inactive');

-- Verify
SELECT 'Database and table created successfully!' AS message;
SELECT COUNT(*) AS total_employees FROM employees;
