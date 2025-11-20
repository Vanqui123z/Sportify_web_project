import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
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
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-tachometer-alt me-3 text-primary"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-store me-3 text-success"></i>
              <span>Sản phẩm</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/admin/fields"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-futbol me-3 text-warning"></i>
              <span>Sân thể thao</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/admin/accounts"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-users-cog me-3 text-info"></i>
              <span>Quản lý tài khoản</span>
            </NavLink>
          </li>


          <li className="nav-item mb-1">
            <NavLink
              to="/admin/field-owner-requests"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-users-cog me-3 text-info"></i>
              <span>Quản lý chủ sân</span>
            </NavLink>
          </li>

          <li className="nav-item mb-1">
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-newspaper me-3 text-danger"></i>
              <span>Tin tức & Sự kiện</span>
            </NavLink>
          </li>

          {/* Dropdown Menu - Khác */}
          <li className="nav-item mb-1">
            <div className="accordion" id="otherAccordion">
              <div className="accordion-item border-0">
                <h6 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center py-2 px-3 rounded text-dark nav-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#otherMenu"
                  >
                    <span>Khác</span>
                    <span className="caret-indicator">▾</span>
                  </button>
                </h6>
                <div
                  id="otherMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#otherAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="nav flex-column ms-4">
                      <li className="nav-item">
                        <NavLink
                          to="/admin/vouchers"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-gift me-3 text-primary"></i>
                          <span>Mã giảm giá</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/contacts"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-comments me-3 text-success"></i>
                          <span>Liên hệ</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/comments"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-comments me-3 text-success"></i>
                          <span>Quản lý bình luận</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Dropdown Menu - Quản lý phiếu đặt */}
          <li className="nav-item mb-1">
            <div className="accordion" id="bookingAccordion">
              <div className="accordion-item border-0">
                <h6 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center py-2 px-3 rounded text-dark nav-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#bookingMenu"
                  >
                    <span>Quản lý phiếu đặt</span>
                    <span className="caret-indicator">▾</span>
                  </button>
                </h6>
                <div
                  id="bookingMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#bookingAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="nav flex-column ms-4">
                      <li className="nav-item">
                        <NavLink
                          to="/admin/bookings"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Lịch đặt sân</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/manager-bookings"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Quản lí đặt sân </span>
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          to="/admin/order-products"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-receipt me-3 text-success"></i>
                          <span>Đơn hàng</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/manager-orders"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Quản lí đơn hàng  </span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Dropdown Menu - Quản lý thể loại */}
          <li className="nav-item mb-1">
            <div className="accordion" id="categoryAccordion">
              <div className="accordion-item border-0">
                <h6 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center py-2 px-3 rounded text-dark nav-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#categoryMenu"
                  >
                    <span>Quản lý thể loại</span>
                    <span className="caret-indicator">▾</span>
                  </button>
                </h6>
                <div
                  id="categoryMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#categoryAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="nav flex-column ms-4">
                      <li className="nav-item">
                        <NavLink
                          to="/admin/category-product"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-tshirt me-3 text-primary"></i>
                          <span>Loại sản phẩm</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/category-sport"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-running me-3 text-success"></i>
                          <span>Loại thể thao</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/* Dropdown Menu - Báo cáo thống kê */}
          <li className="nav-item mb-1">
            <div className="accordion" id="reportAccordion">
              <div className="accordion-item border-0">
                <h6 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent border-0 w-100 text-start d-flex justify-content-between align-items-center py-2 px-3 rounded text-dark nav-link"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#reportMenu"
                  >
                    <span>Báo cáo thống kê</span>
                    <span className="caret-indicator">▾</span>
                  </button>
                </h6>
                <div
                  id="reportMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#reportAccordion"
                >
                  <div className="accordion-body p-0">
                    <ul className="nav flex-column ms-4">
                      <li className="nav-item">
                        <NavLink
                          to="/admin/reportBooking"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-chart-line me-3 text-primary"></i>
                          <span>Thống kê đặt sân</span>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          to="/admin/reportOrder"
                          className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
                          }
                        >
                          <i className="fas fa-chart-area me-3 text-success"></i>
                          <span>Thống kê bán hàng</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item mb-1">
            <NavLink
              to="/admin/ai-support"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 rounded text-dark${isActive ? ' active' : ''}`
              }
            >
              <i className="fas fa-cogs me-3 text-secondary"></i>
              <span>AI hỗ trợ</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
