import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

function EditableText({ text, useEditText, useRemoveText }) {
    const {id, value} = text;
    const [isEdit, setIsEdit] = useState(false);
    const [inputValue, setValue] = useState(value);

    const editText = useEditText();
    const removeText = useRemoveText();

    const handleEdit = () => {
        setIsEdit(true);
    }
    const handleSave = () => {
        setIsEdit(false);
        if(!inputValue){
            setValue(value);
            return;
        }
        value != inputValue && editText(id, inputValue);
        
    }
    const handleRemove = () => {
        removeText(id);
    }
    return (

        <Accordion.Body>
            <FormControl 
                as="textarea"
                rows={5} 
                type="text"
                className="input-underline no-outline"
                value={inputValue}
                onChange={(e) => setValue(e.target.value)}
                disabled={!isEdit}
            />
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