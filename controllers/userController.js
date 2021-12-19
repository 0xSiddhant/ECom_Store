const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../utils/customError")
const cookieToken = require("../utils/cookieToken")
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary")

exports.signup = BigPromise( async (req, res, next) => {

    if (!req.files) {
        return next(new CustomError("Photo is required for sign up", 400))
    }
    
    let file = req.files.photo

    const {name, email, password} = req.body

    if (!email || !name || !password) {
        return next(new CustomError("Name, Email and Password are required", 400))
    }

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    cookieToken(user, res)
})