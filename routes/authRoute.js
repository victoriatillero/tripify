const express = require('express');
const router = express.Router();
const authController = require('../controllers/authCont.js');
const isSignedIn = require('../middleware/is-signed-in.js')


router.get('/signup', (req, res) => {
    res.render('auth/signup.ejs', { currentRoute: 'signup' });
});
router.post('/signup', authController.signUp);

router.get('/login', (req, res)=>{
    res.render('auth/login.ejs', {currentRoute: 'login'});
})
router.post('/login', authController.logIn)

router.get('/logout', isSignedIn, authController.logOut)

module.exports = router;
