import { createContext, useState } from "react";
const IntentContext = createContext({});


export const IntentProvider = ( {children} ) => {
    const [ intents, setIntents ] = useState([]);
    return (
        <IntentContext.Provider value={{intents, setIntents}}>
            {children}
        </IntentContext.Provider>
    )
}

export default IntentContext;