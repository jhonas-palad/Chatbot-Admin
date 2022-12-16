import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

const EditableEntity = ({ 
    entity, 
    editEntity, 
    useRemoveText
}) => {
    const {id, text, title} = entity;
    const [isEdit, setIsEdit] = useState(false);
    const [titleInput, setTitleInput] = useState(title);
    const [textInput, setTextInput] = useState(text);

    const removeText = useRemoveText();

    const handleEdit = () => {
        setIsEdit(true);
    }
    const handleSave = () => {
        setIsEdit(false);
        if(!titleInput){
            setTitleInput(title);
        }
        if(!textInput){
            setTextInput(text);
        }
        if(title !== titleInput || text !== textInput){
            editEntity(id, {newTitle: titleInput, newText:textInput});
        }
    }
    const handleRemove = () => {
        removeText(id);
    }
    return (

        <Accordion.Body>
            <FormControl
                type="text"
                className = "input-underline no-outline"
                value={titleInput}
                onChange={(e)=>setTitleInput(e.target.value)}
                disabled={!isEdit}
            />
            <FormControl 
                as="textarea"
                rows={5} 
                type="text"
                className="input-underline no-outline"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
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

export default EditableEntity;