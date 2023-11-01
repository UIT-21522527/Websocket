import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "~/pages/Login";
import Register from "~/pages/Register";
import Chat from "~/pages/Chat";
import SetAvatar from "./components/SetAvartar";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<Login />}/> */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Chat/>}/>
        <Route path="/set-avatar" element={<SetAvatar />} />
      </Routes>
    </Router>
  );
}

export default App;
