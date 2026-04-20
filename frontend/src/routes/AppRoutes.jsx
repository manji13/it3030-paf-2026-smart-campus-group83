import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLES } from '../app/constants';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/member4/LoginPage';
import DashboardPage from '../pages/member4/DashboardPage';
import NotificationPage from '../pages/member4/NotificationPage';
import AuthCallbackPage from '../pages/member4/AuthCallbackPage';
import ResourceListPage from '../pages/member1/ResourceListPage';
import ResourceFormPage from '../pages/member1/ResourceFormPage';
import ResourceDetailsPage from '../pages/member1/ResourceDetailsPage';
import BookingFormPage from '../pages/member2/BookingFormPage';
import MyBookingsPage from '../pages/member2/MyBookingsPage';
import AdminBookingManagementPage from '../pages/member2/AdminBookingManagementPage';
import TicketCreatePage from '../pages/member3/TicketCreatePage';
import TicketListPage from '../pages/member3/TicketListPage';
import TicketDetailPage from '../pages/member3/TicketDetailPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<ResourceListPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetailsPage />} />

          <Route path="/bookings/new" element={<BookingFormPage />} />
          <Route path="/bookings/me" element={<MyBookingsPage />} />

          <Route path="/tickets/new" element={<TicketCreatePage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />

          <Route path="/notifications" element={<NotificationPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<MainLayout />}>
          <Route path="/resources/new" element={<ResourceFormPage mode="create" />} />
          <Route path="/resources/:resourceId/edit" element={<ResourceFormPage mode="edit" />} />
          <Route path="/admin/bookings" element={<AdminBookingManagementPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;