const { Pool } = require('pg')

const pool = new Pool({
	user: 'selvi',
	database: 'test',
	password: '1234',
	port: 5432,
	host: 'localhost',
})

module.exports = { pool };
