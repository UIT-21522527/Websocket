const { addMessage, getMessages, getGroupMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.route("/addmsg/").post(addMessage);
router.route("/getmsg/").post(getMessages);


module.exports = router;
