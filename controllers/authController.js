const User= require('../models/user.js')
const bcrypt = require('bcrypt');

const signUp= async (req, res) => {
    try {
        const{ email, password} = req.body;

        const existingUser= await User.findOne({email});
        if (existingUser) {
            return res.status(400).send('User already exists.')
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({ email, password:hashedPassword});
        await newUser.save();

        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error')
    }
};

const logIn= async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).send('Invalid email or password.')
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password.')
        }
        req.session.userId = user._id;
        res.redirect('/dashboard');
    }catch (err) {
        console.log(err);
        res.status(500).send('Server error')
    }
}

const logOut= (req,res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

module.exports = {signUp, logIn, logOut}
