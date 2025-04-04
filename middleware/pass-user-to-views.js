const passUserToViews = (req, res, next) => {
    res.locals.user = req.session.userId; // Pass user to all views
    next(); // Proceed to the next middleware or route handler
};

module.exports = passUserToViews;
