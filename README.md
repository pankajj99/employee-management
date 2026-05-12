# EmpTrack — Employee Management System

> **Assignment**: Employee Management System using **Angular 19** + **Node.js/Express** + **MySQL**

---

## 📁 Project Structure

```
employee-management/
├── backend/          # Node.js + Express REST API  (Port: 3000)
├── frontend/         # Angular 19 Application      (Port: 4200)
├── database/
│   └── schema.sql    # MySQL schema + 10 seed records
└── README.md
```

---

## ✅ Features Implemented

| Feature              | Details                                        |
|----------------------|------------------------------------------------|
| **Add Employee**     | Reactive form with full validation             |
| **View Employees**   | Material table with avatar, status badges      |
| **Update Employee**  | Pre-populated edit form                        |
| **Delete Employee**  | Confirm dialog before deletion                 |
| **Search Employees** | Real-time search across name/email/dept/role   |

---

## 🚀 Setup Instructions

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Angular CLI](https://angular.dev/) v19: `npm install -g @angular/cli@19`
- [MySQL](https://dev.mysql.com/downloads/) Server (running locally on port 3306)

---

### Step 1 — Set Up the Database

1. Open **MySQL Workbench** or your MySQL CLI
2. Run the schema script:

```sql
-- In MySQL CLI:
source path/to/employee-management/database/schema.sql

-- OR in MySQL Workbench:
-- File → Open SQL Script → Select schema.sql → Run All
```

This creates:
- Database: `employee_db`
- Table: `employees` with all required columns
- 10 sample employee records

---

### Step 2 — Configure & Start the Backend

```bash
cd employee-management/backend
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD   # ← Update this
DB_NAME=employee_db
PORT=3000
```

Install dependencies and start the server:

```bash
npm install
npm run dev      # Development (with auto-reload)
# OR
npm start        # Production
```

✅ Backend will be available at: `http://localhost:3000`

---

### Step 3 — Start the Angular Frontend

```bash
cd employee-management/frontend
npm install      # Only needed on first run
ng serve         # OR: npx ng serve
```

✅ Frontend will be available at: `http://localhost:4200`

---

## 🔌 API Endpoints

| Method   | Endpoint                | Description              |
|----------|-------------------------|--------------------------|
| `GET`    | `/api/employees`        | Get all employees        |
| `GET`    | `/api/employees?search=` | Search employees        |
| `GET`    | `/api/employees/:id`    | Get single employee      |
| `POST`   | `/api/employees`        | Create new employee      |
| `PUT`    | `/api/employees/:id`    | Update employee          |
| `DELETE` | `/api/employees/:id`    | Delete employee          |
| `GET`    | `/api/health`           | API health check         |

### Example Request — Create Employee

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "phone": "9876543200",
    "department": "Engineering",
    "position": "Full Stack Developer",
    "salary": 80000,
    "hire_date": "2024-01-15",
    "status": "Active"
  }'
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE employees (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    phone       VARCHAR(20),
    department  VARCHAR(100) NOT NULL,
    position    VARCHAR(150) NOT NULL,
    salary      DECIMAL(12, 2) DEFAULT 0.00,
    hire_date   DATE NOT NULL,
    status      ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🏗️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | Angular 19 (Standalone)       |
| UI Library | Angular Material 19           |
| Backend    | Node.js + Express             |
| Database   | MySQL 8+                      |
| ORM        | mysql2 (Promise Pool)         |
| HTTP       | Angular HttpClient            |
| Forms      | Angular Reactive Forms        |
| Styling    | CSS + Angular Material        |

---

## 📋 Assignment Checklist

- [x] Angular Project Folder (`frontend/`)
- [x] Backend Folder (`backend/`)
- [x] MySQL Database Script (`database/schema.sql`)
- [x] README File with setup steps (this file)
- [x] Add, View, Update, Delete, Search employees
- [x] Angular fundamentals (standalone components, lazy loading)
- [x] API integration (HttpClient service)
- [x] MySQL basics (normalized schema, seed data)
- [x] CRUD operations (full REST API)
- [x] Form handling (reactive forms, validation)
- [x] Component understanding (modular architecture)

---

## 🔧 Troubleshooting

**Backend won't connect to MySQL?**
- Verify MySQL is running: `mysqladmin -u root -p status`
- Check `.env` credentials are correct
- Ensure `employee_db` database exists (run `schema.sql` first)

**CORS error in Angular?**
- Confirm backend is running on port 3000
- Check `src/app/services/employee.service.ts` API URL matches

**Angular CLI not found?**
```bash
npm install -g @angular/cli@19
```
