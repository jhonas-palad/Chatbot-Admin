import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';



function ContainerFormGroup({ errMsg, label, inputState, onChange, setContainer, buttonClick}) {

    return ( 
        <div className="mb-5 d-flex justify-content-between align-items-center w-100">
            <div className="align-self-stretch">
                <p>{errMsg}</p>
                <label htmlFor={`intent-${label}`}>
                    <strong>Add {label} #</strong>
                </label>
                <input
                    id={`intent-${label}`}
                    className="input-underline no-outline"
                    style={{width: '300px'}}
                    type="text"
                    autoComplete="off"
                    placeholder={`Enter a ${label}`}
                    onChange={(e) => onChange(e.target.value)}
                    value={inputState}
                />
            </div>
            <div>
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
        </div>
     );
}

export default ContainerFormGroup;