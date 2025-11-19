const router = require('express').Router();
const userController = require('../controllers/user');
const { User } = require('../models/User');
const { Book } = require('../models/Book');
const axios = require('axios');


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

//open lib
router.get('/search-books', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search query required' });
    }

    try {
        
        const response = await axios.get('https://openlibrary.org/search.json', {
            params: {
                q: q,
                limit: 5,
                fields: 'key,title,author_name,first_publish_year,edition_count,isbn,cover_i'
            }
        });
        const books = response.data.docs.map(book => ({
            ol_key: book.key,
            title: book.title,
             author_names: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
            first_publish_year: book.first_publish_year || null,
            edition: book.edition_count ? `${book.edition_count} edition(s)` : null,
            isbn: book.isbn ? book.isbn[0] : null,
            cover_id: book.cover_i ? book.cover_i.toString() : null
        }));

        res.json({ success: true, books });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Error searching for books' });
    }
});
router.post('/books', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { ol_key, title, author_names, first_publish_year, cover_id, status } = req.body;
    
    if (!ol_key || !title || !status) {
        return res.status(400).json({ error: 'Book data and status are required' });
    }

    if (!['want_to_read', 'have_read'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const book = await Book.findOrCreate({
            ol_key,
            title,
            author_names: author_names || 'Unknown Author',
            first_publish_year: first_publish_year || null,
            cover_id: cover_id || null
        });
        await Book.addToUserBookshelf(req.session.userId, book.id, status);

        res.json({ success: true, message: 'Book added successfully' });
    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ error: 'Error adding book' });
    }
});

//manage collection
 router.put('/books/:bookId/move', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { bookId } = req.params;
    const { status } = req.body;

    if (!['want_to_read', 'have_read'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        await Book.addToUserBookshelf(req.session.userId, bookId, status);
        res.json({ success: true, message: 'Book moved successfully' });
    } catch (error) {
        console.error('Move book error:', error);
        res.status(500).json({ error: 'Error moving book' });
    }
});


router.delete('/books/:bookId', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { bookId } = req.params;

    try {
        await Book.removeFromUserBookshelf(req.session.userId, bookId);
         res.json({ success: true, message: 'Book removed successfully' });
    } catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ error: 'Error deleting book' });
    }
});

module.exports = router;