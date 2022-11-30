import React, {useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import axios from '../api/axios';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

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
            console.log(err);
            if(!err.response){
                setErrMsg(<b>No server response</b>);
            }else if(err.response?.status === 401){
                setErrMsg(<b>Incorrect username or password</b>);
            }else if(err.response?.status === 422){
                setErrMsg(<b>Missing username or password</b>);
            }else{
                setErrMsg(<b>Something went worng</b>);
            }
            userRef.current.focus();
        }
        finally{
            setIsSubmit(false);
        }
    }
    return (
        <section className="dflex-center">
        <Form onSubmit={handleSubmit} className="text-center form-signin">
            <h1 className="h3 mb-3 font-weight-normal" >Sign in</h1>
            {
                errMsg ? (
                <Alert style={{textAlign:"initial"}} className="mb-3 " variant='danger'>
                        {errMsg}
                </Alert>
                ) : (
                    <></>
                )
            }
            
                <FloatingLabel
                    className="mb-3"
                    controlId="usernameInput"
                    label="Username"
                >
                    <Form.Control 
                        type="text"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="Enter username"
                        value={user}
                        required
                    />
                </FloatingLabel>
                <FloatingLabel 
                    className="mb-3"
                    controlId="passwordInput"
                    label="Password"
                >
                    <Form.Control
                        type="password"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        placeholder="Enter password"
                        required
                    />
                </FloatingLabel>
                <Button type="submit" className="btn-lg btn-block mb-3" disabled={isSubmit}>Sign in</Button>
            <p className="flex-sb">
                Need an Account? 
                <span>
                    {/* put router link here */}
                    <Link to="/register">Sign up</Link>
                </span>
            </p>
            </Form>
        </section>
    )
}


export default Login;