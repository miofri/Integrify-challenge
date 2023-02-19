const { pool } = require("./db");

const insertData = async () => {
	const [name, color] = process.argv.slice(2);
	try {
		const res = await pool.query(
			"INSERT INTO test (name, color) VALUES ($1, $2)", [name, color]
		);
		console.log(`added a shark with the name ${name}`);
	} catch (error) {
		console.error(error)
	}
}

const retrieveData = async () => {
	try {
		const res = await pool.query("SELECT * FROM test");
		console.log(res.rows);

	} catch (error) {
		console.error(error);
	}
}

const modifyData = async () => {
	const [id, name] = process.argv.slice(2);

	try {
		const res = await pool.query("UPDATE test SET name = $1 WHERE id = $2", [
			name,
			id,
		]);
		console.log(`updated test name to ${name}`);
	} catch (error) {
		console.error(error);
	}
}
