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
        if(status) {
            // now sign JWT
            jwt.sign({
                user: username
            }, auth.getSecret(), { expiresIn: '3d' }, function (err, token) {
                if(err) { res.json({'Error': '500', 'Status': 'Server Error'}); }
            });

        }
        else { res.json({'Error': 401, 'Status': 'Unauthorized'}); }
    });
});

router.get('/test', function (req, res, nxt) {
    console.log(req.query.testKey); // for the form of /users/:id use req.params.id to fetch value
    res.send("balabala");
});

module.exports = router;
