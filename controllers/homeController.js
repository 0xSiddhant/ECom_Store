exports.home = (req, res) => {
    res.status(200).json({
        success: true,
        greetings: "Hello From API"
    })
}

exports.homeDummy = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello World",
        badge: 2
    })
}