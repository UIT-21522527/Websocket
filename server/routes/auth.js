const router = require('express').Router()
const {
    login,
    logout,
    register,
    setAvatar,
    getAllUsers
} = require('../controllers/userController')


router.route('/login').post(login)
router.route('/logout/:id').get(logout)
router.route('/register').post(register)
router.route('/setavatar/:id').post(setAvatar)
router.route('/allusers/:id').get(getAllUsers)

module.exports = router