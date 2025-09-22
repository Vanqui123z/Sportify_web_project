import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  username: string;
  firstname: string;
  lastname: string;
  image?: string | null;
}

interface Order {
  orderid: number;
  createdate: string;
  address: string;
  orderstatus: string;
  paymentstatus: boolean;
  totalprice: number;
  users: User;
}

const statusColors: Record<string, string> = {
  "Hoàn Thành": "green",
  "Chờ Xác Nhận": "#F86F03",
  "Đang Giao": "#FFA41B",
  "Hủy Đặt": "red",
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/user/order/historyList",{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
          if (data.orders.length > 0) {
            setUser(data.orders[0].users);
          }
        }
      });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="wrap" style={{ zIndex: 9, position: "relative" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              {/* ...existing code for social media and contact... */}
            </div>
            <div className="col-md-6 d-flex justify-content-md-end">
              {!user ? (
                <div className="reg m-1" style={{ display: "block" }}>
                  <p className="mb-0">
                    <a href="/sportify/login" className="mr-2" style={{ color: "white" }}>Đăng nhập |</a>
                    <a href="/sportify/signup" style={{ color: "white" }}>Đăng kí</a>
                  </p>
                </div>
              ) : (
                <>
                  <span className="m-1 mr-2" style={{ color: "white" }}>
                    Xin chào !
                  </span>
                  <div className="dropdown m-1" style={{ display: "block" }}>
                    <a className="dropdown-toggle" id="dropdownMenuAccount" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img
                        className="rounded-circle border border-white"
                        src={user.image ? `/user/images/${user.image}` : "/user/images/noavatar.jpg"}
                        alt=""
                        style={{ width: 30, height: 30 }}
                      />
                      <span id="nameuser">{user.firstname} {user.lastname}</span>
                    </a>
                    <div className="ml-3 mt-2 dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <a href="/sportify/profile" className="dropdown-item">Thông tin</a>
                      <a href="/sportify/field/profile/historybooking" className="dropdown-item">Lịch sử đặt sân</a>
                      <a href="/sportify/order/historyList" className="dropdown-item">Lịch sử đặt hàng</a>
                      {/* ...role-based admin link if needed... */}
                      <a href="/sportify/logoff" className="dropdown-item">Đăng xuất</a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      {/* ...existing code for navbar... */}

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: "url('/user/images/bg_product.png')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 ftco-animate mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2"><a href="/">Trang Chủ <i className="fa fa-chevron-right"></i></a></span>
                <span>Sản Phẩm <i className="fa fa-chevron-right"></i></span>
              </p>
              <h2 className="mb-0 bread">Lịch sử đơn hàng</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Order List */}
      <section className="ftco-section">
        <div className="container">
          <div className="row">
            <div className="container d-flex justify-content-center rounded mb-5">
              <div className="col-md-12 rounded row" id="profiles"
                style={{ marginTop: 50, backgroundColor: "rgb(247, 249, 250)" }}>
                {orders.map(order => (
                  <div key={order.orderid} className="card col-12 mb-3" style={{ borderRadius: 10 }}>
                    <h6 className="card-header row">
                      <span className="col-4">Đơn hàng # <span>{order.orderid}</span></span>
                      <span className="col-6" style={{ color: "#1F8A70", fontWeight: "bold" }}>
                        Đặt lúc: <span style={{ color: "#1F8A70", fontWeight: "bold" }}>
                          {new Date(order.createdate).toLocaleString("vi-VN")}
                        </span>
                      </span>
                      <span
                        className="col-2"
                        style={{
                          fontSize: "medium",
                          color: "snow",
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: "3px 10px 3px 10px",
                          borderRadius: 10,
                          backgroundColor: statusColors[order.orderstatus] || "crimson"
                        }}
                      >
                        {order.orderstatus}
                      </span>
                    </h6>
                    <div className="card-body row">
                      <p className="col-4">
                        <span>Tổng tiền: <span>{order.totalprice.toLocaleString()}₫</span></span>
                        <br />
                        <span>
                          Tình trạng: <span
                            style={{
                              textAlign: "center",
                              color: order.paymentstatus ? "green" : "red"
                            }}>
                            {order.paymentstatus ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </span>
                      </p>
                      <span className="col-6" style={{ color: "#1F8A70", fontWeight: "bold" }}>
                        Giao đến: <span style={{ color: "#1F8A70", fontWeight: "bold" }}>{order.address}</span>
                      </span>
                      <a href={`/sportify/order/historyList/detail/${order.orderid}`} className="col-2">
                            Xem Chi Tiết
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* ...existing code for footer... */}
    </div>
  );
};

export default OrderList;
