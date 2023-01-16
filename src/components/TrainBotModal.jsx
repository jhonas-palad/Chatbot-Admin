import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import '../css/trainbotmodal.css';



const TrainBotModal = ({modelConfig, updateModelConfig, show, onHide}) => {
    const {
        num_epochs, 
        number_of_epochs_min,
        number_of_epochs_max,
        learning_rate,
        learning_rate_min,
        learning_rate_max,
        hidden_layer_size,
        hidden_layer_size_min,
        hidden_layer_size_max,
        loss
    } = modelConfig;
    const makeValMinMax = (value, min, max) => ({value, min, max})

    const [logMessages, setLogMessages] = useState([]);
    const [learningRate, setLearningRate] = useState(
        makeValMinMax(
            learning_rate, 
            learning_rate_min, 
            learning_rate_max)
        );
    const [numEpochs, setNumEpochs] = useState(
        makeValMinMax(
            num_epochs, 
            number_of_epochs_min, 
            number_of_epochs_max)
        );
    const [hiddenLayerSize, setHiddenLayerSize] = useState(
        makeValMinMax(
            hidden_layer_size, 
            hidden_layer_size_min, 
            hidden_layer_size_max)
        );

    const [learningRateDisabled, setLearningRateDisabled] = useState(false);
    const [numEpochsDisabled, setNumEpochsDisabled] = useState(false);
    const [hiddenLayerSizeDisabled, setHiddenLayerSizeDisabled] = useState(false);
    
    const [changesMade, setChangesMade] = useState(false);

    useEffect(() => {
        if(learningRate.value !== learning_rate 
            || numEpochs.value !== num_epochs || hiddenLayerSize.value !== hidden_layer_size) {
                setChangesMade(true);
        }
        else{
            setChangesMade(false);
        }
    }, [learningRate, numEpochs, hiddenLayerSize]);

    const handleResetConfig = (e) => {
        setNumEpochs({...numEpochs, value: num_epochs})
        setLearningRate({...learningRate, value: learning_rate})
        setHiddenLayerSize({...hiddenLayerSize, value: hidden_layer_size})
    }

    const handleSaveTrain = (e) => {
        const disableToggleHelper = (state) => {
            setLearningRateDisabled(state);
            setNumEpochsDisabled(state);
            setHiddenLayerSizeDisabled(state);
        }
        setChangesMade(false);
        const ws = new WebSocket('ws://127.0.0.1:8000/chatbot/train');
        const dataConf = JSON.stringify({
            learning_rate: learningRate.value,
            num_epochs: numEpochs.value,
            hidden_layer_size: hiddenLayerSize.value
        });
        const msgList = [];
        ws.onopen = (e) => {
            disableToggleHelper(true);
            ws.send(dataConf);
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data?.msg){
                msgList.push(data.msg);
                setLogMessages([...msgList]);
            }
            if (data?.num_epochs) {
                updateModelConfig({...modelConfig, ...data});
            }
        }
        ws.onclose = (e) => {
            disableToggleHelper(false);
        }
    }

    return (
        <Modal
            show={show}
            size="xl"
            centered
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <span style={{fontSize: "1.5rem"}} className="display-4">Configuration</span>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div style={{height:"400px"}} className="col-7 log-area pr-0 dflex-center position-relative">
                        {
                            logMessages.length > 0 ? (
                                <pre style={{height:"100%"}} className="scrollarea position-inherit w-100 align-self-start mt-1">
                                    {logMessages.map((value, index) => `${index + 1}: ${value} \n`)}
                                </pre>
                            ) : (
                                <p>Console Log</p>
                            )
                        }
                        
                        
                    </div>
                    <div className="col">
                        <div className='mb-2 border-bottom pb-2'>
                            <Form.Label>Hidden Layer size: {hiddenLayerSize.value}</Form.Label>
                            <Form.Range 
                                value={hiddenLayerSize.value} 
                                min={hiddenLayerSize.min} max={hiddenLayerSize.max} 
                                onChange={({target}) => setHiddenLayerSize({...hiddenLayerSize, value: parseInt(target.value)})}
                                disabled={hiddenLayerSizeDisabled}
                                />
                            <div className="d-flex justify-content-between">
                                <small>{hiddenLayerSize.min}</small><small>{hiddenLayerSize.max}</small>
                            </div>
                        </div>

                        <div className='mb-2 border-bottom pb-2'>
                        
                            <Form.Label>Learning Rate: {learningRate.value}</Form.Label>
                            <Form.Range 
                                value={learningRate.value} 
                                min={learningRate.min} max={learningRate.max} 
                                step={0.001}
                                onChange={({target}) => setLearningRate({...learningRate, value:parseFloat(target.value)})}
                                disabled={learningRateDisabled}
                                />
                            <div className="d-flex justify-content-between">
                                <small>{learningRate.min}</small><small>{learningRate.max}</small>
                            </div>
                        </div>
                        
                        
                        <div className='mb-2'>
                            <Form.Label>Number of epochs: {numEpochs.value}</Form.Label>
                            <Form.Range 
                                value={numEpochs.value} 
                                min={numEpochs.min} max={numEpochs.max} 
                                step={1000} 
                                onChange={({target}) => setNumEpochs({...numEpochs, value:parseInt(target.value)})}
                                disabled={numEpochsDisabled}
                                />
                            <div className="d-flex justify-content-between">
                                <small>{numEpochs.min}</small><small>{numEpochs.max}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
                <div>
                    <p style={{fontSize: "0.9rem"}} className="mb-0 mt-0 ">Previous Loss: {loss.toFixed(4)}</p>
                </div>
                <div className='d-flex gap-1'>
                    {
                        changesMade && <Button 
                                onClick={handleResetConfig}
                                variant="secondary">
                                Reset config
                            </Button>
                    }
                    
                    <Button
                        onClick={handleSaveTrain}
                    >
                        Save & train
                    </Button>
                    
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default TrainBotModal