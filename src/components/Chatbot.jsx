import { useState, useEffect } from 'react'
import MessageBox  from './MessageBox'
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';

const BOT = {
    id:99,
    name: 'Asketty'
}

const initialMessages = [
    {member: BOT, text: 'You can test me here on this chat', time: new Date().toLocaleTimeString()},
    {member: BOT, text: 'Hello there!'}
]
const WS_URL = 'ws://139.162.105.247/chat';
const TRAINBOT_URL = '/intent/train_bot';

export const Chatbot = () => {
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);
    const [ messages, setMessages ] = useState([]);
    const [status, setStatus] = useState(0);
    const [alertMsg, setAlertMsg ] = useState({
        heading:'',
        body:''
    });
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
    const handleTrainBot = async () =>{

        const reconnect = () => {
            ws.close();
            setWs(connectWS());
        }
        setIsLoading(true);
        try{
            await axiosPrivate(TRAINBOT_URL, {
                method: 'POST'
            });
            setAlertMsg({heading: 'Yey', body: 'Chatbot successfully trained'});
            setShowAlert(true);
        }
        catch(err){
            
            setAlertMsg({heading: 'Aww', body:'Something went wrong, try again'});
            setShowAlert(true);
        }
        finally{
            setIsLoading(false);
            reconnect();
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
                    isLoading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <>
                            <Toast className="position-absolute" style={{left:'50%', transform:'translate(-50%)', top:'5px'}} delay={3000} autohide show={showAlert} position="top-end" onClose={() => setShowAlert(false)}>
                                <Toast.Header>
                                    <strong className="me-auto">{alertMsg.heading}</strong>
                                </Toast.Header>
                                <Toast.Body>
                                    {alertMsg.body}
                                </Toast.Body>

                            </Toast>

                            <Button 
                                type="button" 
                                onClick={handleTrainBot}>
                                    TrainBot
                            </Button>
                        </>
                    )
                }
            </MessageBox>
        </section>

    )
}

export default Chatbot;