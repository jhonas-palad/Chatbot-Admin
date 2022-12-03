import { useEffect, useState } from "react";
import useLogout from "../hooks/useLogout";
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faRobot } from '@fortawesome/free-solid-svg-icons'

import Button from 'react-bootstrap/Button';


const INTENT_PATH_REGEX = /^\/intent.*/;
const CHATBOT_PATH_REGEX = /^\/chatbot.*/;

function Sidebar() {

    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');

    useEffect(()=> {
        const { pathname } = location;

        if(INTENT_PATH_REGEX.test(pathname)){
            setActiveLink('intent');
        }
        else if(CHATBOT_PATH_REGEX.test(pathname)){
            setActiveLink('chatbot');
        }
        else{
            setActiveLink('');
        }
    }, [location]);

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return ( 
        <div className="sidebar bg-dark p-3">
            <Link to="/" 
                className="d-flex 
                align-items-center
                text-decoration-none
                text-white">
                    <span className="fs-4">Asketty</span>
            </Link>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto ">
                <li className="nav-item">
                    <Link to="/intent/new" className={`nav-link text-white ${activeLink === 'intent' ? 'active' : ''}`}>
                        <span style={{marginRight: "1rem"}}>
                            <FontAwesomeIcon icon={faBrain} />
                        </span>
                        Intents
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="chatbot" className={`nav-link text-white ${activeLink === 'chatbot' ? 'active' : ''}`}>
                        <span style={{marginRight: "1rem"}}>
                            <FontAwesomeIcon icon={faRobot} />
                        </span>
                        Chatbot
                    </Link>
                </li>
            </ul>
            <hr/>
            <div>
                <Button onClick={signOut} >Logout</Button>
            </div>

        </div>
     );
}

export default Sidebar;