const express= require('express')
const router = express.Router();
const User = require('../models/user.js')

router.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        res.render('applications/profile', {user});
    } catch (err) {
        console.error('Error fetching user:', err);
        res.redirect('/login');
    }
});

module.exports = router;
