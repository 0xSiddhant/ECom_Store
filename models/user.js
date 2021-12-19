const mongoose = require("mongoose")
const validator = require("validator")
const bcrpty = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"], // [value, errorMsg]
        maxlength: [40, "Name Should be under 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validator: [validator.email, "Please enter email in correct format"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide an password"],
        maxlength: [6, "Password should be atlease 6 chars"],
        select: false // When model data get fetched then this field won't get fetched
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Encrypt password before save - HOOKS ===============================================
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrpty.hash(this.password, 10)
})

// validate the password with passed on user password
userSchema.methods.isValidatePassword = async function(userSendPassword) {
    return await bcrpty.compare(userSendPassword, this.password)
}

// create and get JWT token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id,}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

// generate forgot password token (string)
userSchema.methods.getForgetPasswordToken = function() {
    // generate a long and random string
    const forgetToken = crypto.randomBytes(20).toString('hex') 

    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken  = crypto.createHash('sha256').update(forgetToken).digest('hex')

    // time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000

    return forgetToken
}

module.exports = mongoose.model("User", userSchema)