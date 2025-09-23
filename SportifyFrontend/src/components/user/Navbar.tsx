import { useContext, useState, useEffect } from "react";
import ConfirmModal from "./Modal";
import { AuthContext } from "../../utils/AuthContext";
import { ShoppingCart } from "react-feather";
import { getCartQuantity } from "../../utils/checkQuatityCart";

export default function Navbar() {
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
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/sportify">
            <img src="/user/images/Logo3.png" style={{ width: "200px" }} alt="" />
          </a>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link" href="/sportify">Trang chủ</a></li>
              <li className="nav-item">
                <a href="/sportify/field" className="nav-link">Sân</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/team" className="nav-link">Đội</a>
              </li>
              <li className="nav-item"><a className="nav-link" href="/sportify/field/profile/historybooking">Lịch sử đặt sân</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/order/historyList">Lịch sử đơn hàng</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/football-prediction">Dự đoán tỉ số</a></li>
              <li className="nav-item">
                <a href="/sportify/product" className="nav-link">Cửa hàng</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/event" className="nav-link">Tin Tức</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/contact" className="nav-link">Liên hệ</a>
              </li>
            </ul>

            {!loading && (
              <ul className="navbar-nav ms-3">
                {user ? (
                  <>
                    {/* icon giỏ hàng */}
                    <li className="nav-item me-3">
                      <a className="nav-link position-relative" href="/sportify/cart/view">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartCount}
                          </span>
                        )}
                      </a>
                    </li>
                    
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle d-flex align-items-center"
                        href="#"
                        id="userDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {user.username}
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a className="dropdown-item" href="/sportify/profile">Thông tin cá nhân</a></li>
                        {user.role === "Admin" && (
                          <li>
                            <a className="dropdown-item" href="/admin/dashboard">Quản trị</a>
                          </li>
                        )}
                        <li>
                          <button className="dropdown-item" onClick={() => setShowModal(true)}>Đăng xuất</button>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item"><a className="nav-link" href="/login">Đăng nhập</a></li>
                    <li className="nav-item"><a className="nav-link" href="/register">Đăng ký</a></li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </nav>

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
         
