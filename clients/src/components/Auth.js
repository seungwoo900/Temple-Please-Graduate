import { useState } from "react"
import {useCookies} from 'react-cookie'

const Auth = () => {
    const [cookies, setCookies, removeCookies] = useCookies(null)
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    console.log(cookies)

    const viewLogin = (status) => {
        setError(null)
        setIsLogin(status)
    }

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if(!isLogin && password !== confirmPassword) {
            setError('Make sure passwords match!')
            return
        }

        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })

        const data = await response.json()

        if(data.detail) {
            setError(data.detail)
        } else {
            setCookies('Email', data.email)
            setCookies('AuthToken', data.token)

            window.location.reload()
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <h2>Welcome to Temple Please Graduate!</h2>
                <form>
                    <h2>{isLogin ? 'Please log in' : 'Please sign up!'}</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin &&
                    <input
                        type="password"
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    <input type="submit" value={isLogin ? "LOGIN" : "SUBMIT"} className="create" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')} />
                    {error && <p>{error}</p>}
                </form>
                <div className="auth-options">
                    <button
                        onClick={() => viewLogin(false)}
                        style={{backgroundColor : !isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
                    >Sign Up</button>
                    <button
                        onClick={() => viewLogin(true)}
                        style={{backgroundColor : isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
                    >Login</button>
                </div>
            </div>
        </div>
    )
}

export default Auth