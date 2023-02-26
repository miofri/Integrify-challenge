const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./pg-config');
const bcrypt = require('bcrypt');

const initialize = (passport) => {
	console.log('initiliazing passport...');

	passport.use(
		new LocalStrategy({ usernameField: 'email', passwordField: 'pass' }, function verify(email, pass, done) {

			pool.query(
				`select * from users where email = $1`, [email], (err, results) => {

					if (err) { console.log('strategy_err:failed_query') };

					if (results.rows.length > 0) {
						const user = results.rows[0];
						bcrypt.compare(pass, user.password, (err, isMatch) => {
							if (err) { console.log('strategy_err:failed_bcrypt_compare', err) };

							if (isMatch) {
								return done(null, user);
							}
							else {
								return done(null, false, { message: "inccorect password" })
							};
						})
					}
					else {
						return done(null, false, { message: "email not in db" });
					}
				}
			)
		}),
	);

	passport.serializeUser((user, done) => {
		return done(null, { id: user.id, email: user.email })
	})


	passport.deserializeUser((user, done) => {
		return done(null, user)
	})
}
module.exports = initialize;

/*
LocalStrategy defines how passport determine if a user exists or not;
	as we use custom user/password (email, pass), we need to define it with usernameField
	and passwordField.
	verify then queries the db , first to make sure that no duplicate emails exists, then
	compares the crypted password against the provided password.
	function done will then returns messages if there's an error with flash, which can be
	accessed in req.session.

serializeUser: saves the provided user details
deserializeUser: returns the saved details as req.user.
*/
