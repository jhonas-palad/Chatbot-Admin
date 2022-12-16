import { useCallback } from 'react';
import { MessageInput } from './MessageInput';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import uuid from 'react-uuid';
const MessageBox = ({ messages,setMessages, botUser,currentUser, onSend, children, status }) => {
    const handleOptionClick = ({title, text}) => {
        setMessages(prevState => {
            const msg = {
                text: title,
                member:currentUser,
                time: new Date().toLocaleTimeString()
            }
            const response = {
                text,
                member:botUser,
                time: new Date().toLocaleTimeString()
            }
            return [response,msg, ...prevState];
        });

    }

    const renderMessage = useCallback((message) => {
        const { member, text, options} = message;
        const time = message?.time;
        const messageFromMe = member.id === currentUser.id;
        
        const className = messageFromMe ? 
            "justify-content-end" : "justify-content-start";
        return(
            <div key={uuid()} className={`d-flex flex-row ${className} align-items-center`}>
                <div className="d-flex flex-column ">
                    <pre style={{ maxWidth:'500px'}}className={`small p-3 mb-${time && !options ? '0': '1'} text-white ${!time ? 'rounded-4' : messageFromMe ? 'rounded-msg-self-last' : 'rounded-msg-other-last'} bg-${messageFromMe ? 'primary': 'warning'}`}>
                        {text}
                    </pre>
                    {
                        options ?  options.map(option => 
                                <Button key={uuid()} 
                                    variant="secondary"
                                    onClick={()=> handleOptionClick(option)}
                                    className="mb-1">
                                        {option.title}
                                </Button>
                                ) : (
                            <></>
                        )
                    }
                    <span 
                        className={`align-self-${messageFromMe ? 'end' : 'start'}`}
                        style={{
                            fontWeight:'300',
                            fontSize:'0.75rem'
                    }}>
                                {time ?? ''}
                    </span>
                </div>
            </div>
        )
    }, [messages]); //eslint-disable-line
    const getStatusMsg = () => {
        let msg = '';
        let className = ''
        if (status === 0){
            msg = 'Connecting';
            className = 'text-primary';
        }else if (status === 1){
            msg = 'Connected';
            className = 'text-success';
        }else if (status === 2){
            msg = 'Disconnected'
            className = 'text-danger';
        }
        return (
        <p 
            style={{
                fontWeight:'300',
                fontSize:'0.75rem'}}
            className={className}>
            {msg}
        </p>
        );
    }
    return (
        <div className="container">
            
                <Card className="p-0">
                    <Card.Title 
                        className="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <div>
                            <h5 className="mb-0">Asketty</h5>
                            
                            {getStatusMsg()}
                            
                        </div>
                        {children}
                    </Card.Title>
                    <Card.Body 
                        className="scrollarea d-flex flex-column flex-column-reverse" 
                        style={{position:"relative", height:"500px"}}>
                        {
                            messages.map(message => renderMessage(message))
                            
                        }
                    </Card.Body>
                    <MessageInput
                            onSendMessage={onSend}
                    />
                </Card>
        </div>
    )
}

export default MessageBox;