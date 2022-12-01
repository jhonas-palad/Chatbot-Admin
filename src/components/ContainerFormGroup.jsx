import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function ContainerFormGroup({ errMsg, label, inputState, onChange, setContainer, buttonClick}) {

    return ( 
        <div className="mb-5 w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label>
                    <strong>Add {label}</strong>
                </Form.Label>
                <Button 
                    type="button"
                    className={`btn-round btn-sm ${inputState ? '' : 'hidden'}`}
                    onClick={() => buttonClick(
                            inputState, 
                            onChange, 
                            setContainer)}>
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
                    onChange={(e) => onChange(e.target.value)}
                    value={inputState}
                />
                <Form.Control.Feedback type="invalid" >
                    {errMsg}
                </Form.Control.Feedback>
            </div>
            
        </div>
     );
}

export default ContainerFormGroup;