import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import MessageBox  from './MessageBox';

import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';

import TrainBotModal from './TrainBotModal'

const BOT = {
    id:99,
    name: 'Asketty'
}

const initialMessages = [
    {member: BOT, text: 'You can test me here on this chat', time: new Date().toLocaleTimeString()},
    {member: BOT, text: 'Hello there!'}
]
const WS_URL = 'ws://127.0.0.1:8000/chat';
const TRAINBOT_URL = '/chatbot/train';
const MODEL_CONFIG_URL = '/chatbot/get_config';

export const Chatbot = () => {
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState(0);
    const [alertMsg, setAlertMsg ] = useState({
        heading:'',
        body:''
    });
    const [showModal, setShowModal] = useState(false);
    const [ modelConfig, setModelConfig] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [ws, setWs] = useState(null);
    const [currUser] = useState({
        id: 1,
        name: 'Jhonas'
    });


    const connectWS = () => {
        const new_ws = new WebSocket(WS_URL);
        return new_ws;
    }

    useEffect(() => {
        const new_ws = connectWS();
        setWs(new_ws);
        setStatus(new_ws.readyState);
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
                return {};
            }
        }
        getModelConfig();
    }, []);

    const createMsg = (text, member) => {
        return {
            member,
            text
        }
    }
    useEffect( ()=>{
        if(ws){
            ws.onopen = (event) => {
                setStatus(1);
                if(messages.length === 0){
                    setMessages(prevState => [...initialMessages, ...prevState])
                }
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
            ws.onclose = (event) => {
                setStatus(2)
            }
            ws.onerror = (event) => {
                setStatus(2)
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
            <MessageBox
                messages = {messages}
                setMessages = {setMessages}
                currentUser = {currUser}
                botUser = {BOT}
                onSend={onSend}
                status={status}
            >
            {
                showModal ? 
                    <TrainBotModal
                        show={showModal}
                        setShow={setShowModal}
                        modelConfig={modelConfig}
                        updateModelConfig={updateModelConfig}
                    /> : (null)
            }
                <div>
                    <Button 
                        
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
            </MessageBox>
        </section>

    )
}

export default Chatbot;