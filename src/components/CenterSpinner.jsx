import Spinner from 'react-bootstrap/Spinner';

export const CenterSpinner = () => {
  return (
    <div 
        className="position-absolute"
        style={{
            top:'50%', left:'50%',
            transform: 'translate(-50%, -50%)'}}>
        <Spinner  animation="border" variant="primary" />
    </div>
  )
}

export default CenterSpinner;