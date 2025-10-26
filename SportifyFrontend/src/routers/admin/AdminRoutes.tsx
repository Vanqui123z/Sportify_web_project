import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../Pages/admin/Dashboard";
import AccountPage from "../../Pages/admin/Account";
import BookingPage from "../../Pages/admin/Booking";
import ProductPage from "../../Pages/admin/Product";
import FieldPage from "../../Pages/admin/Field";
import EventPage from "../../Pages/admin/Event";
import VoucherPage from "../../Pages/admin/Voucher";
import ContactPage from "../../Pages/admin/Contact";
import OrderProductPage from "../../Pages/admin/OrderProduct";
import CategoryProductPage from "../../Pages/admin/CategoryProduct";
import CategorySportPage from "../../Pages/admin/CategorySport";
import ReportBookingPage from "../../Pages/admin/ReportBooking";
import ReportOrderPage from "../../Pages/admin/ReportOrder";
import CommentPage from "../../Pages/admin/Comment";
import FieldManager from "../../Pages/admin/FieldManager";
import OrderManager from "../../Pages/admin/OrderManager";
import AiSupportPage from "../../Pages/admin/AISupport";

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="accounts" element={<AccountPage />} />
    <Route path="bookings" element={<BookingPage />} />
    <Route path="/manager-bookings" element={<FieldManager />} />
    <Route path="/manager-orders" element={<OrderManager />} />
    <Route path="products" element={<ProductPage />} />
    <Route path="fields" element={<FieldPage />} />
    <Route path="events" element={<EventPage />} />
    <Route path="vouchers" element={<VoucherPage />} />
    <Route path="contacts" element={<ContactPage />} />
    <Route path="comments" element={<CommentPage />} />
    <Route path="order-products" element={<OrderProductPage />} />
    <Route path="category-product" element={<CategoryProductPage />} />
    <Route path="category-sport" element={<CategorySportPage />} />
    <Route path="reportBooking" element={<ReportBookingPage />} />
    <Route path="reportOrder" element={<ReportOrderPage />} />
    <Route path="ai-support" element={<AiSupportPage />} />
  </Routes>
);

export default AdminRoutes;
