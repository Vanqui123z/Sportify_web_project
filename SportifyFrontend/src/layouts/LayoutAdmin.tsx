import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import Header from "../components/admin/Header";
import Sidebar from "../components/admin/SideBar";
import { Outlet } from "react-router-dom";

const LayoutAdmin: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "Admin") {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h4>Không có quyền truy cập</h4>
          <p className="text-muted">Bạn không có quyền truy cập trang này.</p>
          <a href="/login" className="btn btn-primary">Đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Header username={user.username} />
      <Sidebar />
      <main style={{ marginLeft: "250px", marginTop: "70px", minHeight: "calc(100vh - 70px)", backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
