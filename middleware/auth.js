/**
 * Created by derros on 5/30/17.
 */

var redis = require('redis');
var client = redis.createClient({
    'host': '127.0.0.1',
    'password': 'foobar'
});
var install = require('./mongo');
var secret = '';
client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports.authenticate = function (email, password, callback) {
    client.hgetall(email, function (err, res) {
        if (err) {
            console.log(err);
            // now we try the cold data
            install.UserSchema.findOne({'email': email}, 'password', function (err, data) {
                if (err) {
                    callback(false);
                } else {
                    if (data.password === password) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }
            });
            callback(false);
        } else {
            if (password === res['password']) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

module.exports.register = function (email, password, registrationDate, firstName, lastName, callback) {
    let newUser = install.UserSchema({
        email: email,
        password: password,
        registrationDate: registrationDate,
        firstName: firstName,
        lastName: lastName
    });
    newUser.save(callback(err));
}

module.exports.genRandom = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

module.exports.getSecret = function () {
    return secret;
}

var status = false;
module.exports.setSecret = function () {
    if(!status) {
        // first time
        status = false;
        secret = this.genRandom();
    } else {
        // don't do
        return false;
    }
}
