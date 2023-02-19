const todoRouter = require('express').Router();

const status = {
	NotStarted: "notstarted",
	OnGoing: "ongoing",
	Completd: "completed"
}

// params query needs to correspond to status
todoRouter.get('/todos', (req, res) => {
	res.send(req.query.status);
})

todoRouter.post('/signup', (req, res) => {
	res.send(req.query.status);
})

todoRouter.post('/signin', (req, res) => {
	res.send(req.query.status);
})

todoRouter.post('/todos', (req, res) => {
	res.send(req.query.status);
})

todoRouter.put('todos/:id', (req, res) => {
	res.send(req.query.status);
})
todoRouter.put('changePassword', (req, res) => {
	res.send(req.query.status);
})

todoRouter.delete('/todos/:id', (req, res) => {
	res.send(req.query.status);
})

module.exports = todoRouter;
