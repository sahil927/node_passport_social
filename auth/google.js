const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
var User = require('../models/User');

module.exports = function(passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: '722792843646-shjks2p4k93unmk8v0u277omrsafmvqk.apps.googleusercontent.com',
				clientSecret: 'nbCdfWKgmVSwHT2BvTldSgoS',
				callbackURL: 'http://localhost:3000/auth/google/callback',
				proxy: true
			},
			(accessToken, refreshToken, profile, done) => {
				User.findOne({ userid: profile.id }, function(err, user) {
					console.log(profile);
					if (err) return done(err);
					if (user) {
						return done(null, user);
						var newUser = new User();
						newUser.userid = profile.id;
						newUser.name = profile.displayName;
						newUser.save(function(err) {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => done(null, user));
	});
};
