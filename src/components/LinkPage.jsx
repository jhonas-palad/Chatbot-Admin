import React from "react";
import { Link } from "react-router-dom";
const LinkPage = () => {
    return ( 
        <section>
            <h1>This is the LinkPage Page</h1>
            <br/>
            <Link to="/login">Sign in</Link>
        </section>
     );
}

export default LinkPage;