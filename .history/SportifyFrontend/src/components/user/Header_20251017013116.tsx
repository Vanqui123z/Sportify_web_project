
import { useContext, useState, useEffect } from "react";
import ConfirmModal from "./Modal";
import { AuthContext } from "../../helper/AuthContext";
import { ShoppingCart } from "react-feather";
import { getCartQuantity } from "../../helper/checkQuatityCart";
import NotificationDropdown from "./NotificationDropdown";
import "../../styles/HeaderBadges.css";

export default function Header() {

  const { user, setUser, loading } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      getCartQuantity().then(setCartCount);
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/user/logoff/success", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        window.location.href = "/sportify";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <header className="ftco-top-header py-2 wrap" style={{ zIndex: 1000, position: "relative" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8 d-flex align-items-center">
              <div className="social-media me-4">
                <div className="d-flex">
                  <a href="https://www.facebook.com/?locale=vi_VN" className="me-2 text-light">
                    <span className="fa fa-facebook"></span>
                  </a>
                  <a href="https://x.com/home" className="me-2 text-light">
                    <span className="fa fa-twitter"></span>
                  </a>
                  <a href="https://www.instagram.com/" className="me-2 text-light">
                    <span className="fa fa-instagram"></span>
                  </a>
                  <a href="https://zalo.me/0366635625" className="me-2 text-light">
                    <span className="fa fa-comments"></span>
                  </a>
                </div>
              </div>
              <div className="contact-info d-flex">
                <span className="me-3 text-light">
                  <span className="fa fa-phone me-1"></span>
                  0366635625
                </span>
                <span className="text-light">
                  <span className="fa fa-paper-plane me-1"></span>
                  phamleducngoc123@gmail.com
                </span>
              </div>
            </div>

            <div className="col-md-4">
              {!loading && (
                <div className="d-flex align-items-center justify-content-end">
                  {user ? (
                    <>
                      {/* icon giỏ hàng */}
                      <div className="me-4">
                        <a className="d-flex align-items-center position-relative text-dark" href="/sportify/cart/view">
                          <ShoppingCart size={20} color="#fff" />
                          {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {cartCount}
                            </span>
                          )}
                        </a>
                      </div>
                      
                      {/* icon thông báo */}
                      <div className="me-4">
                        <NotificationDropdown />
                      </div>

                      <div className="dropdown">
                        <div
                          className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
                          id="userDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ fontSize: '0.9rem' }}
                        >
                          <span className="fa fa-user me-2 text-light"></span>
                          <span className="text-light">{user.username}</span>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown" style={{ zIndex: 1050, minWidth: '180px' }}>
                          <li><a className="dropdown-item" href="/sportify/profile">
                            <i className="fa fa-user me-2"></i>Thông tin cá nhân
                          </a></li>
                          {user.role === "Admin" && (
                            <li>
                              <a className="dropdown-item" href="/admin/dashboard">
                                <i className="fa fa-cogs me-2"></i>Quản trị
                              </a>
                            </li>
                          )}
                          <li className="nav-item"><a className="nav-link" href="/sportify/field/profile/historybooking">Lịch sử đặt sân</a></li>
                          <li className="nav-item"><a className="nav-link" href="/sportify/order/historyList">Lịch sử đơn hàng</a></li>
                          <li className="nav-item"><a className="nav-link" href="/sportify/field/profile/favorite">Sân yêu thích</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => setShowModal(true)}>
                              <i className="fa fa-sign-out me-2"></i>Đăng xuất
                            </button>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center">
                      <a className="text-light text-decoration-none me-3" href="/login" style={{ fontSize: '0.9rem' }}>
                        <i className="fa fa-sign-in me-1"></i>Đăng nhập
                      </a>
                      <a className="text-light text-decoration-none" href="/register" style={{ fontSize: '0.9rem' }}>
                        <i className="fa fa-user-plus me-1"></i>Đăng ký
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmModal
        show={showModal}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
        onConfirm={handleLogout}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
