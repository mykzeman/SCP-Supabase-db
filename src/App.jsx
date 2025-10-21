import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Gallery } from "./components/Gallery.jsx";
import Nav from "./components/Nav.jsx";
import { Footer } from "./components/Footer.jsx";
import ScpDetail from "./components/Full.jsx";

function App() {
  const [isAdmin, setAdmin] = useState(false);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Gallery isAdmin={isAdmin} />} />
        <Route path="/scp/:id" element={<ScpDetail isAdmin={isAdmin} />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
