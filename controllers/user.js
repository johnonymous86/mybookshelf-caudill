const { User } = require("../models/User");

async function create(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/signup?error=must include username and password");

    const user = await User.create(username, password);

    if (!user) return res.redirect("/signup?error=error creating new user");

    req.session.isLoggedIn = true;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
    return res.redirect(`/signup?error=${err.message}`);
  }
}

module.exports = { create };



//** 
// 
// 
// 
// if (username === correctUsername && password === correctPassword) {
//        // 'then' part: Authentication successful
//        console.log("SUCCESS: Authentication approved.");
//        return true;
//    } else {
//        // 'else' part: Authentication failed
//        console.error("FAILURE: Invalid username or password.");
//        return false;
//    }
//}

