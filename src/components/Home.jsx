import React, {useEffect, useState, useContext} from 'react';
import { Outlet } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import IntentContext from '../context/IntentProvider';

import ListGroup  from 'react-bootstrap/ListGroup';

const URL_ENDPOINT = '/intent/all';

function Home() {

    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const navigate = useNavigate();
    const {pathname} = location;
    const {intents, setIntents } = useContext(IntentContext);
    useEffect(() => {
        console.log(pathname);
        const getIntents = async () => {
            try {
                const response = await axiosPrivate.get(URL_ENDPOINT);
                const { data } = response.data;
                setIntents([...data].reverse());

            }catch(err) {
                console.log(err);
                navigate("/login", {state: {from: location},replace: true})
            }
        }
        getIntents();
    }, []);

    return (
        
        <>
        <div 
            style={{width:'360px'}}
            className="
                d-flex
                flex-column
                align-items-stretch
                flex-shrink-0 ">
            <div className="
                    d-flex
                    align-items-center
                    justify-content-between
                    flex-shrink-0
                    p-3
                    link-dark
                    text-decoration-none
                    border-bottom">
                <span className="fs-5 fw-semibold">
                        List Intent
                </span>
                <Link to="intent/add" variant="success">
                    Add
                </Link>
            </div>
            <div className="
                    list-group 
                    border-bottom 
                    scrollarea">
                {
                    !intents ? (
                        <p>Empty List</p>
                    ) : (
                        intents.map((intent) => 
                        <Link className="
                                d-flex 
                                align-items-center 
                                flex-shrink-0 
                                p-3 
                                link-dark 
                                text-decoration-none 
                                border-bottom" 
                                key={intent._id} 
                                to={`intent/${intent._id}`}>
                            <div className="
                                    d-flex
                                    w-100 
                                    align-items-center 
                                    justify-content-between">
                                <strong className="mb-1">{intent.tag}</strong>
                            </div>
                            
                        </Link>)
                    )
                }
            </div>
        </div>
        {
            pathname === '/' ? (
                <p>You can create and modify intents on the left panel</p> 
            ) : (
                <Outlet/>
            )
        }
        </>
    );
}

export default Home;