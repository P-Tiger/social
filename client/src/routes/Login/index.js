import _ from 'lodash';
import React, {
	useEffect, useState
} from 'react';
import {
	GoogleLogin
} from 'react-google-login';
import {
	useDispatch,
	useSelector
} from 'react-redux';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
	request
} from '../../store/features/login';


export const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const loginReducer = useSelector(state => state.loginReducer)
	const dispatch = useDispatch()
	const history = useHistory();

	useEffect(() => {
		if (loginReducer.isLogin && loginReducer.isLogin === true) {
			history.push("/home")
		}
	}, [loginReducer, history])

	function handlerSubmit(e) {
		e.preventDefault();
		dispatch(request({ "user_name": username, "password": password }))
	}

	const handleLogin = async googleData => {
		let email = (googleData && googleData.profileObj && googleData.profileObj.email) || ''
		if (!_.includes(email, "@student.tdtu.edu.vn")) {
			return Swal.fire("Sai tài khoản");
		}
		dispatch(request({ "token_id": googleData.tokenId }))
	}


	return (
		<div className="auth-wrapper">
			<div className="auth-inner">
				<form>
					<h3>Sign In</h3>
					<div className="form-group">
						<label>username</label>
						<input type="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="Enter username" />
					</div>

					<div className="form-group">
						<label>Password</label>
						<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Enter password" />
					</div>

					<button type="submit" onClick={handlerSubmit} className="btn btn-primary btn-block">Submit</button>
				</form>
				<div className='float-right mt-3'>
					<GoogleLogin
						clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
						buttonText="Log in with Google"
						onSuccess={handleLogin}
					/>
				</div>
			</div>
		</div>
	)
};
