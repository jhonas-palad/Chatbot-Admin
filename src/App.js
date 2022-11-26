import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import LinkPage from './components/LinkPage';
import Home from './components/Home';
import Intent from './components/Intent';
import IntentAdd from './components/IntentAdd';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth'
import PersistentLogin from './components/PersistentLogin';
import { Routes, Route } from 'react-router-dom';



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
            <Route path="/" element={<Home/>} />
            <Route path="intent/add" exact element={<IntentAdd/>} />
            <Route path="intent/:id" element={<Intent/>}/>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Missing/>} />
      </Route>
    </Routes>
  );
}

export default App;
