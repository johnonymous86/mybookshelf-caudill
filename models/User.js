const db = require('../config/connection');
const bcrypt = require('bcrypt');




 class User {
 
  static async create(username, password) {
    try {
      console.log(`[MODEL] Creating new user: ${username}`);
      
     
      const [existing] = await db.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );

      if (existing.length > 0) {
        throw new Error("Username already taken.");
      }

      // Hash password
       const password_hash = await bcrypt.hash(password, 10);

     
      const [result] = await db.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, password_hash]
      );

      return { id: result.insertId, username };
    } catch (error) {
      console.error('[MODEL] Error creating user:', error);
      throw error;
    }
  }


  static async findByUsernameAndPassword(username, password) {
    try {
      console.log(`[MODEL] Login attempt for: ${username}`);
      const [users] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        console.log('[MODEL] User not found');
        return null;
      }

      const user = users[0];
      console.log('[MODEL] Validating password with bcrypt...');
      const isValid = await bcrypt.compare(password, user.password_hash);

      if (!isValid) {
         console.log('[MODEL] Invalid password - bcrypt validation failed');
        return null;
      }

      console.log('[MODEL] Login successful - password validated');
      return { id: user.id, username: user.username };
    } catch (error) {
      console.error('[MODEL] Error finding user:', error);
       throw error;
    }
  }

  

  static async findByUsername(username) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return null;
      }

      return users[0];
     } catch (error) {
      console.error('[MODEL] Error finding user:', error);
      throw error;
    }
  }
  static async checkPassword(password, password_hash) {
    try {
      return await bcrypt.compare(password, password_hash);
    } catch (error) {
      console.error('[MODEL] Error checking password:', error);
      throw error;
    }
  }
}

module.exports = { User };