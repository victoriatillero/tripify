const User = require('../models/user');

const passUserToViews = async (req, res, next) => {
    res.locals.user = null;
    res.locals.currentRoute = req.path;
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (user) {
                res.locals.user = user;
            }
        } catch (err) {
            console.log("Error fetching user:", err)
        }
    }
    next();
};

module.exports = passUserToViews;
