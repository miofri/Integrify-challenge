const todoRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { pool } = require('../config/pg-config');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const todoUtils = require('./router-utils/todoRouter-utils');

const initializePassport = require('../config/passport-config');
const { application } = require('express');
initializePassport(passport);

/* User administration actions */
// const requestLogger = (request, response, next) => {
// 	console.log('Method:', request.method)
// 	console.log('Path:  ', JSON.stringify(request.path))
// 	console.log('Body:  ', JSON.stringify(request.body))
// 	console.log('---')
// 	next()
// }

// todoRouter.use(requestLogger);

const emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/

todoRouter.post('/signup', async (req, res, next) => {
	const emailTest = emailReg.test(req.body.email)
	console.log(emailTest);

	const user = {
		email: req.body.email,
		pass: req.body.pass,
	}
	if (emailTest === true) {
		try {
			hashedPassword = await bcrypt.hash(req.body.pass, 10);

			const query = await pool.query(
				`SELECT * FROM users WHERE email = $1`, [req.body.email]
			)

			if (query.rows.length > 0) {
				return res.status(409).send("reg_fail:email_exists");
			}
			const insertNew = todoUtils.insertRegistrationData(req.body.email, hashedPassword);

			if (insertNew === true) {
				req.login(user, (err) => {
					console.log('logging in');
					if (err) {
						return next(err);
					}
				})
				return res.status(200).end();
			}
			else
				return res.status(400).send("something went wrong, check input data");
		} catch (error) {
			next(error);
		}
	}
	else
		res.status(400).send("signup_error:malformatted_data")
})

todoRouter.post('/signin', passport.authenticate('local', {
	successRedirect: '/todos',
	failureRedirect: '/',
	failureFlash: true,
	successFlash: true
}));

todoRouter.post('/signout', (req, res, next) => {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
})

todoRouter.put('/changePassword', async (req, res, next) => {
	if (!req.user) {
		return res.status(404).send("changePassword_error:not_logged_in")
	}
	try {
		hashedPassword = await bcrypt.hash(req.body.pass, 10);
		const query = await pool.query(
			"UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, req.user.id]
		)
		console.log("success");
		return res.status(200).end
	} catch (error) {
		next(error);
	}

})

/* */
/* Todolist actions */
/* */

todoRouter.get('/todos', async (req, res) => {
	if (!req.query.status) {
		const query = await pool.query(
			"SELECT * FROM todolist WHERE user_id = $1", [req.user.id]
		)
		res.send(query.rows);
	}

	else if (req.query.status) {
		const validStatus = todoUtils.checkStatus(req.query.status);
		if (validStatus === "notfound")
			return res.status(400).send("todo_error:invalid_status");

		const query = await pool.query(
			"SELECT * FROM todolist WHERE user_id = $1 AND status = $2", [req.user.id, validStatus]
		)
		console.log(query.rows);
		res.send(query.rows);
	}
})

todoRouter.post('/todos', async (req, res, next) => {
	console.log(req.body, req.user);
	let created = req.body.created;
	let updated = req.body.updated;


	try {
		if (!req.body.name) {
			res.send("addTodo_fail:empty_name");
		}
		else if (created === "") {
			created = new Date(Date.now()).toISOString();
			updated = new Date(Date.now()).toISOString();
		}
		else if (updated === "") {
			updated = new Date(Date.now()).toISOString();
		}

		let validStatus = todoUtils.checkStatus(req.body.status);
		if (validStatus === "notfound")
			return res.status(400).send("todo_error:invalid_status");

		const query = await pool.query(
			"INSERT INTO todolist (user_id, name,  description, created, updated, status) VALUES ($1, $2, $3, $4, $5, $6)", [req.user.id, req.body.name, req.body.description, created, updated, validStatus]
		);

	} catch (error) {
		next(error);
	}
})

todoRouter.delete('/todos/:id', async (req, res, next) => {
	try {
		const query = await pool.query(
			"SELECT * FROM todolist WHERE id = $1", [req.params.id]
		);
		if (query.rows.length < 1) {
			res.send("delete_error:no_entry_found")
		}
		const deleteQuery = await pool.query(
			"DELETE FROM todolist WHERE id = $1", [req.params.id]
		);
		console.log('Deleted entry with id', req.params.id);
	} catch (error) {
		next(error);
	}
})

todoRouter.put('/todos/:id', async (req, res, next) => {
	try {

		const updated = new Date(Date.now()).toISOString();
		const query = await pool.query(
			"select * from todolist where id = $1", [req.params.id]
		);
		if (query.rows.length < 1) {
			res.send("put_error:nonexistent_entry");
		}

		let validStatus = todoUtils.checkStatus(req.body.status);

		const update = await pool.query(
			"UPDATE todolist SET name = $1, description = $2, status = $3, updated = $4 WHERE id = $5", [req.body.name, req.body.description, validStatus, updated, req.params.id]
		);

	} catch (error) {
		next(error);
	}
})


module.exports = todoRouter;
