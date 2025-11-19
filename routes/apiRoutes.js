const router = require('express').Router();
const userController = require('../controllers/user');
const { User } = require('../models/User');


router.post('/signup', userController.create);


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
     
        const user = await User.findByUsernameAndPassword(username, password); 

        if (!user) {
            return res.redirect('/login?error=Invalid username or password');
        }
        req.session.isLoggedIn = true;
        req.session.userId = user.id; 
        req.session.username = user.username; 
        //NOT WORKING?

        req.session.save(() => res.redirect('/'));

    } catch (err) {
        console.error(err);
        res.redirect(`/login?error=${err.message}`);
    }
});


router.get('/logout', (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;