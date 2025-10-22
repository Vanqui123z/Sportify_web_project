import React from "react";

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
            <a
              href="/admin/dashboard"
              className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
            >
              <i className="fas fa-tachometer-alt me-3 text-primary"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <li className="nav-item mb-1">
            <a
              href="/admin/products"
              className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
            >
              <i className="fas fa-store me-3 text-success"></i>
              <span>Sản phẩm</span>
            </a>
          </li>

          <li className="nav-item mb-1">
            <a
              href="/admin/fields"
              className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
            >
              <i className="fas fa-futbol me-3 text-warning"></i>
              <span>Sân thể thao</span>
            </a>
          </li>

          <li className="nav-item mb-1">
            <a
              href="/admin/accounts"
              className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
            >
              <i className="fas fa-users-cog me-3 text-info"></i>
              <span>Quản lý tài khoản</span>
            </a>
          </li>

          <li className="nav-item mb-1">
            <a
              href="/admin/events"
              className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
            >
              <i className="fas fa-newspaper me-3 text-danger"></i>
              <span>Tin tức & Sự kiện</span>
            </a>
          </li>

          {/* Dropdown Menu - Khác */}
          <li className="nav-item mb-1">
            <div className="accordion" id="otherAccordion">
              <div className="accordion-item border-0">
                <h6 className="accordion-header">
                  <button
                    className="accordion-button collapsed bg-transparent border-0 p-0 nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#otherMenu"
                  >
                    <i className="fas fa-pen me-3 text-secondary"></i>
                    <span>Khác</span>
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
                        <a
                          href="/admin/vouchers"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-gift me-3 text-primary"></i>
                          <span>Mã giảm giá</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="/admin/contacts"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-comments me-3 text-success"></i>
                          <span>Liên hệ</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="/admin/comments"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-comments me-3 text-success"></i>
                          <span>Quản lý bình luận</span>
                        </a>
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
                    className="accordion-button collapsed bg-transparent border-0 p-0 nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#bookingMenu"
                  >
                    <i className="fas fa-bullhorn me-3 text-warning"></i>
                    <span>Quản lý phiếu đặt</span>
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
                        <a
                          href="/admin/bookings"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Lịch đặt sân</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="/admin/manager-bookings"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Quản lí đặt sân </span>
                        </a>
                      </li>
                     
                      <li className="nav-item">
                        <a
                          href="/admin/manage-orders"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-receipt me-3 text-success"></i>
                          <span>Đơn hàng</span>
                        </a>
                      </li>
                       <li className="nav-item">
                        <a
                          href="/admin/count_bookings"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-ticket-alt me-3 text-primary"></i>
                          <span>Quản lí đơn hàng  </span>
                        </a>
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
                    className="accordion-button collapsed bg-transparent border-0 p-0 nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#categoryMenu"
                  >
                    <i className="fas fa-boxes me-3 text-info"></i>
                    <span>Quản lý thể loại</span>
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
                        <a
                          href="/admin/category-product"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-tshirt me-3 text-primary"></i>
                          <span>Loại sản phẩm</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="/admin/category-sport"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-running me-3 text-success"></i>
                          <span>Loại thể thao</span>
                        </a>
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
                    className="accordion-button collapsed bg-transparent border-0 p-0 nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#reportMenu"
                  >
                    <i className="fas fa-chart-bar me-3 text-danger"></i>
                    <span>Báo cáo thống kê</span>
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
                        <a
                          href="/admin/reportBooking"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-chart-line me-3 text-primary"></i>
                          <span>Thống kê đặt sân</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="/admin/reportOrder"
                          className="nav-link d-flex align-items-center py-2 px-3 rounded text-dark"
                        >
                          <i className="fas fa-chart-area me-3 text-success"></i>
                          <span>Thống kê bán hàng</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
