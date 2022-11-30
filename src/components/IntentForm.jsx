import React, { useEffect, useState, useContext } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import uid from 'react-uuid';
import EditableText from './EditableText';
import ContainerFormGroup from './ContainerFormGroup';
import IntentContext from '../context/IntentProvider';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons'

import Accordion  from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


const URL_ENDPOINT = '/intent/create'


function IntentForm({_id}) {
    const id = _id;
    const isUpdate = id !== undefined;
    const INTENT_GET_URL=`/intent/get/${id}`;
    const INTENT_UPDATE_URL = `/intent/update/${id}`;

    const urlParams = useParams();
    const [tag, setTag] = useState('');

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

    const [origPatterns, setOrigPatterns] = useState([]);
    const [origResponses, setOrigResponses] = useState([]);
    const [origFollowUpResponses, setOrigFollowUpResponses] = useState([]);

    const [showSaveChanges, setShowSaveChanges] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const makeUID = (container) => {
            return container.map( value => ({id: uid(value), value}));
        }
        const getIntentData = async () => {

            try{
                const response = await axiosPrivate(
                    INTENT_GET_URL
                );
                const {data} = response?.data;
                const patterns = makeUID(data.patterns);
                const responses = makeUID(data.responses);
                const follow_up_responses = makeUID(data.follow_up_responses);
                setTag(data.tag);
                setIntentPatterns(patterns);
                setIntentResponses(responses);
                setIntentFollowUpResponses(follow_up_responses);
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
        setIntentPatternErr('');
    },[intentPatterns]);

    useEffect(()=>{
        setIntentResponseErr('');
    },[intentResponses]);
    
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
            console.log(same);
            isUpdate && same ? setShowSaveChanges(false) : setShowSaveChanges(true);
        }
        return editText;
    }
    const handleRemoveText = (container, setContainer, origContainer) => {
        const removeText = (id) => {
            const containerCopy = [...container];
            const newContainer = containerCopy.filter(value => value.id !== id);
            let same = isUpdate && compareContainer(origContainer, newContainer);
            console.log("REMOVE" + same);
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
            url: !isUpdate ? URL_ENDPOINT : INTENT_UPDATE_URL,
            method: !isUpdate ? 'POST' : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSONData
        }


        try{
            const response = await axiosPrivate(config);
            !isUpdate && setIntents([response.data.data,...intents]);
        }
        catch(err){
            console.log("ERR Submit");
            console.log(err);
        }

    }
    return ( 
        <>
            <div className="w-100 pt-3 pl-5 pr-4">
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
                            />
                        </div>
                        <div style={{gap:"1rem"}}className="d-flex">
                            { showSaveChanges && <Button type="submit">Save Changes</Button>}
                            {
                                !isUpdate ? (
                                    <Button type="submit" variant="success">
                                        Add
                                    </Button>
                                ) : (
                                    <DropdownButton
                                        key="start"
                                        drop="start"
                                        className="dropdown-remove-arrow"
                                        title={<FontAwesomeIcon icon={faEllipsisVertical}/>}>
                                            <Dropdown.Header>
                                                Actions
                                            </Dropdown.Header>
                                            <Dropdown.Item 
                                                eventKey="1" 
                                                as={Button} 
                                                type="button">
                                                    Edit
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item 
                                                eventKey="2" 
                                                as={Button} 
                                                type="button"
                                                variant="danger">
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
                                    <div 
                                        className="scrollarea" 
                                        style={{height:'700px'}}>
                                        <Accordion>
                                            {
                                                intentPatterns.length <= 0 ? 
                                                <p>Add a patter</p>
                                                        : 
                                                intentPatterns.map( (text, index) => 
                                                    <Accordion.Item eventKey={index.toString()} key={text.id} >
                                                        <Accordion.Header>Pattern #{index + 1}</Accordion.Header>
                                                        <EditableText
                                                            text={text}
                                                            useSaveFlag={() => setShowSaveChanges}
                                                            container={intentPatterns}
                                                            useEditText={() => handleEditText(intentPatterns, setIntentPatterns, origPatterns)}
                                                            useRemoveText={ () => handleRemoveText(intentPatterns, setIntentPatterns, origPatterns)}
                                                        />
                                                    </Accordion.Item>
                                                )
                                            }
                                        </Accordion>
                                    </div>
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
                                    <div>
                                        <Accordion>
                                            {
                                                intentResponses.length <= 0 ? (
                                                <p>Add a Responses</p> 
                                                    ) : (
                                                        intentResponses.map( (text, index) => 
                                                            <Accordion.Item eventKey={index.toString()} key={text.id} >
                                                                <Accordion.Header>Response #{index + 1}</Accordion.Header>
                                                                <EditableText
                                                                    text={text}
                                                                    container={intentResponses}
                                                                    useSaveFlag={() => setShowSaveChanges}
                                                                    useEditText={() => handleEditText(
                                                                        intentResponses, 
                                                                        setIntentResponses, 
                                                                        origResponses)}
                                                                    useRemoveText={ () => handleRemoveText(
                                                                        intentResponses, 
                                                                        setIntentResponses, 
                                                                        origResponses)}
                                                                />
                                                            </Accordion.Item>
                                                    )
                                                )
                                            }
                                        </Accordion>
                                    </div>
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
                                    />
                                    <div>
                                        <Accordion>
                                            {
                                                intentFollowUpResponses.length <= 0 ? (
                                                <p>Add a intentPattern</p>
                                                    ) : (
                                                    intentFollowUpResponses.map( (text, index) => 
                                                        <Accordion.Item eventKey={index.toString()} key={text.id} >
                                                            <Accordion.Header>Follow up response #{index + 1}</Accordion.Header>
                                                                <EditableText
                                                                    text={text}
                                                                    container={intentFollowUpResponses}
                                                                    useSaveFlag={() => setShowSaveChanges}
                                                                    useEditText={() => handleEditText(
                                                                        intentFollowUpResponses, 
                                                                        setIntentFollowUpResponses, 
                                                                        origFollowUpResponses)}
                                                                    useRemoveText={ () => handleRemoveText(
                                                                        intentFollowUpResponses, 
                                                                        setIntentFollowUpResponses, 
                                                                        origFollowUpResponses)}
                                                                />
                                                        </Accordion.Item>
                                                    )
                                                )
                                            }
                                        </Accordion>
                                    </div>
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