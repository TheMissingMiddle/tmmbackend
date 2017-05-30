/**
 * Created by alex on 5/29/17.
 */

var redis = require('redis');
var client = redis.createClient({
    'host' : '127.0.0.1',
    'password' : 'foobar'
});

client.on("error", function (err) {
    console.log("Error " + err);
});

function registerUser(req, res, next) {
    // TODO
}
module.exports=registerUser;