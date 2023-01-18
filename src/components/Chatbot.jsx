import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";

import MessageBox  from './MessageBox';
import SmallAlert from './SmallAlert';

import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

import TrainBotModal from './TrainBotModal'
import { API_URL, WS_URL } from '../api/axios';


const CHAT_URL = WS_URL + '/chat';
const MODEL_CONFIG_URL = API_URL + '/chatbot/get_config';

const BOT = {
    id:99,
    name: 'Asketty'
}

const initialMessages = [
    {member: BOT, text: 'You can test me here on this chat', time: new Date().toLocaleTimeString()},
    {member: BOT, text: 'Hello there!'}
]

const createMsg = (text, member) => ({ member, text });
const connectWS = () => (new WebSocket(CHAT_URL));

export const Chatbot = () => {
    const {full_name} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [messages, setMessages] = useState([]);
    const [webSocketState, setWebSocketState] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [ modelConfig, setModelConfig] = useState(null);
    const [trainErrMsg, setTrainErrMsg] = useState('');
    const [ws, setWs] = useState(null);
    const [currUser] = useState({
        id: 1,
        name: full_name
    });

    useEffect(() => {
        const new_ws = connectWS();
        setWs(new_ws);
        setWebSocketState(new_ws.readyState);
        return () => {
            if(new_ws && new_ws.readyState === 1){
                new_ws.close()
            }
        }
    }, []);
    useEffect(()=>{
        const getModelConfig = async () => {
            try{
                const {data} = await axiosPrivate(MODEL_CONFIG_URL);
                console.log(data);
                setModelConfig(data);
            }
            catch(err){
                setModelConfig(null);
            }
        }
        getModelConfig();
    }, [axiosPrivate]);

    useEffect( ()=>{
        if(ws){
            ws.onopen = () => {
                setWebSocketState(1);
                if(messages.length === 0){
                    setMessages(prevState => [...initialMessages, ...prevState])
                }
                setTrainErrMsg('');
            }
            
            ws.onmessage = ({data}) => {
                const {text, options} = JSON.parse(data);
     
                setMessages(prevState => {
                    const newMsgs = text.map((value, index)=> {
                        let msg = createMsg(value,BOT);
                        if(index === 0){
                            msg.time = new Date().toLocaleTimeString();
                        }
                        
                        if (options){
                            let optionTitles = Object.keys(options);
                            const optionList = optionTitles.map((title)=> ({title, text:options[title]['text']}))
                    
                            msg.options = optionList;
                        }
                         
                        return msg;
                    })
                    return [...newMsgs, ...prevState]
                });
            }
            ws.onclose = () => {
                setWebSocketState(2);
            }
            ws.onerror = (event) => {
                setTrainErrMsg('Server is unvailable at this moment. Refresh the page to try again');
                setWebSocketState(2);
            }
            
        }
        return () => {
            if (ws && ws.readyState === 1){
                ws.close();
            }
        }
    }, [ws]); //eslint-disable-line

    const updateModelConfig = (data) => {
        setModelConfig(data);
        setWs(connectWS());
    }

    const onSend = (chatInput) => {
        const message = {
            type: 'msg',
            text:chatInput,
            member:currUser,
            time: new Date().toLocaleTimeString()
        }
        const {text} = message;
        setMessages(prevState => [message,...prevState]);
        if(ws.readyState === 1){
            ws.send(text);
        }else{
            setWs(connectWS());
        }
    }

    return (
        <section className="d-flex flex-column justify-content-center align-items-center">
           {
                showModal && modelConfig ? 
                    <TrainBotModal
                        show={showModal}
                        setShow={setShowModal}
                        modelConfig={modelConfig}
                        updateModelConfig={updateModelConfig}
                    /> : (
                        null
                    )
            }
           <MessageBox
                messages = {messages}
                setMessages = {setMessages}
                currentUser = {currUser}
                botUser = {BOT}
                onSend={onSend}
                status={webSocketState}
            >
                <div>
                    <Button 
                        disabled={trainErrMsg}
                        type="button" 
                        onClick={()=> setShowModal(true)}>
                            <span style={{marginRight:'8px'}}>
                                TrainBot
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faGears}/>

                            </span>
                    </Button>
                </div>
                {
                    trainErrMsg ? (
                        <SmallAlert alertMsg={trainErrMsg}/>
                    ) : (null)
                }
                
            </MessageBox>
        </section>

    )
}

export default Chatbot;