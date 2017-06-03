/**
 * Created by derros on 6/3/17.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../middleware/mongo');
var auth = require('../middleware/auth');
router.get('/', function (req, res, next) {
    // we shall assume JWT has attached needed info in previous middleware, so...
    const jwtInfo = req.decodedJWTData; // see app.js
    // now, get all
    mongo.UserModel.findOne({'_id': jwtInfo.id}, '_id email registrationDate firstName lastName contacts', function (err, data) {
        if (err) {
            res.json({
                Status: 'Error',
                Error: err
            });
        } else {
            res.json({
                Status: 'Success',
                Data: data
            });
        }
    });
});
router.post('/add-contact', function (req, res, next) {
    const jwtInfo = req.decodedJWTData;
    const userId = jwtInfo.id;
    const userEmail = jwtInfo.email;
    const destEmail = req.body.contactEmail;
    mongo.UserSchema.getIdByEmail(destEmail, function (isErr, destId) {
       if(isErr) {
           res.json({
               Status: 'Error',
               Error: 'Contact user not found'
           });
       } else {
           mongo.UserModel.update({_id:userId}, {
               '$push': { contacts: destEmail }
           }, function (err, mongoResponse) {
                console.log(err + ' '+ mongoResponse);
                if(err) {
                    res.json({
                        Status: 'Error',
                        Error: 'Database connection error'
                    });
                } else {
                    res.json({
                        Status: 'Success',
                        email: userEmail,
                        contactEmail: destEmail
                    });
                }
           });
       }
    });
});

router.post('/change-password', function (req, res, next) {
    const jwtInfo = req.decodedJWTData;
    const userId = jwtInfo.id;
    const userEmail = jwtInfo.email;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    auth.authenticate(userEmail, oldPassword, function (success, userId) {
        if(success) {
            let salt = auth.genRandom();
            let saltedNewPassword = auth.hash1(auth.hash2(newPassword + salt));
            mongo.UserModel.update({_id:userId}, {
                password: saltedNewPassword,
                salt: salt
            }, function (err, msg) {
                console.log(err + ' ' + msg);
                if(err) {
                    res.json({
                        Status: 'Error',
                        Error: 'Database connection error'
                    });
                } else {
                    res.json({
                        Status: 'Success',
                        Password: newPassword
                    })
                }
            });
        } else {
            res.json({
                Status: 'Error',
                Error: 'Old password is incorrect'
            });
        }
    });
});

module.exports = router;
