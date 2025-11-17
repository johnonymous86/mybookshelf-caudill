// --- MOCK USER MODEL (Placeholder) ---
// In a real application, these methods would query the 'users' table in MySQL.

// NOTE: We are using a mock user ID for successful creation/login
const MOCK_USER_ID = 42; 

class User {
  // Method required by controllers/user.js (signup)
  static async create(username, password) {
    console.log(`[MODEL] Simulating creation of new user: ${username}`);
    // Replace with: const [result] = await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
    // For now, we just return a mock object.
    if (username.toLowerCase().includes('fail')) {
        throw new Error("Username already taken.");
    }
    return { id: MOCK_USER_ID, username };
  }
  
  // Method required for the API login route
  static async findByUsernameAndPassword(username, password) {
    console.log(`[MODEL] Simulating login attempt for: ${username}`);
    // Replace with: const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    // Mock successful login if username is not 'fail'
    if (username && password && !username.toLowerCase().includes('fail')) {
        // We will mock the user ID as 1, which corresponds to 'testuser' in schema.sql
        return { id: 1, username }; 
    }
    return null; // Login failed
  }
}

module.exports = { User };