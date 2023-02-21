import axios from "axios";
import { useState } from "react";
import Register from "./components/registration";
import SignIn from "./components/signin";

const baseUrl = 'http://localhost:8080/api/v1/'

const App = () => {
	return (
		<>
			<Register baseUrl={baseUrl} />
			<SignIn baseUrl={baseUrl} />
		</>
	)
}

export default App;
