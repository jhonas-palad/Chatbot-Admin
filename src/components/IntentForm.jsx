import React, { useEffect, useState, useContext } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import uid from 'react-uuid';
import ContainerFormGroup from './ContainerFormGroup';
import IntentContext from '../context/IntentProvider';
import { useParams, useNavigate } from 'react-router-dom';
import ContainerTextPagination from './ContainerTextPagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


const CREATE_URL = '/intent/create';

function IntentForm() {

    const urlParams = useParams();
    const {id} = urlParams;
    const isUpdate = id !== undefined;
    const navigate = useNavigate();

    const GET_URL=`/intent/get/${id}`;
    const UPDATE_URL = `/intent/update/${id}`;
    const DELETE_URL = `/intent/delete/${id}`;

    const [tag, setTag] = useState('');
    const [editTag, setEditTag] = useState(false);

    const { intents, setIntents } = useContext(IntentContext);

    const [intentPattern, setIntentPattern] = useState('');
    const [intentResponse, setIntentResponse] = useState('');
    const [intentFollowUpResponse, setIntentFollowUpResponse] = useState('');

    const [tagErr, setTagErr] = useState('');
    const [intentPatternErr, setIntentPatternErr] = useState('');
    const [intentResponseErr, setIntentResponseErr] = useState('');

    const [intentPatterns, setIntentPatterns] = useState([]);
    const [intentResponses, setIntentResponses] = useState([]);
    const [intentFollowUpResponses, setIntentFollowUpResponses] = useState([]);
    
    const [origTag, setOrigTag] = useState('');
    const [origPatterns, setOrigPatterns] = useState([]);
    const [origResponses, setOrigResponses] = useState([]);
    const [origFollowUpResponses, setOrigFollowUpResponses] = useState([]);

    const [showSaveChanges, setShowSaveChanges] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [alertMsg, setAlertMsg] = useState('');
    const [successFlag, setSuccessFlag] = useState(false);

    const [patternsCurrentPage, setPatternCurrentPage] = useState(1);
    const [responsesCurrentPage, setResponsesCurrentPage] = useState(1);
    const [fupResponsesCurrentPage, setFupResponsesCurrentPage] = useState(1);

    const axiosPrivate = useAxiosPrivate();

    const makeUID = (container) => {
        return container.map( value => ({id: uid(value), value}));
    }
    useEffect(() => {
        const getIntentData = async () => {

            try{
                const response = await axiosPrivate(
                    GET_URL
                );
                const {data} = response?.data;
                const patterns = makeUID(data.patterns);
                const responses = makeUID(data.responses);
                const follow_up_responses = makeUID(data.follow_up_responses);
                setTag(data.tag);
                setIntentPatterns(patterns);
                setIntentResponses(responses);
                setIntentFollowUpResponses(follow_up_responses);

                setOrigTag(data.tag);
                setOrigPatterns(patterns);
                setOrigResponses(responses);
                setOrigFollowUpResponses(follow_up_responses);
                
            }
            catch(err){
                console.log(err);
            }
        }
        isUpdate && getIntentData();

    }, [urlParams]);

    useEffect(()=>{
        
        if(!isUpdate){
            return
        }
        if(origTag.trim() !== tag.trim()){
            console.log(tag);
            console.log(origTag);
            setShowSaveChanges(true);
        }
        else{
            setShowSaveChanges(false);
        }
    }, [tag]);
    useEffect(()=>{
        setIntentPatternErr('');
    },[intentPatterns]);

    useEffect(()=>{
        setIntentResponseErr('');
    },[intentResponses]);

    useEffect(()=>{
        //Reset all pages
        console.log(id);
        setPatternCurrentPage(1);
        setResponsesCurrentPage(1);
        setFupResponsesCurrentPage(1);
    }, [id]);

    const compareContainer = (container1, container2) => {
        const len1 = container1.length;
        const len2 = container2.length;

        return len1 === len2 && container1.every(({value}, index) => {
            return value === container2[index].value; 
        });
    }
    const addText = (input, setInputCallBack, setStateCallback) => {
        if(!input || /^\s*$/.test(input)){
            return;
        }
        const text = { id: uid(input) , value: input.trim() };
        setStateCallback( prev => [text, ...prev]);
        setInputCallBack('');
        isUpdate && setShowSaveChanges(true);
    }
    const handleEditText = (container, setContainer, origContainer) => {
        const editText = (id, newValue) => {
            if(!newValue || /^\s*$/.test(newValue)){
                return;
            }
            const containerCopy = [...container];
            const index = containerCopy.findIndex(value => value.id === id);
            containerCopy[index] = {id, value:newValue.trim()};
            setContainer(containerCopy);
            let same = isUpdate && compareContainer(origContainer, containerCopy);
            isUpdate && same ? setShowSaveChanges(false) : setShowSaveChanges(true);
        }
        return editText;
    }
    const handleRemoveText = (container, setContainer, origContainer) => {
        const removeText = (id) => {
            const containerCopy = [...container];
            const newContainer = containerCopy.filter(value => value.id !== id);
            let same = isUpdate && compareContainer(origContainer, newContainer);
            isUpdate && !same ? setShowSaveChanges(true) : setShowSaveChanges(false);
            setContainer(newContainer);
        }
        return removeText;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const extractValues = (container) => {
            if(isEmptyContainer(container)){
                return false;
            }
            const containerValues = container.map(({value}) => value );
            return containerValues;
        }
        const isEmptyContainer = (container) => {
            return container.length === 0;
        }
        if(!tag || /^\s*$/.test(tag)){
            return;
        }

        const tagValue = tag;
        const intentPatternValues = extractValues(intentPatterns);
        const intentResponsesValues = extractValues(intentResponses);
        let intentFollowUpResponsesValues = extractValues(intentFollowUpResponses);

        if (!intentPatternValues){
            setIntentPatternErr('You should add at least one pattern');
        }
        if (!intentResponsesValues){
            setIntentResponseErr('You should add at least one response');
        }
        if(!intentFollowUpResponsesValues){
            intentFollowUpResponsesValues = [];
        }

        if(!intentPatternValues || !intentResponsesValues){
            return;
        }

        const JSONData = JSON.stringify({
            tag: tagValue,
            patterns: intentPatternValues,
            responses: intentResponsesValues,
            follow_up_responses: intentFollowUpResponsesValues
        });

        const config = {
            url: !isUpdate ? CREATE_URL : UPDATE_URL,
            method: !isUpdate ? 'POST' : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSONData
        }


        try{
            const response = await axiosPrivate(config);
            if(!isUpdate){
                setIntents([response.data.data,...intents])
            }
            else{
                //Update the original data
                const {data} = response?.data;
                const patterns = makeUID(data.patterns);
                const responses = makeUID(data.responses);
                const follow_up_responses = makeUID(data.follow_up_responses);
                
                //Sync the tag name in the list
                if(origTag !== tag){
                    const intentCopy = [...intents];
                    const intent = intentCopy.find(element => element._id === id);
                    intent.tag = data.tag;
                    setIntents(intentCopy);
                }
                setOrigTag(data.tag);
                setOrigPatterns(patterns);
                setOrigResponses(responses);
                setOrigFollowUpResponses(follow_up_responses);
            }
            setSuccessFlag(true);
            setAlertMsg(response.data.description);
        }
        catch(err){
            setSuccessFlag(false);
            setAlertMsg("Error");
        }
        finally{
            setTimeout(()=> setAlertMsg(''), 1500);
            if(isUpdate){
                setShowSaveChanges(false);
                setEditTag(false);
            }
            
        }

    }
    const handleDelete = async (e) => {
        setShowDelete(false);
        try{
            const response = await axiosPrivate.delete(DELETE_URL);
            console.log(response);
            const {description} = response.data;
            setSuccessFlag(false); //To set red background
            setAlertMsg(description);
            const removeIntent = () => {
                return intents.filter(item => item._id !== id);
            }
            const newIntents = removeIntent();
            setIntents(removeIntent());
            navigate(`/intent/update/${newIntents[0]._id}`);
        }
        catch(err){
            setSuccessFlag(false);
            setAlertMsg("Error Delete");
            console.log(err);
        }
        finally{
            setTimeout(()=> setAlertMsg(''), 800);
            if(isUpdate){
                setShowSaveChanges(false);
                setEditTag(false);
            }
        }
    }
    return ( 
        <>
            <Modal 
                show={showDelete} 
                onHide={()=>setShowDelete(false)}
                backdrop='static'
                keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Delete intent</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this intent?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            variant="secondary"
                            onClick={()=>setShowDelete(false)}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={()=>handleDelete()}>
                            Confirm
                        </Button>
                    </Modal.Footer>
            </Modal>

            <div className="w-100 pt-3 pl-5 pr-4 p-2">
                <Alert show={alertMsg !== ''} variant={successFlag ? "success" : "danger"} dismissible>
                    {alertMsg}
                </Alert>
                <form style={{gap:"1.5rem"}}
                    onSubmit={handleSubmit} 
                    className="
                        d-flex 
                        flex-column 
                        h-100">
                    <div className="d-flex justify-content-between">
                        <div>
                            <label htmlFor="tag">
                                <strong>Tag # </strong>
                            </label>
                            <input
                                className="input-underline no-outline"
                                style={{width: '300px'}}
                                id="tag"
                                type="text"
                                autoComplete="off"
                                placeholder="Enter Tag"
                                onChange={(e) => setTag(e.target.value)}
                                value={tag}
                                required
                                disabled={isUpdate && !editTag}
                            />
                        </div>
                        <div style={{gap:"1rem"}}className="d-flex">
                            { showSaveChanges && <Button type="submit">Save Changes</Button>}
                            {
                                !isUpdate ? (
                                    <Button type="submit" variant="success">
                                        Create
                                    </Button>
                                ) : (
                                    <DropdownButton
                                        key="start"
                                        drop="start"
                                        className="dropdown-remove-arrow dropdown-button-elipsis"
                                        title={<FontAwesomeIcon style={{color:'#5b5b5b'}} icon={faEllipsis}/>}>
                                            <Dropdown.Header>
                                                Actions
                                            </Dropdown.Header>
                                            <Dropdown.Item 
                                                eventKey="1" 
                                                as={Button} 
                                                type="button"
                                                onClick={()=> setEditTag(true)}>
                                                    Edit tag
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item 
                                                eventKey="2" 
                                                as={Button} 
                                                type="button"
                                                variant="danger"
                                                onClick={() => setShowDelete(true)}>
                                                    Delete
                                            </Dropdown.Item>
                                    </DropdownButton>
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <Tabs
                            defaultActiveKey="patterns"
                            id="fill-container-intents"
                            className="mb-3"
                            fill>
                            <Tab
                                eventKey="patterns"
                                title="Patterns">
                                <div>
                                    <ContainerFormGroup 
                                        label="Pattern"
                                        inputState={intentPattern}
                                        onChange={setIntentPattern}
                                        setContainer={setIntentPatterns}
                                        buttonClick={addText}
                                        errMsg={intentPatternErr}
                                    />
                                    <ContainerTextPagination
                                        useContainerState ={() => ({
                                            container: intentPatterns, 
                                            setContainer: setIntentPatterns
                                        })}
                                        origContainer = {origPatterns} //Used for editing a particular row
                                        handleEditText={ handleEditText }
                                        handleRemoveText={ handleRemoveText }
                                        setShowSaveChanges={ setShowSaveChanges }
                                        itemsPerPage={ 5 }
                                        useCurrentPageState={()=>({
                                            currentPage: patternsCurrentPage, 
                                            setCurrentPage: setPatternCurrentPage
                                        })}
                                    />
                                </div>
                            </Tab>
                            <Tab
                                eventKey="responses"
                                title="Responses">
                                <div>
                                    <ContainerFormGroup
                                        label="Response"
                                        inputState={intentResponse}
                                        onChange={setIntentResponse}
                                        setContainer={setIntentResponses}
                                        buttonClick={addText}
                                        errMsg={intentResponseErr}
                                    />
                                    <ContainerTextPagination
                                        useContainerState ={() => ({
                                            container: intentResponses, 
                                            setContainer: setIntentResponses
                                        })}
                                        origContainer = {origResponses} //Used for editing a particular row
                                        handleEditText={ handleEditText }
                                        handleRemoveText={ handleRemoveText }
                                        setShowSaveChanges={ setShowSaveChanges }
                                        itemsPerPage={ 5 }
                                        useCurrentPageState={()=>({
                                            currentPage:responsesCurrentPage, 
                                            setCurrentPage:setResponsesCurrentPage
                                        })}
                                    />
                                </div>
                            </Tab>
                            <Tab
                                eventKey="follow_up_responses"
                                title="Follow Up Responses">
                                <div>
                                    <ContainerFormGroup
                                        label="Follow up response"
                                        inputState={intentFollowUpResponse}
                                        onChange={setIntentFollowUpResponse}
                                        setContainer={setIntentFollowUpResponses}
                                        buttonClick={addText}
                                        errMsg=''
                                    />
                                    <ContainerTextPagination
                                        useContainerState ={() => ({
                                            container: intentFollowUpResponses, 
                                            setContainer: setIntentFollowUpResponses
                                        })}
                                        origContainer = {origFollowUpResponses} //Used for editing a particular row
                                        handleEditText={ handleEditText }
                                        handleRemoveText={ handleRemoveText }
                                        setShowSaveChanges={ setShowSaveChanges }
                                        itemsPerPage={ 5 }
                                        useCurrentPageState={()=>({
                                            currentPage:fupResponsesCurrentPage, 
                                            setCurrentPage:setFupResponsesCurrentPage
                                        })}
                                    />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </form>
            </div>
        </>
    );
}

export default IntentForm;
