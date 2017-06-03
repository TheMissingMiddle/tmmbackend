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

module.exports.redisClient = client;

module.exports.genRandom = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

module.exports.getSecret = function () {
    return secret;
};

var status = false;
module.exports.setSecret = function () {
    if (!status) {
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
    return h.digest('hex');
};

module.exports.hash2 = function (text) {
    let h = require('crypto').createHash('rmd160')
    h.update(text);
    return h.digest('hex');

};


module.exports.authenticate = function (email, password, callback) {
    client.hgetall(email, function (err, res) {
        if (err || res == undefined || res == '') {
            console.log(err);
            // now we try the cold data
            install.UserModel.findOne({email: email}, '_id password salt', function (err, data) {
                if (err) {
                    callback(false, undefined);
                } else {
                    let auth = require('./auth');
                    let salt = data['salt'];
                    let salted = auth.hash1(auth.hash2(password + salt));
                    let userId = data['_id'];
                    console.log('salted passwd:' + salted);
                    console.log('salt:' + salt);
                    console.log('original passwd: ' + data['password']);
                    if (data['password'] === salted) {
                        console.log('password comparison correct');
                        callback(true, userId);
                    } else {
                        console.log('password comparison incorrect');
                        callback(false, undefined);
                    }
                }
            });
        } else {
            console.log(err);
            console.log(res);
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
                if (err) {
                    callback(false)
                } else {
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
    let newUser = new install.UserModel({
        email: email,
        password: salted,
        salt: salt,
        registrationDate: registrationDate,
        firstName: firstName,
        lastName: lastName
    });
    newUser.save(callback);
};