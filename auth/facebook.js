var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/User');

module.exports = function(passport) {
	passport.use(
		new FacebookStrategy(
			{
				clientID: '595624010815863',
				clientSecret: 'dd92de92e9b6c122268f81b21321127d',
				callbackURL: 'http://localhost:3000/auth/facebook/callback'
			},
			function(accessToken, refreshToken, profile, done) {
				// find the user in the database based on their facebook id
				User.findOne({ userid: profile.id }, function(err, user) {
					console.log(profile);
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err) return done(err);

					// if the user is found, then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						// if there is no user found with that facebook id, create them
						var newUser = new User();

						newUser.userid = profile.id; // set the users facebook id

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
