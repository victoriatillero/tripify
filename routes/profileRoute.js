const express= require('express')
const router = express.Router();
const profileCont= require('../controllers/profileCont.js')


router.get('/', profileCont.profilePage);
router.get('/edit', (req,res,next) => {
    next();
},profileCont.editUser);
router.post('/edit', profileCont.updateUser)
router.delete('/', profileCont.deleteUser);

module.exports = router;
