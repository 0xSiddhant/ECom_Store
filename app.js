const express = require("express")
require("dotenv").config()
const app = express()
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")

// morgan middleware
app.use(morgan('tiny'))

//for swagger documentation
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDoc = YAML.load('./swagger.yaml')

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))

//regualar middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// cookies and file middleware
app.use(fileUpload())
app.use(cookieParser())

// import routes
const home = require("./routes/home")
const user = require("./routes/user")

// routes middleware
app.use("/api/v1", home);
app.use("/api/v1", user);


// export app js
module.exports = app