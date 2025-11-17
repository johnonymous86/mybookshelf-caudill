const router = require('express').Router();
const userController = require('../controllers/user');
const { User } = require('../models/User'); // Import mock User model

// POST route for creating a new user (signup)
router.post('/signup', userController.create);

// POST route for logging in
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // In production, this call would compare the password hash
        const user = await User.findByUsernameAndPassword(username, password); 

        if (!user) {
            return res.redirect('/login?error=Invalid username or password');
        }

        // --- Store user information in the session ---
        req.session.isLoggedIn = true;
        req.session.userId = user.id; // Store the ID for fetching bookshelf data
        req.session.username = user.username; // Store username for display
        // ------------------------------------------

        req.session.save(() => res.redirect('/'));

    } catch (err) {
        console.error(err);
        res.redirect(`/login?error=${err.message}`);
    }
});

// GET route for logging out
router.get('/logout', (req, res) => {
    if (req.session.isLoggedIn) {
        // Clear all session data on destroy
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;