const isSignedIn = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not signed in
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = isSignedIn;
