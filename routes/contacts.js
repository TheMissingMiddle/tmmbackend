/**
 * Created by derros on 5/31/17.
 */

var mongo = require('/middleware/mongo')

module.exports.getContacts = function (userID, callback) {
    mongo.UserSchema.findOne({_id: userID}, 'contacts', callback(err, data));
}