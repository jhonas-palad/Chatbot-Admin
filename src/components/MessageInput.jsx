import { useState, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const MessageInput = ({ onSendMessage }) => {
    const inputRef = useRef();
    const [inputInvalid, setInputInvalid] = useState(false);
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!message || /^\s*$/.test(message)){
          setInputInvalid(true);
          return;
        }
        
        setMessage('');
        onSendMessage(message);
        inputRef.current.focus();
    }
    const handleOnChange = (e) => {
      setInputInvalid(false);
      setMessage(e.target.value);
    }
  return (
    <Form onSubmit={handleSubmit} className="w-100 d-flex p-3 border-top">
        <Form.Control
            style={{
              marginRight:'10px'
            }}
            ref={inputRef}
            className="w-100"
            onChange={handleOnChange}
            value={message}
            type="text"
            placeholder='Enter a message'
            autoFocus
            isInvalid={inputInvalid}
        />
        <Button type="submit" >Send</Button>
    </Form>
  )
}
