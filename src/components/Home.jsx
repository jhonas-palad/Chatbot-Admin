import React, {useEffect, useState} from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from '../api/axios';
import useAuth  from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useLogout from '../hooks/useLogout';

const URL_ENDPOINT = '/intent/all';

function Home() {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const logout = useLogout();
    const navigate = useNavigate();
    
    const { auth, setAuth } = useAuth();
    const [intents, setIntents] = useState([]);

    useEffect(() => {
        alert("QWEHQW")
        const getIntents = async () => {
            try {
                const response = await axiosPrivate.get(URL_ENDPOINT);
                const { data } = response.data;
                setIntents([...data]);

            }catch(err){
                console.log(err);
                navigate("/login", {state: {from: location},replace: true})
            }
        }
        getIntents();
    }, []);

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <section>
            <h1>Home</h1>
            <br/>
            <p>Welcome {auth.user}</p>
            <br />
            <Link to="/intent/add">Add Intent</Link>
            <br />
            {
                !intents ? <p>Empty List</p>
                        : (
                        <ul>
                            {
                                intents.map((intent) => 
                                <li key={intent._id}><Link to={`intent/${intent._id}`} _id={intent._id}>{intent.tag}</Link></li>)
                            }
                        </ul>)
            }
            <button onClick={signOut}>Logout</button>

        </section>
    
    );
}

export default Home;