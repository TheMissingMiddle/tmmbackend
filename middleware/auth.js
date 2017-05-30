/**
 * Created by derros on 5/30/17.
 */

var redis = require('redis');
var client = redis.createClient({
    'host': '127.0.0.1',
    'password': 'foobar'
});
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tmmbackend');

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports.authenticate = function (username, password, callback) {
    client.hgetall(username,function(err, res){
        if(err) {
            console.log(err);
            // now we try the cold data

            callback(false);
        } else {
            if(password === res['password']) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

module.exports.register = function (username, password) {
    client.hmset(username, {username:username, password:password});
}

module.exports.getSecret = function () {
    return 'passwd123';
}
