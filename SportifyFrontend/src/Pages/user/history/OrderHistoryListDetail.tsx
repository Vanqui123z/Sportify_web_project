import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Category {
  categoryid: number;
  categoryname: string;
}

interface Product {
  productid: number;
  categoryid: number;
  productname: string;
  image: string;
  discountprice: number;
  datecreate: string;
  price: number;
  productstatus: boolean;
  descriptions: string;
  quantity: number;
  categories: Category;
}

interface User {
  username: string;
  passwords: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  image: string | null;
  gender: boolean;
  status: boolean;
}

interface Order {
  orderid: number;
  username: string;
  createdate: string;
  address: string;
  note: string | null;
  orderstatus: string;
  paymentstatus: boolean;
  totalprice: number;
  users: User;
}

interface OrderDetail {
  orderdetailsid: number;
  price: number;
  quantity: number;
  products: Product;
  orders: Order;
}

interface ApiResponse {
  order: OrderDetail;
  success: boolean;
}

const OrderDetail: React.FC = () => {
  const Bookingid = useParams().id;
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch(
      `http://localhost:8081/api/user/order/historyList/detail/${Bookingid}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => setData(null));
  }, [Bookingid]);

  const handleDelete = (orderid: number) => {
    fetch(`http://localhost:8081/api/user/order/cancelOrder/${orderid}`, {
      method: "DELETE",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Hủy đơn hàng thành công");
          setData(null);
        }
      });
  };

  if (!data) return <div>Loading...</div>;

  const { order } = data;

  return (
    <>
      {/* background */}
      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: "url('/user/images/bg_product.png')" }}
        data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2"><a href="/sportify">Trang Chủ <i
                    className="fa fa-chevron-right"></i></a></span> <span>Sản Phẩm <i
                  className="fa fa-chevron-right"></i></span>
              </p>
              <h2 className="mb-0 bread">Chi tiết đơn hàng</h2>
            </div>
          </div>
        </div>
      </section>
      
      {/* container sản phẩm */}
      <section className="ftco-section">
        <div className="container">
          <a href="/sportify/order/historyList">Quay lại Lịch sử đặt hàng</a>
          <div className="row">
            {/* show sản phẩm */}
            <h1 className="d-flex justify-content-center col-md-12 mt-1">
              Đơn hàng #{order.orders.orderid}
            </h1>
          </div>
          <div className="col-12">
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="text-center bg-secondary text-light">
                  <th scope="col">ID</th>
                  <th scope="col">Hình</th>
                  <th scope="col">Tên SP</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <th scope="row">{order.products.productid}</th>
                  <td>
                    <img
                      className="img d-flex align-items-center justify-content-center"
                      src={`/user/images/${order.products.image}`}
                      alt="Error"
                    />
                  </td>
                  <td>{order.products.productname}</td>
                  <td>
                    {order.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>{order.quantity}</td>
                  <td>
                    {(order.price * order.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              {order.orders.orderstatus === "Chờ Xác Nhận" && (
                  <button onClick={() => {handleDelete(order.orders.orderid)}}
                    className="btn btn-danger"
                    style={{ float: "right" }}
                  >
                    Hủy đơn hàng
                  </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
