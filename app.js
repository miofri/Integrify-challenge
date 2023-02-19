const express = require('express');
const app = express()
const todoRouter = require('./controllers/todo')

app.use(express.json());
app.use('/api/v1', todoRouter);

app.get("/", (req, res) => {
	res.send("Hello World")
})

module.exports = app;
