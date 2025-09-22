import React, { useEffect, useState } from "react";

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

interface CartItem {
  cartItemId: number;
  quantity: number;
  price: number;
  discountprice: number;
  productName: string | null;
  image: string | null;
}

interface ApiResponse {
  totalPrice: number;
  user: User;
  items: CartItem[];
  cartid: number;
  success: boolean;
}

const CheckoutCart: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/user/cart/checkout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        if (res.success) setData(res);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data) return;

    const formData = new FormData();
    formData.append('cartid', data.cartid.toString());
    formData.append('totalPrice', totalPrice.toString());
    formData.append('phone', data.user.phone.toString());

    try {
      const res = await fetch('http://localhost:8081/api/user/cart/payment', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error(`API trả về lỗi ${res.status}`);
      }
      
      const responseData = await res.json();
      
      // Nếu API trả về url để redirect, chuyển hướng tại đây
      if (responseData && responseData.url) {
        window.location.href = responseData.url;
      } else {
        // Xử lý khi không có url trả về
        alert('Thanh toán thành công!');
      }
    } catch (err: any) {
      alert('Có lỗi khi thanh toán, vui lòng thử lại!');
    }
  };

  if (!data) return <div>Loading...</div>;

  const { user, items } = data;
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * (item.price - item.discountprice),
    0
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Thanh toán giỏ hàng</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Thông tin khách hàng</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user.image ? `/user/images/${user.image}` : "/user/images/noavatar.jpg"}
                  alt="avatar"
                  className="rounded-circle border"
                  style={{ width: 60, height: 60, marginRight: 16 }}
                />
                <div>
                  <div className="fw-bold">{user.firstname} {user.lastname}</div>
                  <div className="text-muted">{user.email}</div>
                </div>
              </div>
              <div>
                <div><strong>Địa chỉ:</strong> {user.address}</div>
                <div><strong>SĐT:</strong> {user.phone}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Sản phẩm trong giỏ</h5>
            </div>
            <div className="card-body">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Hình</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.cartItemId}>
                      <td>
                        {item.image ? (
                          <img
                            src={`/user/images/products_img/${item.image}`}
                            alt="sp"
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          <span className="text-muted">No image</span>
                        )}
                      </td>
                      <td>{item.productName || `#${item.cartItemId}`}</td>
                      <td>
                        {(item.price - item.discountprice).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        {(item.quantity * (item.price - item.discountprice)).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-end">
                <span className="fw-bold fs-5">
                  Tổng tiền:{" "}
                  <span className="text-success">
                    {totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      
      <div className="row mt-5 pt-3 d-flex">
        <div className="col-md-6">
          <div className="cart-detail p-3 p-md-4" style={{ backgroundColor: "#F1F6F9" }}>
            <h3 className="billing-heading mb-4">Hình thức thanh toán</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="col-md-12">
                  <div className="radio">
                    <label>
                      <input type="radio" checked name="optradio" className="mr-2" readOnly />
                      <img style={{ width: "12%", height: "14%" }} src="/user/images/iconVNP.png" alt="VNPay" /> VNPay
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ color: "black" }} className="font-italic">
                Khi nhấn vào nút này bạn công nhận mình đã đọc và đồng ý với các
                <a href="/sportify/quydinh" style={{ color: "blue" }}> Điều khoản & Điều kiện </a> và
                <a href="/sportify/chinhsach" style={{ color: "blue" }}> Chính sách quyền riêng tư</a> của Sportify.
                <p>
                  <button type="submit" className="btn btn-primary py-3 px-4 mt-3">Thanh toán</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
      </div>

  );
};

export default CheckoutCart;