import React, {useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import axios from '../api/axios'

const LOGIN_URL = '/auth/login';

const Login = () => {
    const { auth, setAuth } = useAuth();
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        // Logback if the user is still loggedin 
        console.log("Login: " + from);
        const logBack = async () => {
            try{
                await refresh();
                navigate(from, { replace: true });
            }
            catch (err){
                console.log(err);
            }
        }

        if(!auth?.access_token){
            logBack();
        }
        else{
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        const params = new URLSearchParams({ 
            username: user,
            password: pwd
        });
        try{
            const response = await axios.post(
                LOGIN_URL,
                params,
                {
                    headers:{
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true
                }
            );
            console.log(response);
            const {access_token, token_type} = response.data;
            setAuth({ user, pwd, access_token, token_type });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
            
        }catch(err){
            if(!err.response){
                setErrMsg("No server response");
            }else if(err.response?.status === 401){
                setErrMsg("Incorrect username or password");
            }else if(err.response?.status === 422){
                setErrMsg("Missing username or password");
            }else{
                setErrMsg('Login Failed');
            }
            userRef.current.focus();
        }
        finally{
            setIsSubmit(false);
        }
    }
    return (
        <section>
            <p>
                {errMsg}
            </p>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                </label>
                <input 
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    placeholder="Enter username"
                    required
                />
                <label htmlFor="password">
                    Password:
                </label>
                <input 
                    type="password"
                    id="password"
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    placeholder="Enter password"
                    required
                />
                <button disabled={isSubmit}>Sign in</button>
            </form>
            <p>
                Need an Account?<br/>
                <span>
                    {/* put router link here */}
                    <a href="#">Sign up</a>
                </span>
            </p>
        </section>
    )
}


export default Login;