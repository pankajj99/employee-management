const express  = require('express');
const router   = express.Router();
const db       = require('../config/db');

// ─── Helper: build response ───────────────────────────────────────────────────
const success = (res, data, status = 200) => res.status(status).json({ success: true, data });
const failure = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg });

// ─── GET /api/employees  (with optional ?search=) ────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query  = 'SELECT * FROM employees';
    let params = [];

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query +=
        ` WHERE first_name   LIKE ? OR last_name  LIKE ?
             OR email        LIKE ? OR department LIKE ?
             OR position     LIKE ? OR phone      LIKE ?`;
      params = [term, term, term, term, term, term];
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await db.query(query, params);
    success(res, rows);
  } catch (err) {
    console.error('GET /employees error:', err);
    failure(res, 'Failed to fetch employees');
  }
});

// ─── GET /api/employees/:id ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (!rows.length) return failure(res, 'Employee not found', 404);
    success(res, rows[0]);
  } catch (err) {
    console.error('GET /employees/:id error:', err);
    failure(res, 'Failed to fetch employee');
  }
});

// ─── POST /api/employees ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, email, phone,
      department, position, salary, hire_date, status
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !department || !position || !hire_date) {
      return failure(res, 'Missing required fields', 400);
    }

    const [result] = await db.query(
      `INSERT INTO employees
         (first_name, last_name, email, phone, department, position, salary, hire_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone || null,
       department, position, salary || 0, hire_date, status || 'Active']
    );

    const [newEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
    success(res, newEmployee[0], 201);
  } catch (err) {
    console.error('POST /employees error:', err);
    if (err.code === 'ER_DUP_ENTRY') return failure(res, 'Email already exists', 409);
    failure(res, 'Failed to create employee');
  }
});

// ─── PUT /api/employees/:id ───────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const {
      first_name, last_name, email, phone,
      department, position, salary, hire_date, status
    } = req.body;

    if (!first_name || !last_name || !email || !department || !position || !hire_date) {
      return failure(res, 'Missing required fields', 400);
    }

    const [check] = await db.query('SELECT id FROM employees WHERE id = ?', [req.params.id]);
    if (!check.length) return failure(res, 'Employee not found', 404);

    await db.query(
      `UPDATE employees SET
         first_name = ?, last_name = ?, email = ?, phone = ?,
         department = ?, position = ?, salary = ?, hire_date = ?, status = ?
       WHERE id = ?`,
      [first_name, last_name, email, phone || null,
       department, position, salary || 0, hire_date, status || 'Active',
       req.params.id]
    );

    const [updated] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    success(res, updated[0]);
  } catch (err) {
    console.error('PUT /employees/:id error:', err);
    if (err.code === 'ER_DUP_ENTRY') return failure(res, 'Email already exists', 409);
    failure(res, 'Failed to update employee');
  }
});

// ─── DELETE /api/employees/:id ────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const [check] = await db.query('SELECT id FROM employees WHERE id = ?', [req.params.id]);
    if (!check.length) return failure(res, 'Employee not found', 404);

    await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    success(res, { id: parseInt(req.params.id), deleted: true });
  } catch (err) {
    console.error('DELETE /employees/:id error:', err);
    failure(res, 'Failed to delete employee');
  }
});

module.exports = router;
