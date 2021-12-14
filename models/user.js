const mongoose = require("mongoose")
const validator = require("validator")
const bcrpty = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"], // [value, errorMsg]
        maxlength: [40, "Name Should be under 40 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [validator.email, "Please enter email in correct format"],
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
            required: true
        },
        secure_url: {
            type: String,
            required: true
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

module.exports = mongoose.model("User", userSchema)