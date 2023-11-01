const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomname: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    users: Array,
});

module.exports = mongoose.model("Rooms", roomSchema);
