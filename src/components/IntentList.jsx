import React, {useEffect, useState, useContext} from 'react';
import { Outlet } from "react-router-dom";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import IntentContext from '../context/IntentProvider';
import IntentListBar from './IntentListBar';
import MsgBlock from './MsgBlock';

import CenterSpinner from './CenterSpinner';

const URL_ENDPOINT = '/intent/all';

function IntentList() {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const navigate = useNavigate();
    const {pathname} = location;
    const {id} = useParams();
    const [renderList, setRenderList] = useState([]);
    const {intents, setIntents } = useContext(IntentContext);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const getIntents = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate.get(URL_ENDPOINT);
                const { data } = response.data;
                setIntents([...data].reverse());

            }catch(err) {
                if(err?.response?.status === 403){
                    navigate("/login", {state: {from: location},replace: true})
                }
            }
            finally{
                setIsLoading(false);
            }
        }
        getIntents();
    }, []);

    useEffect(()=>{
        const makeList = () => {
            return intents.map((intent) => {
                let active = '';
                if(intent._id === id){
                    active = 'active';
                }
                return (
                <Link className={`
                    list-group-item
                    list-group-item-action
                    py-3
                    lh-m
                    border-0
                    border-bottom
                    rounded-0
                    ${active}`}
                        key={intent._id} 
                        to={`update/${intent._id}`}>
                    <div className="
                            d-flex
                            w-100 
                            align-items-center 
                            justify-content-between">
                        <span className="col-10 mb-1 small">{intent.tag}</span>
                    </div>
                </Link>)
                
            });
        };
        setRenderList(makeList());
    }, [intents, id]);
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
                    isLoading ? (
                        <CenterSpinner/>
                    ) : ( 
                        !renderList ? (
                            <p>Empty List</p>
                        ) : (
                            renderList.map(elem=> elem)
                        )
                    )
                }
                
                
            </IntentListBar>
        </>
     );
}

export default IntentList;