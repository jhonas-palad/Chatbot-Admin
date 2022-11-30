import { useParams } from "react-router-dom";
import IntentForm from "./IntentForm";

const IntentUpdate = () => {
    const { id } = useParams();
    return ( 
        <IntentForm _id={id}/>
     );
}

export default IntentUpdate;