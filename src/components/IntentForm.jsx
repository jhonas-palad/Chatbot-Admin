import React, { useEffect, useState, useContext } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import uid from 'react-uuid';
import ContainerFormTab from './ContainerFormTab';
import ContainerPagination from './ContainerPagination';
import {EntityFormGroup} from './ContainerFormGroup';

import IntentContext from '../context/IntentProvider';
import { useParams, useNavigate, useLocation } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import CenterSpinner from './CenterSpinner';

import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form  from 'react-bootstrap/Form';
import EditableEntity from './EditableEntity';


const CREATE_URL = '/intent/create';

function IntentForm() {

    const urlParams = useParams();
    const {id} = urlParams;
    const isUpdate = id !== undefined;
    const navigate = useNavigate();
    const location = useLocation();

    const GET_URL=`/intent/get/${id}`;
    const UPDATE_URL = `/intent/update/${id}`;
    const DELETE_URL = `/intent/delete/${id}`;

    const [tag, setTag] = useState('');
    const [editTag, setEditTag] = useState(false);

    const { intents, setIntents } = useContext(IntentContext);

    const [intentPattern, setIntentPattern] = useState('');
    const [intentResponse, setIntentResponse] = useState('');
    const [intentEntityTitle, setIntentEntityTitle ] = useState('');
    const [intentEntityText, setIntentEntityText ] = useState('');

    const [intentPatternErr, setIntentPatternErr] = useState('');
    const [intentResponseErr, setIntentResponseErr] = useState('');

    const [intentPatterns, setIntentPatterns] = useState([]);
    const [intentResponses, setIntentResponses] = useState([]);
    const [intentEntities, setIntentEntities] = useState([]);

    const [origTag, setOrigTag] = useState('');
    const [origPatterns, setOrigPatterns] = useState([]);
    const [origResponses, setOrigResponses] = useState([]);
    const [origEntities, setOrigEntities] = useState([]);
    

    const [showSaveChanges, setShowSaveChanges] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [alertMsg, setAlertMsg] = useState('');
    const [successFlag, setSuccessFlag] = useState(false);

    const [patternsCurrentPage, setPatternCurrentPage] = useState(1);
    const [responsesCurrentPage, setResponsesCurrentPage] = useState(1);
    const [entitiesCurrentPage, setEntitiesCurrentPage] = useState(1);

    const [currentPatternElements, setCurrentPatternElements] = useState([]);
    const [currentResponseElements, setCurrentResponseElements ] = useState([]);
    const [currentEntityElements, setCurrentEntityElements] = useState([]);

    const [ isLoading, setIsLoading ] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const makeUID = (container, destructure = false) => {
        if(!container){
            return [];
        }

        return container.map( value => {
            if(destructure){
                return {
                    id: uid(value),
                    ...value
                }
            }
            else {
                return {
                    id: uid(value),
                    value
                }
            }
        });
    }
    useEffect(() => {
        const getIntentData = async () => {
            setIsLoading(true);
            try{
                const axios_response = await axiosPrivate(
                    GET_URL
                );
                
                const {data} = axios_response?.data;
                const patterns = makeUID(data.patterns);
                const responses = makeUID(data.responses);
                const entities = makeUID(data.entities, true);
                console.log(entities);
                setTag(data.tag);
                setIntentPatterns(patterns);
                setIntentResponses(responses);
                setIntentEntities(entities);

                setOrigTag(data.tag);
                setOrigPatterns(patterns);
                setOrigResponses(responses);
                setOrigEntities(entities);
            }
            catch(err){
                let errMsg = '';
                let needAuth = false;
                console.log(err);
                if(!err?.response){
                    errMsg = "No response from the server, make sure you have network connection"
                }
                else if(err.response?.status === 403){
                    errMsg = "Authentication is needed";
                    needAuth = true;
                }
                else{
                    errMsg = `Intent with id ${id} missing, you may remove this intent if you wish to.`;
                }
                    setAlertMsg(errMsg);
                    needAuth && navigate('/login', {state: {from: location}});
                }
            finally{
                setTimeout(()=> setAlertMsg(''), 1500);
                setIsLoading(false);
            }
        }
        isUpdate && getIntentData();

    }, [urlParams]); //eslint-disable-line

    useEffect(()=>{
        
        if(!isUpdate){
            return
        }
        if(origTag.trim() !== tag.trim()){
            setShowSaveChanges(true);
        }
        else{
            setShowSaveChanges(false);
        }
    }, [tag]); //eslint-disable-line
    
    useEffect(()=>{
        setIntentPatternErr('');
    },[intentPatterns]);

    useEffect(()=>{
        setIntentResponseErr('');
    },[intentResponses]);
    useEffect(()=>{
        console.log(intentEntities);
        console.log(origEntities);
    }, [intentEntities]);
    useEffect(()=>{
        //Reset all pages
        setPatternCurrentPage(1);
        setResponsesCurrentPage(1);
        setEntitiesCurrentPage(1);
    }, [id]);

    const compareContainer = (container1, container2) => {
        const len1 = container1.length;
        const len2 = container2.length;
        return len1 === len2 && container1.every(({value}, index) => {
            return value === container2[index].value; 
        });
    }
    const addText = (input, setStateCallback) => {
        console.log(input);
        if(!input || /^\s*$/.test(input)){
            return;
        }
        const text = { id: uid(input) , value: input.trim() };
        setStateCallback( prev => [text, ...prev]);
        isUpdate && setShowSaveChanges(true);
    }
    const addEntity = (title, text) => {
        title = title.trim();
        text = text.trim();
        setIntentEntities(prev => [{id: uid(title), title, text}, ...prev]);
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
            if(isUpdate){
                same ? setShowSaveChanges(false) : setShowSaveChanges(true);
            }
        
        }
        return editText;
    }
    const handleEditEntity = (id, {newTitle, newText}) => {
        const entitiesCopy = [...intentEntities];
        const index = entitiesCopy.findIndex(value => value.id === id);
        const prevState = entitiesCopy[index];
        const {title, text} = prevState;
        if(!newTitle || /^\s*$/.test(newTitle)){
            newTitle = title;
        }
        if(!newText || /^\s*$/.test(newText)){
            newText = text;
        }
        
        if(newTitle === title && newText === text){
            return;
        }
        const newObj = {...prevState, title:newTitle.trim(), text:newText.trim()};
        entitiesCopy[index] = newObj;
        setIntentEntities(entitiesCopy);
        
        let same = isUpdate && origEntities.every((element,index) => JSON.stringify(element) === JSON.stringify(entitiesCopy[index]));
        if(isUpdate){
            same ? setShowSaveChanges(false) : setShowSaveChanges(true);
        }

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

        if (!intentPatternValues){
            setIntentPatternErr('You should add at least one pattern');
        }
        if (!intentResponsesValues){
            setIntentResponseErr('You should add at least one response');
        }

        if(!intentPatternValues || !intentResponsesValues){
            return;
        }

        const JSONData = JSON.stringify({
            tag: tagValue,
            patterns: intentPatternValues,
            responses: intentResponsesValues,
            entities: intentEntities
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
                const entities = makeUID(data.entities, true);
                
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
                setOrigResponses(entities);
            }
            setSuccessFlag(true);
            setAlertMsg(response.data.description);
        }
        catch(err){
            setSuccessFlag(false);
            let errMsg = '';
            let needAuth = false;
            if(!err?.response){
                errMsg = "No response from the server, make sure you have internet connection"
            }
            else if(err.response?.status === 403){
                errMsg = "Authentication is needed";
                needAuth = true;
            }
            else{
                errMsg = 'Something went wrong, try again';
            }
            setAlertMsg(errMsg);
            needAuth && navigate('/login', {state: {from: location}});
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
        }
        finally{
            setTimeout(()=> setAlertMsg(''), 1500);
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
                {
                    isLoading ? (
                        <CenterSpinner/>
                    ) : (
                <>
                <Alert show={alertMsg !== ''} variant={successFlag ? "success" : "danger"}>
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
                            className={`mb-3 
                                ${intentPatternErr ? 'invalid-btn-tab-patterns': ''} 
                                ${intentResponseErr ? 'invalid-btn-tab-responses': ''}`}
                            fill>
                            <Tab
                                eventKey="patterns"
                                title="Patterns">
                                    <ContainerFormTab
                                        useFormGroupProps={ ()=>({
                                            label:"Pattern",
                                            buttonClick:addText,
                                            errMsg: intentPatternErr,
                                            setShowSaveChanges
                                        })}
                                        useContainerState = {()=>({
                                            container: intentPatterns,
                                            origContainer: origPatterns,
                                            setContainer: setIntentPatterns
                                        })}
                                        itemsPerPage={ 5 }
                                        useCurrentPageState={()=>({
                                            currentPage: patternsCurrentPage,
                                            currentElements: currentPatternElements,
                                            setCurrentPage: setPatternCurrentPage,
                                            setCurrentElements: setCurrentPatternElements 
                                        })}
                                        useEditTextCallback={()=>({
                                            handleEditText,
                                            handleRemoveText
                                        })}
                                    />
                            </Tab>
                            <Tab
                                eventKey="responses"
                                title="Responses">
                                    <ContainerFormTab
                                        useFormGroupProps={ ()=>({
                                            label:"Responses",
                                            buttonClick: addText,
                                            errMsg: intentResponseErr,
                                            setShowSaveChanges
                                        })}
                                        useContainerState = {()=>({
                                            container: intentResponses,
                                            origContainer: origResponses,
                                            setContainer: setIntentResponses
                                        })}
                                        itemsPerPage={ 5 }
                                        useCurrentPageState={()=>({
                                            currentPage: responsesCurrentPage,
                                            currentElements: currentResponseElements,
                                            setCurrentPage: setResponsesCurrentPage,
                                            setCurrentElements: setCurrentResponseElements 
                                        })}
                                        useEditTextCallback={()=>({
                                            handleEditText,
                                            handleRemoveText
                                        })}
                                    />
                            </Tab>
                            <Tab
                                eventKey="entities"
                                title="Entities">
                                    <EntityFormGroup
                                        buttonClick={addEntity}
                                    />
                                    <ContainerPagination
                                        container={intentEntities}
                                        itemsPerPage={5}
                                        useCurrentPageState={()=>({
                                            currentPage: entitiesCurrentPage,
                                            currentElements: currentEntityElements,
                                            setCurrentPage: setEntitiesCurrentPage,
                                            setCurrentElements: setCurrentEntityElements
                                        })}
                                    >
                                        {   currentEntityElements.length === 0 ? <p>Add an entity</p>: (
                                            currentEntityElements.map((entity, index) => 
                                                <Accordion.Item eventKey={index.toString()} key={entity.id}>
                                                    <Accordion.Header
                                                        className='w-100'>
                                                            <span style={{maxWidth:'450px', fontWeight:'300'}} className="d-inline-block text-truncate">
                                                                Title: {entity.title}
                                                            </span>
                                                    </Accordion.Header>
                                                    <EditableEntity
                                                        entity={
                                                            {
                                                                id: entity.id,
                                                                text: entity.text,
                                                                title: entity.title
                                                            }
                                                        }
                                                        editEntity={handleEditEntity}
                                                        useRemoveText={() => handleRemoveText(intentEntities, setIntentEntities, origEntities)}
                                                    />

                                                </Accordion.Item>
                                            ))

                                        }
                                    </ContainerPagination>
                                
                            </Tab>
                        </Tabs>
                    </div>
                </form>
                </>
                )
            }
            </div>
        </>
    );
}

export default IntentForm;
