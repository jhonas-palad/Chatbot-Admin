import Alert from 'react-bootstrap/Alert';


const SmallAlert = ({alertMsg,border=true ,variant="danger"}) => {
    const className = `p-1 mb-0 text-center ${border ? `border border-${variant}`: ''} rounded-0`;
    return (
        <Alert
            style={{boxShadow: "0px 5px 10px 0px rgba(0,0,0,0.15)"}}
            variant={variant}
            className={className}>
            {alertMsg}
        </Alert>
    )
}

export default SmallAlert;