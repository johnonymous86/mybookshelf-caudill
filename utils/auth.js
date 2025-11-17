// Middleware to check if user is authenticated
const auth = (req, res, next) => {
    // If the user is logged in, continue to the next middleware/route handler
    if (req.session.isLoggedIn) {
        next();
    } else {
        // If not logged in, redirect to login page
        res.redirect('/login?error=You must be logged in to view this page');
    }
};

module.exports = auth;