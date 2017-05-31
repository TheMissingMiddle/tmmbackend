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
            install.UserSchema.findOne({'email': email}, '_id password salt', function (err, data) {
                if (err) {
                    callback(false, undefined);
                } else {
                    let salt = data.salt;
                    let salted = this.hash1(this.hash2(password + salt));
                    let userId = data._id;
                    if (data.password === salted) {
                        callback(true, userId);
                    } else {
                        callback(false, undefined);
                    }
                }
            });
            callback(false);
        } else {
            let salt = res['salt'];
            let saled = this.hash1(this.hash2(password + salt));
            let userId = req['_id'];
            if (salted === res['password']) {
                callback(true, userId);
            } else {
                callback(false, undefined);
            }
        }
    });
};


module.exports.hasEmail = function (email, callback) {
    client.hgetall(email, function (err, res) {
        if (err) {
            // try cold
            console.log(err);
            install.UserSchema.findOne({'email': email}, '', function (err, data) {
               if(err) {callback(false)} else {
                   callback(true);
               }
            });
        } else {
            callback(true);
        }
    })
};


module.exports.authJwt = function (token, callback) {
    jwt.verify(token, auth.getSecret(), function (err, decoded) {
        if (err) {
            callback(false, err);
        } else {
            callback(true, decoded);
        }
    });
};

module.exports.register = function (email, password, registrationDate, firstName, lastName, callback) {
    let salt = this.genRandom();
    let salted = this.hash1(this.hash2(password + salt));
    let newUser = install.UserSchema({
        email: email,
        password: salted,
        salt: salt,
        registrationDate: registrationDate,
        firstName: firstName,
        lastName: lastName
    });
    newUser.save(callback(err));
};

module.exports.genRandom = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

module.exports.getSecret = function () {
    return secret;
};

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
};

module.exports.hash1 = function (text) {
    let h = require('crypto').createHash('sha512')
    h.update(text);
    return h.digest(hex);
};

module.exports.hash2 = function (text) {
    let h = require('crypto').createHash('rmd160')
    h.update(text);
    return h.digest(hex);

};
