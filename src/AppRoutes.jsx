// Routes.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import BookingHistoryPage from './components/pages/BookingHistoryPage';
import ContactPage from './components/pages/ContactPage';
import LoginPage from './components/pages/LoginPage';
import MainPage from './components/pages/MainPage';
import RegisterPage from './components/pages/RegisterPage';
import RoomDescriptionPage from './components/pages/RoomDescriptionPage';
import RoomsPage from './components/pages/RoomsPage';
import SummaryPage from './components/pages/SummaryPage';
import AdminMainPage from './components/pages/admin/AdminMainPage';
import ManageBookingsPage from './components/pages/admin/ManageBookingsPage';
import ManageRoomsPage from './components/pages/admin/ManageRoomsPage';
import ManageSchedulesPage from './components/pages/admin/ManageSchedulesPage';
import ManageStaffPage from './components/pages/admin/ManageStaffPage';
import ManageUsersPage from './components/pages/admin/ManageUsersPage';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/rooms" element={<RoomsPage/>} />
        <Route path="/rooms/:id" element={<RoomDescriptionPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/booking-history/:userId" element={<BookingHistoryPage/>} />
        <Route path="/summary/:bookingId" element={<SummaryPage/>} />
        <Route path="/admin" element={<AdminMainPage/>} />
        <Route path="/admin/users" element={<ManageUsersPage/>} />
        <Route path="/admin/rooms" element={<ManageRoomsPage/>} />
        <Route path="/admin/bookings" element={<ManageBookingsPage/>} />
        <Route path="/admin/staff" element={<ManageStaffPage/>} />
        <Route path="/admin/schedules" element={<ManageSchedulesPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;