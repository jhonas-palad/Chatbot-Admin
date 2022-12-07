import React, {useRef, useState, useEffect} from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useNavigate} from 'react-router-dom';
import axios from '../api/axios';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Spinner  from "react-bootstrap/Spinner";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$]).{8,24}$/;
const REGISTER_URL = '/auth/register';
const NAME_REGEX = /^[a-zA-Z\ ]+$/; //eslint-disable-line

//TODO
//ERROR MESSAGES 
const Register = () => {
    const userRef = useRef();

    const navigate = useNavigate();
    const [freshSubmit, setFreshSubmit] = useState(true);

    const [firstName, setFirstName ] = useState('');
    const [ validFirstName, setValidFirstName ] = useState(false);

    const [lastName, setLastName ] = useState('');
    const [ validLastName, setValidLastName ] = useState(false);

    const [username, setUserName] = useState('');
    const [validUsername, setValidUsername] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [secretPass, setSecretPass] = useState('');
    const [validSecret] = useState(true);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errMsg, setErrMsg] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    //Set the focus of user input field when the component loads.
    useEffect(() => {
        userRef.current.focus();
    }, []);

    //Validate the username input
    useEffect(()=>{
        if(!freshSubmit){
            const result = USER_REGEX.test(username);
            setValidUsername(result);
        }   
    }, [username, freshSubmit]);
    useEffect(()=>{
        if(!freshSubmit){
            const result = NAME_REGEX.test(firstName);
            setValidFirstName(result);
        }   
    }, [firstName, freshSubmit]);
    useEffect(()=>{
        if(!freshSubmit){
            const result = NAME_REGEX.test(lastName);
            setValidLastName(result);
        }   
    }, [lastName, freshSubmit]);


    //Synchronize pwd and matchPwd every time they changes.
    useEffect(()=>{
        if(!freshSubmit){
            const result = PWD_REGEX.test(pwd);
            setValidPwd(result);
            const isMatch = matchPwd === pwd;
            setValidMatch(isMatch);
        }
    }, [pwd, matchPwd, freshSubmit]);

    //Clear the error messages
    useEffect(()=>{
        setErrMsg([]);
    }, [username, pwd, matchPwd, secretPass]);

    const isDisabledBtn = () => {
        return  !username || 
                !pwd || 
                !matchPwd || 
                !secretPass ||
                !firstName ||
                !lastName;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validatedUsername = USER_REGEX.test(username);
        const validatedPwd = matchPwd === pwd && PWD_REGEX.test(pwd);
        const validatedFirstName = NAME_REGEX.test(firstName);
        const validatedLastName = NAME_REGEX.test(lastName);

        // setValidFirstName(validatedFirstName);
        // setValidLastName(validatedLastName);
        // setValidUsername(validatedUsername);
        // setValidPwd(validatedPwd);

        if(!validatedUsername  || 
            !validatedPwd       || 
            !validatedFirstName || 
            !validatedLastName){
            setFreshSubmit(false);
            setErrMsg(["Some fields are invalid"]);
            return;
        }

        const clearInputFields = () => {
            setFirstName('');
            setLastName('');
            setUserName('');
            setPwd('');
            setMatchPwd('');
            setSecretPass('');
        }
        try{
            setIsLoading(true);
            await axios.post(REGISTER_URL,
                    JSON.stringify({
                        username: username,
                        password: pwd, 
                        secret_pass: secretPass,
                        full_name:`${firstName} ${lastName}`
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
            clearInputFields();
            navigate('/login');
        } catch (err){
            let errMessages = [];
            setFreshSubmit(false);
            console.log(err);
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
        finally{
            setIsLoading(false);
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
            <Row>
                <Col>
                    <Form.Floating className="mb-3">
                        <Form.Control 
                            id="firstName" 
                            type="text"
                            autoComplete="off"
                            onChange={(e)=>setFirstName(e.target.value)}
                            value={firstName}
                            placeholder="Enter your first name" 
                            required
                            className={freshSubmit ? '' : validFirstName ? 'is-valid': 'is-invalid'}
                        />
                        <label htmlFor="username">
                                First Name
                        </label>
                    </Form.Floating>
                </Col>
                <Col>
                <Form.Floating className="mb-3">
                    <Form.Control 
                        id="lastName" 
                        type="text"
                        autoComplete="off"
                        onChange={(e)=>setLastName(e.target.value)}
                        value={lastName}
                        placeholder="Enter your last name" 
                        required
                        className={freshSubmit ? '' : validLastName ? 'is-valid': 'is-invalid'}
                    />
                    <label htmlFor="username">
                            Last Name
                    </label>
                </Form.Floating>
                </Col>
            </Row>
            <Form.Floating className="mb-3">
                
                <Form.Control 
                    id="username" 
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e)=>setUserName(e.target.value)}
                    value={username}
                    placeholder="Enter a username" 
                    required
                    className={freshSubmit ? '' : validUsername ? 'is-valid': 'is-invalid'}
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
                    className={freshSubmit ? '' : validPwd ? 'is-valid': 'is-invalid'}
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
                    className={freshSubmit ? '' : validMatch ? 'is-valid': 'is-invalid'}
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
                disabled={isDisabledBtn() || isLoading}>
                    {
                        isLoading ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"/>
                        ) : (
                            'Sign Up'
                        )
                    }
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