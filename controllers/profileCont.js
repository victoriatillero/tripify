const User = require('../models/user.js')
const bcrypt = require('bcrypt');

const profilePage = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/home');
    }
    try {
        const user = await User.findById(req.session.userId).populate('itineraries');
        if (!user) {
            return res.redirect('/home');
        }

        const itineraries = user.itineraries || [];
        res.render('navigations/profile.ejs', { user, itineraries });
    } catch (err) {
        res.redirect('/home');
    }
};
const editUser = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login')
        }
        res.render('navigations/editProfile.ejs', { user });
    } catch (err) {
        res.redirect('/login')
    }
};

const updateUser = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const { username, email, password } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        user.username = username;
        user.email = email;

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }
        await user.save();
        res.redirect('/profile');
    } catch (err) {
        res.redirect('/profile');
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId);
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/profile')
            }
            res.clearCookie('connect.sid');
            res.redirect('/home');
        });
    } catch (err) {
        res.status(500).send("error deleting account")
    }
};

module.exports = {
    profilePage,
    editUser,
    updateUser,
    deleteUser,
}
