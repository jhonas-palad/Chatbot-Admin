import { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import '../css/trainbotmodal.css';



const TrainBotModal = ({modelConfig, updateModelConfig, show, setShow}) => {
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
    const [isTrainingProgress, setIsTrainingProgress] = useState(false);
    const [trainingPercent, setTrainingPercent] = useState(0);
    const [trainingLog, setTrainingLog] = useState("Training Log");
    const [isConnecting, setIsConnecting] = useState(false);
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
        const setInitalChanges = () => {
            setIsConnecting(true);
            setChangesMade(false);
            setTrainingLog("Connecting...");
            setLogMessages([]);
        }

        setInitalChanges();
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
            setIsTrainingProgress(true);
        }
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data?.msg){
                msgList.push(data.msg);
                setLogMessages([...msgList]);
            }
            if(data?.percent_complete){
                setTrainingPercent(data.percent_complete);
            }
            if (data?.num_epochs) {
                updateModelConfig({...modelConfig, ...data});
            }
        }
        ws.onclose = (e) => {
            disableToggleHelper(false);
            setIsTrainingProgress(false);
            setIsConnecting(false);
            setTrainingPercent(0);
        }
        ws.onerror = (e) => {
            setTrainingLog("Failed to connect, Try again");
        }
    }

    const handleClose = () => !isTrainingProgress && setShow(false);

    return (
        <Modal
            show={show}
            size="xl"
            centered
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <span style={{fontSize: "1.5rem"}} className="display-4">Configuration</span>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className="col-7 log-area p-0  dflex-center position-relative">
                        
                        {
                            logMessages.length > 0 ? (
                                <pre style={{height:"400px", background: "#eeeeee"}} className="scrollarea position-inherit w-100 align-self-start m-0 p-1">
                                    {logMessages.map((value, index) => `${index + 1}: ${value} \n`)}
                                </pre>
                            ) : (
                                <p>{trainingLog}</p>
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
                {
                    isTrainingProgress ? (<ProgressBar
                        className='w-100'
                        striped
                        variant='info'
                        now={trainingPercent}
                        animated
                    /> ) : (
                        <>
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
                                {
                                    isConnecting ? (
                                        <>
                                            <Spinner
                                            as="span"
                                            size='sm'
                                            animation='border'
                                            style={{marginRight:"10px"}}
                                            />
                                            Connecting...
                                        </>
                                    ) : (
                                        <span>Save & train</span>
                                    )
                                }
                                
                            </Button>
                        
                            </div>
                        </>
                    )
                }
            </Modal.Footer>
        </Modal>
    )
}

export default TrainBotModal