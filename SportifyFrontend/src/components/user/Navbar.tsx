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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/sportify">
            <img src="/user/images/Logo3.png" alt="Sportify Logo" style={{ height: "40px" }} />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="/sportify">Trang chủ</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/team">Đội</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/field">Đặt sân</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/field/profile/historybooking">Lịch sử đặt sân</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/order/historyList">Lịch sử đơn hàng</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/football-prediction">Dự đoán tỉ số </a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/product">Sản phẩm</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/event">Sự kiện</a></li>
              <li className="nav-item"><a className="nav-link" href="/sportify/contact">Liên hệ</a></li>
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
                        <button className="dropdown-item" onClick={() => setShowModal(true)}>   Đăng xuất </button>
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
         
