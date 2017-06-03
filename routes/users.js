var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');
var install = require('../middleware/mongo');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/auth', function (req, res, next) {
    let email = req.body['email'];
    let password = req.body['password'];
    auth.authenticate(email, password, function (status, userId) {
        console.log(status + userId);
        if (status) {
            // now sign JWT
            console.log('status is true, user Id' + userId);
            jwt.sign({email: email, id: userId}, auth.getSecret(), {}, function (err, token) {
                console.log('signing json');
                if (err) {
                    res.json({'Status': 'Error', 'Error': err});
                } else {
                    console.log('json signed');
                    res.json({'Token': token, 'Status': 'Success'});
                }
            });
        } else {
            console.log('staatus is false, ' + status);
            res.json({'Status': 'Invalid'});
        }
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

router.post('/register', function (req, res, next) {
    let email = req.body['email'];
    let password = req.body['password'];
    let registrationDate = new Date();
    let firstName = req.body['firstName'];
    let lastName = req.body['lastName'];
    auth.register(email, password, registrationDate, firstName, lastName, function (err) {
        if(err) {
            res.json({'Status': 'Error', 'Error': err});
        } else {
            res.json({'Status': 'Success'});
        }
    });
});

/*
router.get('/test', function (req, res, nxt) {
    console.log(req.query.testKey); // for the form of /users/:id use req.params.id to fetch value
    res.send("balabala");
});
*/
module.exports = router;
