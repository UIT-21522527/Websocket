const Messages = require("../models/messageModel");

const getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Messages.find({
            users: {
                $all: [from._id, to._id],
            },
        }).sort({ updatedAt: 1 });
        const projectedMessages = messages.map((msg) => {
            return {
                avatar: msg.sender.toString() === from._id ? from.avatarImage : to.avatarImage,
                fromSelf: msg.sender.toString() === from._id,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};


const addMessage = async (req, res, next) => {
    try {
        const { from, to, message, room } = req.body;
        let data
        data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
            room: room,
        });
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};


module.exports = {
    getMessages,
    addMessage,
}