const express= require('express')
const router = express.Router();
const authCont = require('../controllers/authCont.js')

router.get('/home, authCont.homePage')
router.post('/home',authCont.logIn);
