const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require("../utils/customError")
const cookieToken = require("../utils/customError")

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

    cookieToken()
})