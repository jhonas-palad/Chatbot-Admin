import React, { createContext, useState, useEffect } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    useEffect(()=>{
        console.log("AuthProvider: ");
        console.log(auth);
    }, [auth])
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;