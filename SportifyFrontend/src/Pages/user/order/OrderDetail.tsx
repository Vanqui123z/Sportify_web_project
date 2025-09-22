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

  if (!data) return <div>Loading...</div>;

  const { order } = data;

  return (
    <div className="container mt-4">
      <a href="/sportify/order/historyList">Quay lại Lịch sử đặt hàng</a>
      <div className="row">
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
                  style={{ maxWidth: "80px" }}
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
            <a href={`/sportify/order/detail/cancelOrder/${order.orders.orderid}`}>
              <button
                className="btn btn-danger"
                style={{ float: "right" }}
              >
                Hủy đơn hàng
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
