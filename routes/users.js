var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/auth', function (req, res, next) {
    let username = req.body['username'];
    let password = req.body['password'];
    auth.authenticate(username, password, function (status) {
        if (status) {
            // now sign JWT
            jwt.sign({user: username}, auth.getSecret(), {}, function (err, token) {
                if (err) {
                    res.json({'Status': 'Error', 'Error': err});
                } else {
                    res.json({'Token': token, 'Status': 'Success'});
                }
            });
        }
        else {
            res.json({'Status': 'Invalid'});
        }
    });
});

router.get('/query', function (req, res, next) {
    console.log(req.query.username);
    console.log(req.query.password);
    let username = req.query.username;
    let password = req.query.password;
    auth.authenticate(username, password, function (status) {
        res.send(status);
    });
});

router.get('/verify', function (req, res, next) {
    console.log(req.query.jwt);
    let token = req.query.jwt;
    jwt.verify(token, auth.getSecret(), function (err, decoded) {
        if(err) {
            res.json({'Status': 'Error', 'Error': err});
        } else {
            res.json({'Status':'Success', 'Decoded': decoded});
        }
    });

});

router.post('register', function (req, res, next) {
    let username =
});

/*
router.get('/test', function (req, res, nxt) {
    console.log(req.query.testKey); // for the form of /users/:id use req.params.id to fetch value
    res.send("balabala");
});
*/
module.exports = router;
