const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./pg-config');
const bcrypt = require('bcrypt');

const initialize = (passport) => {
	console.log('initiliazing passport...');

	passport.use(
		new LocalStrategy({ usernameField: 'email', passwordField: 'pass' }, function verify(email, pass, done) {
			console.log('authenticateUSer', email, pass);
			pool.query(
				`select * from users where email = $1`, [email], (err, results) => {

					if (err) { console.log('HELP!') };

					if (results.rows.length > 0) {
						const user = results.rows[0];
						bcrypt.compare(pass, user.password, (err, isMatch) => {
							if (err) { console.log('HELP! 2', err) };

							if (isMatch) {
								console.log('isMatch is true, success!');
								return done(null, user)
							}
							else { return done(null, false, { message: "inccorect password" }) };
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
		done(null, user)
	})
}
module.exports = initialize;
