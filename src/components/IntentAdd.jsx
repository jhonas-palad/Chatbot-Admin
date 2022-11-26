import React, { useEffect, useState, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import uuid from 'react-uuid';
import EditableText from './EditableText';


const URL_ENDPOINT = '/intent/create'

function IntentAdd() {

    const [tag, setTag] = useState('');

    const [intentPattern, setIntentPattern] = useState('');
    const [intentResponse, setIntentResponse] = useState('');
    const [intentFollowUpResponse, setIntentFollowUpResponse] = useState('');

    const [tagErr, setTagErr] = useState('');
    const [intentPatternErr, setIntentPatternErr] = useState('');
    const [intentResponseErr, setIntentResponseErr] = useState('');

    const [intentPatterns, setIntentPatterns] = useState([]);
    const [intentResponses, setIntentResponses] = useState([]);
    const [intentFollowUpResponses, setIntentFollowUpResponses] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(()=>{
        setIntentPatternErr('');
    },[intentPatterns]);

    useEffect(()=>{
        setIntentResponseErr('');
    },[intentResponses]);


    const addText = (input, setInputCallBack, setStateCallback) => {
        if(!input || /^\s*$/.test(input)){
            return;
        }
        const text = { id: uuid() , value: input.trim() };
        setStateCallback( prev => [text, ...prev]);
        setInputCallBack('');
    }
    const handleEditText = (container, setContainer) => {
        const editText = (id, newValue) => {
            if(!newValue || /^\s*$/.test(newValue)){
                return;
            }
            const containerCopy = [...container];
            const index = containerCopy.findIndex(value => value.id === id);
            containerCopy[index] = {id, value:newValue.trim()};
            setContainer(containerCopy);

        }
        return editText;
    }
    const handleRemoveText = (container, setContainer) => {
        const removeText = (id) => {
            const containerCopy = [...container];
            const newContainer = containerCopy.filter(value => value.id !== id);
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

        try{
            const response = await axiosPrivate.post(
                URL_ENDPOINT,
                JSONData,
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            );
            console.log(response.data);
        }
        catch(err){
            console.log("ERR Submit");
            console.log(err);
        }

    }
    return ( 
        <>
        <section>
            <h1>Intent Add page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="tag">
                    Tag:
                </label>
                <input
                    id="tag"
                    type="text"
                    autoComplete="off"
                    placeholder="Enter Tag"
                    onChange={(e) => setTag(e.target.value)}
                    value={tag}
                    required
                />
                <div>
                    <p>{intentPatternErr}</p>
                    <label htmlFor="intentPattern">
                        Pattern:
                    </label>
                    <input
                        id="intentPattern"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter intentPattern"
                        onChange={(e) => setIntentPattern(e.target.value)}
                        value={intentPattern}
                    />
                    <button type="button" onClick={() => addText(intentPattern, setIntentPattern, setIntentPatterns)}>Add intentPattern</button>
                    <div>
                        <ul>
                            {
                                intentPatterns.length <= 0 ? 
                                <p>Add a intentPattern</p>
                                         : 
                                intentPatterns.map( text => 
                                    <li key={text.id}>
                                        <EditableText
                                            text={text}
                                            container={intentPatterns}
                                            useEditText={() => handleEditText(intentPatterns, setIntentPatterns)}
                                            useRemoveText={ () => handleRemoveText(intentPatterns, setIntentPatterns)}
                                        />
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div>
                    <p>{intentResponseErr}</p>
                    <label htmlFor="response">
                        Response:
                    </label>
                    <input
                        id="Response"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Response"
                        onChange={(e) => setIntentResponse(e.target.value)}
                        value={intentResponse}
                    />
                    <button type="button" onClick={() => addText(intentResponse, setIntentResponse, setIntentResponses)}>Add Response</button>
                    
                    <div>
                        <ul>
                            {
                                intentResponses.length <= 0 ? 
                                <p>Add a Responses</p>
                                        : 
                                        intentResponses.map( text => 
                                    <li key={text.id}>
                                        <EditableText
                                            text={text}
                                            container={intentResponses}
                                            useEditText={() => handleEditText(intentResponses, setIntentResponses)}
                                            useRemoveText={ () => handleRemoveText(intentResponses, setIntentResponses)}
                                        />
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div>
                    
                    <label htmlFor="intentFollowUpResponse">
                        Follow Up response:
                    </label>
                    <input
                        id="intentFollowUpResponse"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter intentFollowUpResponse"
                        onChange={(e) => setIntentFollowUpResponse(e.target.value)}
                        value={intentFollowUpResponse}
                    />
                    <button type="button" onClick={() => addText(intentFollowUpResponse, setIntentFollowUpResponse, setIntentFollowUpResponses)}>Add intentPattern</button>
                    <div>
                        <ul>
                            {
                                intentFollowUpResponses.length <= 0 ? 
                                <p>Add a intentPattern</p>
                                    : 
                                intentFollowUpResponses.map( text => 
                                    <li key={text.id}>
                                        <EditableText
                                            text={text}
                                            container={intentFollowUpResponses}
                                            useEditText={() => handleEditText(intentFollowUpResponses, setIntentFollowUpResponses)}
                                            useRemoveText={ () => handleRemoveText(intentFollowUpResponses, setIntentFollowUpResponses)}
                                        />
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>
        </section>
        </>
     );
}

export default IntentAdd;