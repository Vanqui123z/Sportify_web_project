import React, { useState } from "react";
import ConfirmModal from "../user/Modal";

interface HeaderProps {
  username: string;
  userImage?: string;
  onRefreshPage?: () => void;
}


const Header: React.FC<HeaderProps> = ({ username, userImage, onRefreshPage }) => {
  const [modal,setModal] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top border-bottom">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/admin/dashboard">
          <img src="/admin/assets/img/logo.png" width="130" height="40" alt="Logo" className="me-2" />
        </a>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Header Title */}
        <div className="navbar-text d-none d-lg-block">
          <h5 className="mb-0 text-primary fw-bold">Sportify Admin</h5>
        </div>

        {/* Right Menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {/* User Dropdown */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <div className="d-flex align-items-center">
                  {userImage ? (
                    <img 
                      src={`/admin/assets/img/profiles/${userImage}`} 
                      alt="User" 
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                  ) : (
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "32px", height: "32px" }}>
                      <i className="fa fa-user text-primary"></i>
                    </div>
                  )}
                  <span className="d-none d-md-inline">Chào, {username}!</span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="/sportify" onClick={onRefreshPage}>
                    <i className="fa fa-home me-2 text-primary"></i>
                    Về trang chính
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item d-flex align-items-center text-danger" onClick={() => {setModal(true)}}>
                    <i className="fa fa-sign-out-alt me-2"></i>
                    Đăng xuất
                  </a>
                </li>
                <ConfirmModal
                show={modal}
                title="Xác nhận đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất không?"
                onConfirm={() => {
                  setModal(false);
                  window.location.href = "/logout";
                }}
                onCancel={() => setModal(false)}
                />
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
