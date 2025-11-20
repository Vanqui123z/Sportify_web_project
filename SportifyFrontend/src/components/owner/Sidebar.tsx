import React from "react";
import { NavLink } from "react-router-dom";

const OwnerSidebar: React.FC = () => {
  return (
    <aside
      className="sidebar bg-white shadow-sm border-end position-fixed"
      style={{
        width: "250px",
        height: "100vh",
        top: "70px",
        overflowY: "auto",
      }}
    >
      <div className="sidebar-content p-3">
        <ul className="nav flex-column">
          <li className="nav-item mb-1">
            <NavLink
              to="/owner/dashboard"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Bảng điều khiển
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/owner/fields"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Quản lý sân thể thao
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/owner/bookings"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Lịch đặt sân
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/owner/manager-bookings"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Quản lý sử dụng sân
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/owner/reviews"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Quản lý đánh giá
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/owner/report-bookings"
              className={({ isActive }) =>
                `nav-link py-2 px-3 rounded ${isActive ? "bg-light fw-bold text-primary" : "text-dark"}`
              }
            >
              Báo cáo đặt sân
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
