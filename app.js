const express = require("express")
require("dotenv").config()
const app = express()

// import routes
const home = require("./routes/home")

// routes middleware
app.use("/api/v1", home);



// export app js
module.exports = app