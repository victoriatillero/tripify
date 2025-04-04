const express = require('express');
const router = express.Router();
const authController = require('../controllers/authCont.js');

// sign up route
router.get('/signup', (req, res)=>{
    res.render('auth/signup.ejs')
})
router.post('/signup', authController.signUp)

// sign in route
router.get('/login', (req, res)=>{
    res.render('auth/login.ejs')
})
router.post('/login', authController.logIn)

// log out route
router.get('/logout', authController.logOut)


module.exports = router;
