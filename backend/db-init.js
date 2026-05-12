
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log('Successfully connected to MySQL server.');
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} checked/created.`);
    
    await connection.changeUser({ database: process.env.DB_NAME });
    
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon but be careful with ENUMs or multi-line statements
    // Simple split for now, might need better parsing if complex
    const queries = schema.split(';').filter(q => q.trim().length > 0);
    
    for (let query of queries) {
      await connection.query(query);
    }
    console.log('Schema applied successfully.');
    
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testConnection();
