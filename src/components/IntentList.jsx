import React, {useEffect, useState, useContext} from 'react';
import { Outlet } from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import IntentContext from '../context/IntentProvider';
import IntentListBar from './IntentListBar';
import MsgBlock from './MsgBlock';
const URL_ENDPOINT = '/intent/all';

function IntentList() {
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
            {
                pathname == '/intent/'? (
                    <MsgBlock msg="You can create and modify intents on the left panel" />
                ) : (
                    <Outlet/>
                )
            }
            <IntentListBar>
                {
                    !intents ? (
                        <p>Empty List</p>
                    ) : (
                        intents.map((intent) => 
                        <Link className="
                            list-group-item
                            list-group-item-action
                            py-3
                            lh-m
                            border-0
                            border-bottom"
                                key={intent._id} 
                                to={`update/${intent._id}`}>
                            <div className="
                                    d-flex
                                    w-100 
                                    align-items-center 
                                    justify-content-between">
                                <span className="mb-1">{intent.tag}</span>
                            </div>
                            
                        </Link>)
                    )
                }
            </IntentListBar>
        </>
     );
}

export default IntentList;