import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoggedInContext } from '../../context/LoggedInContext.js';
import "./Login.css";

export default function Signin() {
  const [email, setCurrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const { setLoggedIn, setEmail } = useContext(LoggedInContext);
  const navigate = useNavigate()

  const onButtonClick = async() => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
  
    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }
    await logIn();
  }

  const logIn = async() => {
    let myHeaders = new Headers();
    myHeaders.append("Origin", window.origin);
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      email,
      password
    });
    
    fetch(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/auth/login`, {
      method: "POST",
      headers: myHeaders,
      body: body
    })      
    .then((response) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return response.json()
    })
    .then((data) => {
      sessionStorage.setItem('user', JSON.stringify({ email, token: data.token }))
      setLoggedIn(true);
      setEmail(email);
      // navigate to path
      navigate(`/${email}`);
    })
    .catch((error) => {
      window.alert('Wrong email or password');
      console.error(`Error: ${error}`);
    });
  };
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-32 md:pt-52 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-md font-medium leading-6">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="Enter your email here"
                  onChange={(ev) => setCurrEmail(ev.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-3 shadow-sm ring-1 ring-inset text-gray-800 ring-gray-700 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-md sm:leading-6"
                />
                <label className="errorLabel">{emailError}</label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-md font-medium leading-6">
                  Password
                </label>
                <div className="text-md">
                  <button href="#" className="font-semibold text-primary hover:text-primary-500">
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  value={password}
                  placeholder="Enter your password here"
                  onChange={(ev) => setPassword(ev.target.value)}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-3 shadow-sm ring-1 ring-inset text-gray-800 ring-gray-700 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-md sm:leading-6"
                />
                <label className="errorLabel">{passwordError}</label>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={onButtonClick}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-3 text-md font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-md text-gray-500">
            Not a member?{' '}
            <button onClick={() => navigate("/signup")} className="font-semibold leading-6 text-primary hover:text-primary-500">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </>
  )
}