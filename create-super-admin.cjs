const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const checkResult = await pool.query('SELECT id FROM admin_users WHERE role = $1', ['superadmin']);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Super admin already exists with ID:', checkResult.rows[0].id);
      return;
    }
    
    // Create super admin
    const passwordHash = await bcrypt.hash('superadmin', 10);
    const result = await pool.query(
      'INSERT INTO admin_users (username, email, password_hash, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, username, email, role',
      ['superadmin', 'superadmin@holacupid.com', passwordHash, 'superadmin', true]
    );
    
    console.log('🚀 Super admin created successfully:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await pool.end();
  }
}

createSuperAdmin();