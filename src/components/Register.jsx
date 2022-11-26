import React, {useRef, useState, useEffect} from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from '../api/axios';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$]).{8,24}$/;
const REGISTER_URL = '/auth/register';


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [secretPass, setSecretPass] = useState('');

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState([]);
    const [success, setSuccess] = useState(false);


    //Set the focus of user input field when the component loads.
    useEffect(() => {
        userRef.current.focus();
    }, []);

    //Validate the username input
    useEffect(()=>{
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    //Synchronize pwd and matchPwd every time they changes.
    useEffect(()=>{
        const result = PWD_REGEX.test(pwd);
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
    try{
        const response = await axios.post(REGISTER_URL,
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
            errMessages.push(username ?? "");
            errMessages.push(password ?? "");
            errMessages.push(secret_pass ?? "");
        }else{
            errMessages.push("Registration Failed");
        }
        setErrMsg(errMessages);
    }
 }

  return (
    <>
    {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ):(
        <section>
            <p ref={errRef}>
                {
                    errMsg.map((msg,index) => {
                        if(msg !== ''){
                            return <li key={index}>{msg}</li>
                        }
                    })
                }<br/>
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <span className={validName ? "valid": "hide"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validName || !user ? "hide": "invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e)=>setUser(e.target.value)}
                    value={user}
                    required
                    onFocus={()=>setUserFocus(true)}
                    onBlur={()=>setUserFocus(false)}
                />
                <p id="uidnote">
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    4 to 24 characters.<br/>
                    Must begin with a letter.<br/>
                    Letters, numbers, underscores, hyphens allowed.
                </p>

                <label htmlFor="password">
                    Password:
                    <span className={validPwd ? "valid": "hide"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validPwd || !pwd ? "hide": "invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={(e)=>setPwd(e.target.value)}
                    value={pwd}
                    required
                    onFocus={()=>setPwdFocus(true)}
                    onBlur={()=>setPwdFocus(false)}
                />
                <p id="pwdnote">
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    8 to 24 characters.<br/>
                    Must include uppercase and lowercase letters, a number and a special character<br/>
                    Allowed special characters: <span>!</span><span>@</span><span>#</span><span>$</span>
                </p>

                <label htmlFor="match_pwd">
                    Confirm Password:
                    <span className={validMatch && matchPwd ? "valid": "hide"}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </span>
                    <span className={validMatch || !matchPwd ? "hide": "invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>
                <input
                    type="password"
                    id="match_pwd"
                    onChange={(e)=>setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    onFocus={()=>setMatchFocus(true)}
                    onBlur={()=>setMatchFocus(false)}
                />
                <p id="matchnote">
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must match the first password input field.
                </p>
                <label htmlFor="secret_pass">
                    Secret Pass:
                </label>
                <input
                    type="text"
                    id="secret_pass"
                    required
                    onChange={(e) => setSecretPass(e.target.value)}
                    value={secretPass}
                />
                <button disabled={!validName || !validPwd || !validMatch ? true: false}>Sign Up </button>
                <p>
                    Already Registered? <br/>
                    <span className="line">
                        {/* put router link here */}
                        <a href="#">Sign in</a>
                    </span>
                </p>
            </form>
        </section>
    )}
    </>
  )
}

export default Register;