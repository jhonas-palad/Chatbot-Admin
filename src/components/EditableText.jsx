import React, { useState } from 'react';

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
        <>
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setValue(e.target.value)}
                disabled={!isEdit}
            />

            <button type="button" onClick={isEdit ? handleSave : handleEdit}>{isEdit ? 'Save' : 'Edit'}</button>
            <button type="button" onClick={handleRemove}>Remove</button>
            
        </>
    );
}

export default EditableText;