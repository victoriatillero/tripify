const User= require('../models/user.js')
const bcrypt = require('bcrypt');

const homePage =  async (req, res) => {
    let user=null;
    if (req.session.userId) {
        try {
            user = await User.findById(req.session.userId);
        } catch (err) {
            console.error('Error fetching user:', err);
                }
        }
    res.render('navigations/home.ejs', {
                user,
                currentRoute: 'home' ,
            });

    };
const signUp= async (req, res) => {
    try {
        const{ email, password, username} = req.body;
        const existingUser= await User.findOne({email});
        if (existingUser) {
            return res.redirect('/auth/login'); // removed the message to front end saying "email already exists", add back iff necessary
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({ email, password:hashedPassword, username});
        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.status(500).send('Server Error')
    }
};

const logIn= async (req,res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user)  return res.redirect('/auth/login') // removed this: status(400).send(`No account found for ${req.body.email}. `)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.redirect('/auth/login')

        req.session.regenerate((err) => {
            if (err)  return res.redirect('/auth/login');
            req.session.userId = user._id;
            res.redirect('/home');
        });

    } catch (err) {
        res.status(500).send('Login failed');
    }
};
const logOut= (req,res) => {
    if (!req.session.userId)  return res.redirect('/home');
    req.session.destroy((err) => {
        if (err) return res.redirect('/home')
        res.clearCookie('connect.sid');
        res.redirect('/home');
    })
}

module.exports = {homePage, signUp, logIn, logOut}
