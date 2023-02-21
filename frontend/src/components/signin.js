import axios from "axios";
import { useState } from "react";

const postSignIn = async (event, email, pass, baseUrl) => {
	event.preventDefault();


	const logUser = {
		email: email,
		pass: pass,
	}
	console.log('signin', logUser);

	const response = await axios.post(`${baseUrl}signin`, logUser, { withCredentials: true })

	console.log('response', response.data);

	return response.data;
}


const SignIn = ({ baseUrl }) => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	return (<>
		<h1>Sign In</h1>
		<form onSubmit={(event) => postSignIn(event, email, pass, baseUrl)}>
			<div>
				Email: <input type="email"
					id="email-signin"
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
					id="password-signin"
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

export default SignIn;
