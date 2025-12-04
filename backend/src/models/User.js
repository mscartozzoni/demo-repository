const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create({ username, email, password, role = 'patient' }) {
    const validRoles = ['patient', 'secretary', 'doctor', 'admin'];
    
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, email, password_hash, role, status, created_at)
      VALUES (?, ?, ?, ?, 'active', NOW())
    `;

    const result = await query(sql, [username, email, password_hash, role]);
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const results = await query(sql, [email]);
    return results[0] || null;
  }

  // Find user by username
  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
    const results = await query(sql, [username]);
    return results[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update last login
  static async updateLastLogin(userId) {
    const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    await query(sql, [userId]);
  }

  // Get all users (admin only)
  static async findAll() {
    const sql = 'SELECT id, username, email, role, status, created_at, last_login FROM users';
    return await query(sql);
  }

  // Update user role
  static async updateRole(userId, newRole) {
    const validRoles = ['patient', 'secretary', 'doctor', 'admin'];
    
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }

    const sql = 'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [newRole, userId]);
  }

  // Update user status
  static async updateStatus(userId, status) {
    const validStatuses = ['active', 'inactive', 'suspended'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const sql = 'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [status, userId]);
  }

  // Delete user (soft delete by setting status)
  static async delete(userId) {
    const sql = 'UPDATE users SET status = "inactive", updated_at = NOW() WHERE id = ?';
    await query(sql, [userId]);
  }
}

module.exports = User;
