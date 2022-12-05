import { useState, useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const MessageInput = ({ onSendMessage }) => {
    const inputRef = useRef();
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        onSendMessage(message);
        inputRef.current.focus();
    }
  return (
    <Form onSubmit={handleSubmit} className="w-100 d-flex p-3 border-top">
        <Form.Control
            style={{
              marginRight:'10px'
            }}
            ref={inputRef}
            className="w-100"
            onChange={e=>setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder='Enter a message'
            autoFocus
        />
        <Button type="submit" >Send</Button>
    </Form>
  )
}
