import React, { useState, useRef } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { isAllAlphaNumeric } from '../utils/validators';

function EditableText({ alphaNumeric, text, useEditText, useRemoveText}) {
    const {id, value} = text;
    const [isEdit, setIsEdit] = useState(false);
    const [inputValue, setValue] = useState(value);
    const [inputErr, setInputErr] = useState('');

    const inputRef = useRef(null);
    const editText = useEditText();
    const removeText = useRemoveText();

    const handleEdit = () => {
        setIsEdit(true);
    }
    const handleSave = () => {
        
        if(!inputValue){
            setValue(value);
            return;
        }
        
        if(alphaNumeric){
            if(!isAllAlphaNumeric(inputValue)){
                console.log(alphaNumeric);
                setInputErr('Only include alphanuemric values');
                inputRef.current.focus();
                return;
            }else{
                setInputErr('');
            }
        }
        setIsEdit(false);
        value !== inputValue && editText(id, inputValue);
        
    }
    const handleRemove = () => {
        removeText(id);
    }
    return (

        <Accordion.Body>
            <Form.Control 
                as="textarea"
                rows={5} 
                type="text"
                className="input-underline no-outline"
                value={inputValue}
                onChange={(e) => setValue(e.target.value)}
                disabled={!isEdit}
                isInvalid={inputErr !== ''}
                ref={inputRef}
            />
            <Form.Control.Feedback type="invalid" >
                {inputErr}
            </Form.Control.Feedback>
            <div style={{gap:"1rem"}}className="mt-3 d-flex justify-content-end">
                <Button type="button" variant={isEdit ? 'success':'primary'} onClick={isEdit ? handleSave : handleEdit}>
                    
                    {isEdit ? 'Save' : 'Edit'}
                </Button>
                <Button type="button" variant="danger" onClick={handleRemove}>
                    Remove
                </Button>
            </div>
            
            
        </Accordion.Body>
    );
}

export default EditableText;