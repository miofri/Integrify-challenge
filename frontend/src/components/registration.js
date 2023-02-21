import axios from "axios";
import { useState } from "react";

const postRegistration = async (event, email, pass, baseUrl) => {
	event.preventDefault();
	const date = new Date(Date.now()).toISOString();

	console.log(pass, email, date);

	const newUser = {
		email: email,
		pass: pass,
		date: date
	}
	const response = await axios.post(`${baseUrl}signup`, newUser, { withCredentials: true });
	console.log(response);

	return response.data;
}


const Register = ({ baseUrl }) => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	return (<>
		<h1>Register</h1>
		<form onSubmit={(event) => postRegistration(event, email, pass, baseUrl)}>
			<div>
				Email: <input type="email"
					id="email"
					defaultValue='tester@tester'
					placeholder='email' minLength="3" maxLength="254"
					onChange={(event) => {
						setEmail(event.target.value);
					}}
					required
				>
				</input>
			</div>
			<div>
				Password: <input type="password"
					id="password"
					defaultValue='123' placeholder='password'
					minLength="6" maxLength="20"
					onChange={(event) => {
						setPass(event.target.value);
					}}
					required
				>
				</input>
			</div>

			<input type={"submit"}></input>
		</form>
	</>
	)
}

export default Register;
