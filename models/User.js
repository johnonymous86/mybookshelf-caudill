
const MOCK_USER_ID = 42; 

class User {
 
  static async create(username, password) {
    console.log(`[MODEL] Simulating creation of new user: ${username}`);
    if (username.toLowerCase().includes('fail')) {
        throw new Error("Username already taken.");
    }
    return { id: MOCK_USER_ID, username };
  }
  static async findByUsernameAndPassword(username, password) {
    console.log(`[MODEL] Simulating login attempt for: ${username}`);
  
    if (username && password && !username.toLowerCase().includes('fail')) {
        return { id: 1, username }; 
    }
    return null; 
  }
}

module.exports = { User };