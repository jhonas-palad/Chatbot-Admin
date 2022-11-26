import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const Intent = () => {
    const params = useParams();
    useEffect( () => {
        console.log("M<ATHC");
        console.log(params);
    }, [])

    return ( 
        <h1>{params.id}</h1>
     );
}

export default Intent;