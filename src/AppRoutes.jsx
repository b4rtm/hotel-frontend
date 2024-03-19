// Routes.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import RoomsPage from './components/pages/RoomsPage';
import RoomDescriptionPage from './components/pages/RoomDescriptionPage';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/rooms" element={<RoomsPage/>} />
        <Route path="/rooms/:id" element={<RoomDescriptionPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;