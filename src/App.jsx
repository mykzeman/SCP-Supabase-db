import { useState } from 'react';
import { Routes, Route , Link} from 'react-router-dom';
import { Gallery } from "./components/Gallery.jsx";
import { Footer } from "./components/Footer.jsx";
import ScpDetail from "./components/Full.jsx";
import Form from './components/Form.jsx';
function App() {
  const [isAdmin, setAdmin] = useState(false);
    const [mode, setMode] = useState(null);

  return (
    <>
          {isAdmin&&(<div id='admin-notify'>You are Admin</div>)}
    <nav>

      <h1>SCP Database</h1>
        <ul>
         <li><Link to={"/"}>Home</Link></li>
         {isAdmin&&(<li onClick={()=> {setMode("create")}}><Link to={'/admin'} >Create</Link></li>)}
         
         <li><button className='admin-tog' onClick={()=> {setAdmin(prev=>!prev)}}></button></li>
            
            </ul>
    </nav>
      <Routes>
        <Route path="/" element={<Gallery isAdmin={isAdmin} mode={mode} setMode={setMode} />} />
        <Route path="/admin/:id" element={<Form  mode={mode} setMode={setMode}/> } />
        <Route path="/admin/" element={<Form  mode={mode} setMode={setMode}/> } />
        <Route path="/scp/:id" element={<ScpDetail isAdmin={isAdmin} mode={mode} setMode={setMode} />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
