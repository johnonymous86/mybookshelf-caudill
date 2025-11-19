


const auth = (req, res, next) => {
 
    if (req.session.isLoggedIn) {
        next();
    } else {
       
        res.redirect('/login?error=You must be logged in to view this page');
    }
};

module.exports = auth;