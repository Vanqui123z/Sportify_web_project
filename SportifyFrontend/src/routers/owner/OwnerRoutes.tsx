import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import OwnerDashboard from "../../Pages/owner/Dashboard";
import OwnerFieldPage from "../../Pages/owner/Field";
import OwnerBookingListPage from "../../Pages/owner/OwnerBookingList";
import OwnerFieldManager from "../../Pages/owner/OwnerFieldManager";
import OwnerReviewManager from "../../Pages/owner/OwnerReviewManager";
import OwnerReportBooking from "../../Pages/owner/OwnerReportBooking";

const OwnerRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<OwnerDashboard />} />
    <Route path="fields" element={<OwnerFieldPage />} />
    <Route path="bookings" element={<OwnerBookingListPage />} />
    <Route path="manager-bookings" element={<OwnerFieldManager />} />
    <Route path="reviews" element={<OwnerReviewManager />} />
    <Route path="report-bookings" element={<OwnerReportBooking />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
