const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../utils/customError")

exports.signup = BigPromise( async (req, res, next) => {

    const {name, email, password} = req.body

    if (!email || !name || !password) {
        return next(new CustomError("Name, Email and Password are required", 400))
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTToken()

    const options = {
        expires: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
})