const Room = require('../models/roomModel')
const Messages = require('../models/messageModel')
const Users = require('../models/userModel')

const getRoom = async (req, res, next) => {
    try {
        const rooms = await Room.find({ _id: { $ne: req.params.id } }).select([
            "roomname",
            "users",
            "_id",
        ]);
        return res.json(rooms);
    } catch (ex) {
        next(ex);
    }
};

const getRoomById = async (req, res, next) => {
    try {
        const rooms = await Room.find({ _id: req.params.id }).select([
            "roomname",
            "users",
            "_id",
        ]);
        return res.json(rooms);
    } catch (ex) {
        next(ex);
    }
};

const joinRoom = async (req, res, next) => {
    try {

        const { room, id } = req.body
        const check = await Room.find({
            users: {
                $all: [id],
            }
        }
        )

        console.log('check', check);
        if (check.length != 0) {
            console.log('checked');
            return res.json('Nguoi dung da tham gia room');
        }
        const rooms = await Room.findByIdAndUpdate(room, { $push: { users: id } })
        console.log('rooms', rooms);
        return res.json(rooms)
    } catch (e) {
        next(e)
    }
}

const outRoom = async (req, res, next) => {
    try {

        const { room, id } = req.body
        console.log('roi phong', room, id);
        const check = await Room.find({
            room,
            users: {
                $all: [id],
            }
        }
        )
        if (!check)
            return res.json('Nguoi dung chua tham gia room');
        const rooms = await Room.findByIdAndUpdate(room,  {$pull:{ users: id }})
        return res.json(rooms)
    } catch (e) {
        next(e)
    }
}

const getMessagesRoom = async (req, res, next) => {
    try {
        const { from, roomId } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [roomId],
            },
        }).sort({ updatedAt: 1 });

        const promises = messages.map(async (msg) => {
            const foundUser = await getUserById(msg.sender.toString());
            return {
                avatar: msg.sender.toString() === from._id ? from.avatarImage : foundUser.avatarImage,
                fromSelf: msg.sender.toString() === from._id,
                message: msg.message.text,
            };
        });
        const projectedMessages = await Promise.all(promises);
        // console.log('projectedMessages', projectedMessages)
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
}

const getUserById = async (id) => {
    let foundUser
    await Users.findById(id).exec()
        .then(user => {
            if (user) {
                foundUser = user; // Gán kết quả tìm kiếm vào biến foundUser
                //   console.log("Người dùng đã tìm thấy:", foundUser);
                // Xử lý người dùng đã tìm thấy
            } else {
                console.log("Không tìm thấy người dùng với ID đã cho.");
            }
        })
        .catch(error => {
            console.error("Lỗi khi tìm người dùng:", error);
        });

    return foundUser;
}

module.exports = {
    getMessagesRoom,
    getRoom,
    getRoomById,
    joinRoom,
    outRoom
}