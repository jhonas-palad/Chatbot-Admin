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
import { Routes, Route } from 'react-router-dom';
import {IntentProvider} from './context/IntentProvider';
import axios  from "./api/axios";


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
                <Route path="intent/add" exact element={<IntentNew/>} />
                <Route path="intent/:id" element={<IntentUpdate/>}/>
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
