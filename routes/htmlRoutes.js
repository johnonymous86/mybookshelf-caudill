const router = require('express').Router();
const auth = require('../utils/auth');
const { Book } = require('../models/Book'); 




router.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
     res.locals.error = req.query.error;
    next();
});

//get user//
router.get('/', async (req, res) => {
    if (req.session.isLoggedIn) {
        try {
            const bookshelfData = await Book.fetchUserBookshelf(req.session.userId);
            
            res.render('bookshelf', {
                pageTitle: 'My Bookshelf',
                readBooks: bookshelfData.read,
                wantToReadBooks: bookshelfData.wantToRead,
                username: req.session.username,
            });
        } catch (err) {
            console.error('Error loading bookshelf:', err);
            res.render('index', { errorMessage: 'Could not load bookshelf data.' });
        }
    } else {
        res.render('index');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/protected', auth, (req, res) => {
    res.render('protected');
});

module.exports = router;