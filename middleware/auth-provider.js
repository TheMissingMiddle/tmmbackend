var redis = require('redis');
var client = redis.createClient({
    'host': '127.0.0.1',
    'password': 'foobar'
});

client.on("error", function (err) {
    console.log("Error " + err);
});

function isValidUser(req, res, next) {
    // get values
    let username = req.query.username;
    let passwd = req.query.passwd;
    if (username === "foo" && passwd === "bar") {
        next();
    } else {
        res.send("403 Unauthorized.");
    }
}

module.exports = isValidUser;