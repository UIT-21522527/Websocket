const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const login = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user)
            return res.status(200).json({msg: "Incorrect Username or Password", status: false})
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid)
            return res.status(200).json({msg: "Incorrect Username or Password", status: false})
        console.log('login successfully')
        return res.status(200).json({status: true, user})
    } catch (e) {
        next(e)
    }
}

const logout = (req, res, next)=>{
    try{
        if (!req.params.id) return res.json({ msg: "User id is required " });
        // onlineUsers.delete(req.params.id);
        return res.status(200).send();
    }catch (e) {
        next(e)
    }
}
const register = async (req, res, next) => {
    try {
        const {username, password, email} = req.body
        const userCheck = await User.findOne({username})
        // console.log('userCheck', userCheck)
        if (userCheck)
            return res.status(200).json({msg: "Username already used", status: false})
        const emailCheck = await User.findOne({email});
        if (emailCheck)
            return res.status(200).json({msg: "Email already used", status: false})
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            password: hashPassword,
        });
        return res.status(200).json({status: true, user})
    } catch (e) {
        next(e)
    }
}

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(
            userId, {
                isAvatarImageSet: true,
                avatarImage
            },
            {returnOriginal: false}
        )
        await userData.save()
        // console.log(userData.isAvatarImageSet)
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (e) {
        next(e)
    }
}
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};
module.exports = {
    login,
    logout,
    register,
    setAvatar,
    getAllUsers
}