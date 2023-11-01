const router = require('express').Router()
const {getMessagesRoom, getRoom, getRoomById, joinRoom, outRoom} = require('../controllers/roomController')


router.route("/getmsgroom/").post(getMessagesRoom)
router.route("/getroom/").get(getRoom)
router.route("/getroombyid/:id").get(getRoomById)
router.route("/joinroom").post(joinRoom)
router.route("/outroom").post(outRoom)

module.exports = router