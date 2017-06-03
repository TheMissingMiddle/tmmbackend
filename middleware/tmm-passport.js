/**
 * Created by derros on 5/30/17.
 */
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var auth = require('./auth');
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = auth.getSecret();
console.log(opts);
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    auth.hasEmail(jwt_payload.email, function(success) {
        if(success) {
            done(null, {id: jwt_payload.id, email: jwt_payload.email});
        } else {
            done('Not Found', false);
        }
    });
}));
module.exports = passport;
