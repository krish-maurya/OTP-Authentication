import React from 'react'
import Login from './components/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import Success from './components/Success';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/dashboard' element={<Success/>}/>
      </Routes>
    </Router>
  )
}
