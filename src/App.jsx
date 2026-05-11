import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SkillExchange from "./pages/SKillExchange";  
import Profile from "./pages/Profile";  
import Community from "./pages/Community";  
import './App.css'; 

function App() {
  
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skill-exchange" element={<SkillExchange />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;