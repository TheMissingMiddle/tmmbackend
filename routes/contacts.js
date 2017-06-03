/**
 * Created by derros on 5/31/17.
 */
var express = require('express');
var router = express.Router();
var mongo = require('../middleware/mongo')
/*
module.exports.getContacts = function (userID, callback) {
    mongo.UserSchema.findOne({_id: userID}, 'contacts', callback(err, data));
}
*/
router.get('/', function (req, res, next) {
   res.json({
       Status: 'Success'
   });
});

module.exports = router;