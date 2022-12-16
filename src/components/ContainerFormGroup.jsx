import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';


function ContainerFormGroup({ errMsg, label, setContainer, buttonClick}) {
    const [input, setInput] = useState('');
    const handleButtonClick = () => {
        buttonClick(input, setContainer);
        setInput('');
    }
    return ( 
        <div className="mb-5 w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label>
                    <strong>Add {label}</strong>
                </Form.Label>
                <Button 
                    type="button"
                    className={`btn-round btn-sm ${input ? '' : 'hidden'}`}
                    onClick={handleButtonClick}>
                        <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>
            <div className="align-self-stretch">
                
                <Form.Control
                    as="textarea"
                    isInvalid={errMsg !== ''}
                    id={`intent-${label}`}
                    cols={150}
                    type="text"
                    autoComplete="off"
                    placeholder={`Enter a ${label}`}
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                />
                <Form.Control.Feedback type="invalid" >
                    {errMsg}
                </Form.Control.Feedback>
            </div>
            
        </div>
     );
}

export const EntityFormGroup = ({
    buttonClick
}) => {
    const [ title, setTitle ] = useState('');
    const [ text, setText ] = useState('');
    const [titleErr, setTitleErr] = useState('');
    const [textErr, setTextErr] = useState('');

    const handleButtonClick = () => {
        let errFlag = true;
        if(!title || /^\s*$/.test(title)){
            setTitleErr('Please provide a title');
            errFlag = true;
        }
        if(!text || /^\s*$/.test(text)){
            setTextErr('Please provide a text response for entity');
            errFlag = true;
        }
        if (!errFlag) return;

        buttonClick(title, text);
        setTitle('');
        setText('');
    }
    return ( 
        <div className="mb-5 w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label>
                    <strong>Add Entity</strong>
                </Form.Label>
                <Button 
                    type="button"
                    className={`btn-round btn-sm ${text && title ? '' : 'hidden'}`}
                    onClick={handleButtonClick}>
                        <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>
            <div className="align-self-stretch">
                <Form.Control
                    className="mb-3"
                    type="text"
                    id="titleID"
                    placeholder="Enter a title"
                    onChange={ (e) => setTitle(e.target.value) }
                    value={title}
                    isInvalid={titleErr !== ''}
                />
                <Form.Control.Feedback type="invalid">
                    {titleErr}
                </Form.Control.Feedback>
                <Form.Control
                    as="textarea"
                    isInvalid={textErr !== ''}
                    id="textID"
                    cols={150}
                    type="text"
                    autoComplete="off"
                    placeholder="Enter a text for this entity"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <Form.Control.Feedback type="invalid" >
                    {textErr}
                </Form.Control.Feedback>
            </div>
            
        </div>
     );
}

export default ContainerFormGroup;
