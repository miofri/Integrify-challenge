const { pool } = require('../../config/pg-config');
const bcrypt = require('bcrypt');


const insertRegistrationData = async (email, password) => {
	const created = new Date(Date.now()).toISOString();
	try {
		const query = await pool.query(
			"INSERT INTO users (email, password, created, updated) VALUES ($1, $2, $3, $4)", [email, password, created, created]
		);
		console.log(`added an user with the email ${email}`);
		return true;
	} catch (error) {
		console.error(error)
		return false;
	}
}

const status = {
	OnGoing: "ongoing",
	Completed: "completed",
	Notstarted: "notstarted"
};

const checkStatus = (reqStatus) => {
	console.log(reqStatus, status[reqStatus])

	if (reqStatus !== "completed" && reqStatus !== "notstarted" && reqStatus !== "ongoing") {
		if (reqStatus in status) {
			reqStatus = status[reqStatus];
			console.log(reqStatus)

			return reqStatus;
		}
		else {
			reqStatus = "notfound";
			return reqStatus;
		}
	}
	return reqStatus;
}
module.exports = {
	insertRegistrationData,
	checkStatus
}
