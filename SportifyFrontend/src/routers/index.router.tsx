// AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./admin/AdminRoutes";
import HomeRouter from "./user/HomeRouter";
import Layout from "../layouts/Layout";
import HomePage from "../Pages/user/home/HomePage";
import ForgetPass from "../Pages/security/ForgetPass";
import Login from "../Pages/security/Login";
import Register from "../Pages/security/Register";
import { AuthProvider } from "../utils/AuthContext";
import LayoutAdmin from "../layouts/LayoutAdmin";
import PaymentResult from "../Pages/user/checkout/PaymentResult";
const AppRouter = () => (
  <Router>
    <AuthProvider>
      <Routes>
        {/* Auth routes - nằm ngoài layout chính */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/forgotpassword" element={<ForgetPass />} />

        {/* Layout chính cho sportify */}
        <Route path="/sportify/*" element={<Layout />}>
          <Route path="*" element={<HomeRouter />} />
        </Route>

        {/* Admin site */}
        <Route path="admin/*" element={<LayoutAdmin />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        <Route path="payment-result" element={<PaymentResult />} />


        {/* Trang fallback */}
        <Route path="*" element={<Navigate to="/sportify" replace />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default AppRouter;
