import React, {useRef, useState, useEffect} from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';
import axios from '../api/axios';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$]).{8,24}$/;
const REGISTER_URL = '/auth/register';

//TODO
//ERROR MESSAGES 
const Register = () => {
    const userRef = useRef();

    const [NonFreshUsername, setNonFreshUsername] = useState(false);
    const [NoneFreshPWD, setNoneFreshPWD] = useState(false);
    const [NoneFreshMatch, setNoneFreshMatch] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [secretPass, setSecretPass] = useState('');
    const [validSecret, setValidSecret] = useState(true);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState([]);
    const [setSuccess] = useState(false);

    //Set the focus of user input field when the component loads.
    useEffect(() => {
        userRef.current.focus();
    }, []);

    //Validate the username input
    useEffect(()=>{
        user && !NonFreshUsername && setNonFreshUsername(true);
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    //Synchronize pwd and matchPwd every time they changes.
    useEffect(()=>{
        pwd && !NoneFreshPWD && setNoneFreshPWD(true);
        matchPwd && !NoneFreshMatch && setNoneFreshMatch(true);
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        setValidPwd(result);
        const isMatch = matchPwd === pwd;
        setValidMatch(isMatch);
    }, [pwd, matchPwd]);

    //Clear the error messages
    useEffect(()=>{
        setErrMsg([]);
    }, [user, pwd, matchPwd, secretPass]);


 const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedUser = USER_REGEX.test(user);
    const validatedPwd = PWD_REGEX.test(pwd);
    if(!validatedUser || !validatedPwd){
        setErrMsg("Invalid Entry");
        return;
    }
    if(!secretPass){
        setValidSecret(false);
        return;
    }else{
        setValidSecret(true);
    }

    try{
        await axios.post(REGISTER_URL,
                JSON.stringify({
                    username: user,
                    password: pwd, 
                    secret_pass: secretPass
                }),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
        setSuccess(true);
        //clear input fields
    } catch (err){
        let errMessages = [];
        if(!err?.response){
            errMessages.push("No server response");
        }else if (err.response?.status === 409 ){
            const {username, password, secret_pass} = err.response.data;
            username && errMessages.push(<b>{username}</b>)
            password && errMessages.push(<b>{password}</b>)
            secret_pass && errMessages.push(<b>{secret_pass}</b>)
        }else{
            errMessages.push("Registration Failed");
        }
        setErrMsg(errMessages);
    }
 }

return (
    <section className="dflex-center">
        <Form className="form-signup" noValidate onSubmit={handleSubmit}>
            <h1>Register</h1>
            {
                errMsg.length === 0 ? (
                    <></>
                ) : (
                    <Alert variant="danger">
                    {
                        errMsg.map((msg,index) => {
                            if(msg !== ''){
                                return <li style={{listStyle:'none'}} key={index}>{msg}</li>
                            }
                            return null;
                        })
                    }
                    </Alert>
                )
            }
            <Form.Floating className="mb-3">
                <Form.Control 
                    id="username" 
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e)=>setUser(e.target.value)}
                    value={user}
                    placeholder="Enter a username" 
                    required
                    isValid={validName}
                    isInvalid={NonFreshUsername && !validName}
                />
                <label htmlFor="username">
                        Username
                </label>
                    
                <Form.Text id="usernameHelp" muted>
                        Your username must be 4 to 24 characters.
                        Must begin with a letter.
                        Underscores and hyphens allowed.
                </Form.Text>
            </Form.Floating>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    id="passwordInput"
                    autoComplete="off"
                    onChange={(e)=>setPwd(e.target.value)}
                    value={pwd}
                    placeholder="Enter a password"
                    required
                    isValid={validPwd}
                    isInvalid={NoneFreshPWD && !validPwd}
                />
                <label htmlFor="passwordInput">
                    Password
                </label>
                <Form.Text id="passwordHelp" muted>
                    Your password must be 8-20 characters long, Must include
                    uppercase and lowercase letters, a number and a special
                    character Allowed special characters: !@#$
                </Form.Text>
            </Form.Floating>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    id="matchPwdInput"
                    onChange={(e)=>setMatchPwd(e.target.value)}
                    value={matchPwd}
                    autoComplete="off"
                    placeholder="Confirm password"
                    required
                    isValid={validMatch}
                    isInvalid={NoneFreshMatch && !validMatch}
                />
                <label htmlFor="matchPwdInput">
                    Confirm Password
                </label>
                <Form.Control.Feedback className="mb-3 text-justify" type="invalid">
                    <span>
                        <FontAwesomeIcon icon={faInfoCircle}/> Must match the first password input field.
                    </span>
                </Form.Control.Feedback>
            </Form.Floating>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="text"
                    id="secretPass"
                    onChange={(e) => setSecretPass(e.target.value)}
                    value={secretPass}
                    autoComplete="off"
                    placeholder="Enter secret key"
                    isInvalid={!validSecret}
                />
                <label htmlFor="secretPass">
                    Secret Key
                </label>
                <Form.Control.Feedback className="mb-3 text-justify" type="invalid">
                    <span>
                        <FontAwesomeIcon icon={faInfoCircle}/> Please provide a secret key.
                    </span>
                </Form.Control.Feedback>
            </Form.Floating>
            <Button 
                type="submit" 
                className="mb-3 btn-block" 
                disabled={!validName || !validPwd || !validMatch ? true: false}>
                    Sign Up 
            </Button>
            <p className="flex-sb">
                Already Registered? <br/>
                <span className="line">
                    {/* put router link here */}
                    <Link to="/login">Sign in</Link>
                </span>
            </p>
        </Form>
    </section>
  )
}

export default Register;