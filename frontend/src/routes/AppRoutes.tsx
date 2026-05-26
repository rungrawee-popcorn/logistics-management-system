import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import OrdersPage from '../pages/OrdersPage'
import TrackingPage from '../pages/TrackingPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'
import NotFoundPage from '../pages/NotFoundPage'

import RoleGuard from './RoleGuard'

import {
  AdminLayout,
  RiderLayout,
  CustomerLayout,
} from '../layouts/MainLayout'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        {/* ADMIN */}
        <Route
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/tracking" element={<TrackingPage />} />
        </Route>

        {/* RIDER */}
        <Route
          element={
            <RoleGuard allowedRoles={['RIDER']}>
              <RiderLayout />
            </RoleGuard>
          }
        >
          <Route path="/rider/orders" element={<OrdersPage />} />
          <Route path="/rider/tracking" element={<TrackingPage />} />
        </Route>

        {/* CUSTOMER */}
        <Route
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <CustomerLayout />
            </RoleGuard>
          }
        >
          <Route path="/customer/orders" element={<OrdersPage />} />
          <Route path="/customer/tracking" element={<TrackingPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes