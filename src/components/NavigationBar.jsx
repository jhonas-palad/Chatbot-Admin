import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';

function NavigationBar() {
    const { auth } = useAuth();
    const logout = useLogout();
    const navigate = useNavigate();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    return ( 
        <>
            {
                auth?.access_token ? (
                    <Navbar bg="dark" variant="dark">
                        <div className="container-fluid">
                            <Navbar.Brand href="/">
                                Asketty
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                            <Navbar.Collapse className="justify-content-end">
                                
                                <Navbar.Text style={{marginRight:'10px'}}>
                                    {auth?.user}
                                </Navbar.Text>
                                <Button 
                                    type="button"
                                    onClick={signOut}
                                >
                                Logout
                            </Button>
                            </Navbar.Collapse>
                        </div>
                    </Navbar>
                ) : ( 
                    null
                )
            }
        </>
     );
}

export default NavigationBar;