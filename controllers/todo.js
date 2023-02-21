const todoRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/pg-config');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session')


const initializePassport = require('../config/passport-config');
initializePassport(passport);

todoRouter.get('/', (req, res) => {
	res.send('hello world!')
})

todoRouter.get('/todos', (req, res) => {
	console.log('/todos', req.session);
	res.send('todos');
})

todoRouter.get('/success', (req, res) => {
	console.log('/success', req.user);
	res.send(req.user);
})

const insertRegistrationData = async (email, password, created) => {
	try {
		const res = await pool.query(
			"INSERT INTO users (email, password, created, updated) VALUES ($1, $2, $3, $4)", [email, password, created, created]
		);
		console.log(`added an user with the email ${email}`);
	} catch (error) {
		console.error(error)
	}
}

todoRouter.post('/signup', async (req, res, next) => {
	console.log(req.body.email);

	hashedPassword = await bcrypt.hash(req.body.pass, 10)

	pool.query(
		`select * from users
		where email = $1`, [req.body.email], (err, result) => {
		if (err) {
			console.log(err);
		}
		if (result.rows.length > 0) {
			console.log(result.rows.length);
			return res.send("reg_fail:email_exists");
		}
		else {
			insertRegistrationData(req.body.email, hashedPassword, req.body.date)
			return res.send("reg_success")
		}
	}
	)
	const user = {
		email: req.body.email,
		pass: req.body.pass
	}
	req.login(user, (err) => {
		console.log('logging in')

		if (err) {
			return next(err);
		}
	})
	next();
})

todoRouter.post('/signin', passport.authenticate('local', {
	successRedirect: 'success',
	failureRedirect: 'todos',
	failureFlash: true,
	successFlash: true
}));

todoRouter.post('/todos', (req, res) => {
	res.send(req.query.status);
})

todoRouter.put('/todos/:id', (req, res) => {
	res.send(req.query.status);
})
todoRouter.put('/changePassword', (req, res) => {
	res.send(req.query.status);
})

todoRouter.delete('/todos/:id', (req, res) => {
	res.send(req.query.status);
})

module.exports = todoRouter;
