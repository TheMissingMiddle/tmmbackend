/**
 * Created by derros on 5/30/17.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tmmbackend');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongoose: Database connection opened.');
});
var UserSchema = mongoose.Schema({
    email: String,
    password: String,
    registrationDate: Date,
    phone: String,
    firstName: String,
    lastName: String,
    organizationId: Number,
    country: String,
    provincialDistrict: String,
    city: String,
    address: String,
    postalCode: String
});
UserSchema.methods.getIdByEmail = function (email, callback) {
    UserSchema.findOne({'email': email}, function (err, data) {
        if (err) {
            console.log('err');
            callback(false, undefined);
        } else {
            callback(true, data._id);
        }
    });
}
var UserModel = mongoose.model('User', UserSchema);

var OrganizationSchema = mongoose.Schema({
    name: String,
    friendlyName: String,
    creationDate: Date,
    owner: Number,
    usersList: Array,
    country: String,
    provincialDistrict: String,
    city: String,
    address: String,
    postalCode: String,
    population: Number
});
OrganizationSchema.methods.getIdByName = function (name, callback) {
    UserSchema.findOne({'name': name}, function (err, data) {
        if (err) {
            console.log('err');
            callback(false, undefined);
        } else {
            callback(true, data._id);
        }
    });
}
var OrganizationModel = mongoose.model('Organization', OrganizationSchema);

module.export.UserSchema = UserSchema;
module.export.UserModel = UserModel;
module.export.OrganizationSchema = OrganizationSchema;
module.export.OrganizationModel = OrganizationModel;