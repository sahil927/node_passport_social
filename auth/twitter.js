var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/User');

module.exports = function(passport) {
	passport.use(
		new TwitterStrategy(
			{
				consumerKey: 'DpYPpmRRq2B6fp5IaBRY0Mv6C',
				consumerSecret: 'ZkkdAHo4lwBgXPvuXLLsPwp6vekq3XZl8YRsHHfee9UqWJIr91',
				callbackURL: 'http://localhost:3000/auth/twitter/callback'
			},
			function(token, tokenSecret, profile, done) {
				// find the user in the database based on their twitter id
				User.findOne({ userid: profile.id }, function(err, user) {
					console.log(profile);
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err) return done(err);

					// if the user is found, then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						var newUser = new User();
						newUser.userid = profile.id;
						newUser.name = profile.displayName;

						// save our user to the database
						newUser.save(function(err) {
							if (err) throw err;

							// if successful, return the new user
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
