// Routes.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import RoomsPage from './components/pages/RoomsPage';
import RoomDescriptionPage from './components/pages/RoomDescriptionPage';
import AdminMainPage from './components/pages/AdminMainPage';
import ManageUsersPage from './components/pages/ManageUsersPage';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/rooms" element={<RoomsPage/>} />
        <Route path="/rooms/:id" element={<RoomDescriptionPage/>} />
        <Route path="/admin" element={<AdminMainPage/>} />
        <Route path="/admin/users" element={<ManageUsersPage/>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;