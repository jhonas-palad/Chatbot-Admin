import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import LinkPage from './components/LinkPage';
import Home from './components/Home';
import IntentUpdate from './components/IntentUpdate';
import IntentNew from './components/IntentNew';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth'
import PersistentLogin from './components/PersistentLogin';
import Chatbot from './components/Chatbot';
import { Routes, Route } from 'react-router-dom';

import IntentList from './components/IntentList';


function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        {/* Public routes */}
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path="linkpage" element={<LinkPage/>} />
        
        {/* Protected routes */}

        <Route element={<PersistentLogin/>}>
          <Route element={ <RequireAuth/> }>
              <Route path="/" element={<Home/>}>
                <Route path= "intent/" exact element={ <IntentList/> }> 
                    <Route path="new" exact element={<IntentNew/>} />
                    <Route path="update/:id" element={<IntentUpdate/>}/>
                </Route>
                <Route path="chatbot" element={<Chatbot/>}/>
              </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Missing/>} />
      </Route>
    </Routes>
  );
}

export default App;
