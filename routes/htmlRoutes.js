const router = require('express').Router();
const auth = require('../utils/auth');
const { Book } = require('../models/Book'); // Import the Book Model

// Middleware to inject session state into all rendered templates
router.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    // Pass any error query parameters to the view
    res.locals.error = req.query.error;
    next();
});

// GET / - Home page / Bookshelf
router.get('/', async (req, res) => {
    if (req.session.isLoggedIn) {
        try {
            // *** Assume user ID 1 for testuser, this needs to be dynamically pulled from the session in production! ***
            const MOCK_USER_ID = 1; 
            const bookshelfData = await Book.fetchUserBookshelf(MOCK_USER_ID);
            
            res.render('bookshelf', {
                pageTitle: 'My Bookshelf',
                // Pass data required by bookshelf.handlebars
                readBooks: bookshelfData.read,
                wantToReadBooks: bookshelfData.wantToRead,
                // Mock username for header/display
                username: 'testuser', 
            });
        } catch (err) {
            console.error('Error loading bookshelf:', err);
            // Render index page or a simple error message
            res.render('index', { errorMessage: 'Could not load bookshelf data.' });
        }
    } else {
        // If not logged in, render the standard index page
        res.render('index');
    }
});

// GET /login - Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// GET /signup - Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// GET /protected - Protected example route (requires login)
router.get('/protected', auth, (req, res) => {
    res.render('protected');
});

// Set up API routes
router.use('/api', require('../api'));

module.exports = router;