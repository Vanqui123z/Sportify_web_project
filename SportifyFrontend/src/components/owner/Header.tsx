import React, { useState } from "react";
import ConfirmModal from "../user/Modal";

interface HeaderProps {
  username: string;
}

const OwnerHeader: React.FC<HeaderProps> = ({ username }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/owner/fields">
          <img src="/admin/assets/img/logo.png" width="130" height="40" alt="Logo" className="me-2" />
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#ownerNavbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-text d-none d-lg-block">
          <h5 className="mb-0 text-primary fw-bold">Sportify Field Owner</h5>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="ownerNavbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <i className="fa fa-user text-primary"></i>
                  </div>
                  <span className="d-none d-md-inline">Chào, {username}!</span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="/sportify">
                    <i className="fa fa-home me-2 text-primary"></i>
                    Về trang người dùng
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center text-danger"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <i className="fa fa-sign-out-alt me-2"></i>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <ConfirmModal
        show={showLogoutModal}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        onConfirm={() => {
          setShowLogoutModal(false);
          window.location.href = "/logout";
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </nav>
  );
};

export default OwnerHeader;
