import React, { useEffect, useState } from "react";

interface CartItem {
  cartItemId: number;
  quantity: number;
  price: number;
  discountprice: number;
  // Nếu có thêm thông tin sản phẩm, thêm vào đây
  productName?: string;
  image?: string;
}

interface CartData {
  cartid: number;
  username: string;
  status: string;
  createdate: string;
  items: CartItem[];
}

interface ApiResponse {
  success: boolean;
  cart: CartData;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/user/cart/view", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.success) setCart(data.cart);
      });
  }, []);

  const handleQuantityChange = (index: number, quantity: number) => {
    if (!cart) return;
    const items = [...cart.items];
    items[index].quantity = Math.max(1, Math.min(15, quantity));
    setCart({ ...cart, items });
    // TODO: Call API to update quantity if needed
  };

  const removeProduct = (cartItemId: number) => {
    console.log("Removing item with ID:", cartItemId);
    fetch(`http://localhost:8081/api/user/cart/remove/${cartItemId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }, 
    }).then(() => {
      if (!cart) return;
      const items = cart.items.filter((item) => item.cartItemId !== cartItemId);
      setCart({ ...cart, items });
    }).catch((err) => {
      console.error("Error removing product:", err);
      if (!cart) return;
      const items = cart.items.filter((item) => item.cartItemId !== cartItemId);
      setCart({ ...cart, items });
    });
  };

  const clearCart = () => {
    fetch(`http://localhost:8081/api/user/cart/remove-all`, {
      method: "DELETE",
      credentials: "include",  
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {

      if (!cart) return;
      setCart({ ...cart, items: [] });
    });

  };

  const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalPrice = cart
    ? cart.items.reduce(
        (sum, item) => sum + item.quantity * (item.price - item.discountprice),
        0
      )
    : 0;
  const shippingFee = totalPrice > 0 ? 30000 : 0;
  const updateTotalPrice = totalPrice + shippingFee;

  return (
    <div>
      {/* ...existing head, nav, and header code as JSX or in layout... */}
      <section className="ftco-section">
        <div className="container">
          <div className="row">
            <div className="table-wrap col-12">
              <table className="table">
                <thead className="thead-primary">
                  <tr>
                    <th>&nbsp;</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {cart && cart.items.length > 0 ? (
                    cart.items.map((item, idx) => (
                      <tr className="alert" role="alert" key={item.cartItemId}>
                        <td>
                          {/* Nếu có image thì hiển thị, nếu không thì để trống hoặc icon mặc định */}
                          {item.image ? (
                            <img className="img" alt="Error" src={`/user/images/products_img/${item.image}`} style={{ maxWidth: "80px" }} />
                          ) : (
                            <span className="text-muted">No image</span>
                          )}
                        </td>
                        <td>
                          <div className="email">
                            {/* Nếu có productname thì hiển thị, nếu không thì để trống hoặc id */}
                            <span>{item.productName || `#${item.cartItemId}`}</span>
                          </div>
                        </td>
                        <td className="price-tag">
                          {(item.price - item.discountprice).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td className="quantity">
                          <div className="input-group">
                            <input
                              type="number"
                              name="quantity"
                              className="quantity form-control input-number"
                              value={item.quantity}
                              min={1}
                              max={15}
                              onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="price-tag total-price">
                          {(item.quantity * (item.price - item.discountprice)).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => removeProduct(item.cartItemId)}
                          >
                            <span aria-hidden="true">
                              X
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Giỏ hàng trống
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div>
                <button onClick={clearCart} className="btn btn-danger" style={{ float: "right" }}>
                  Clear
                </button>
              </div>
            </div>
          </div>
          <br />
          <div className="row justify-content-end">
            <div className="col col-lg-5 col-md-6 mt-5 cart-wrap ftco-animate" style={{ background: "white" }}>
              <div className="cart-total mb-3">
                <h3>Thanh toán giỏ hàng</h3>
                <p className="d-flex">
                  <span>Tạm tính: </span>{" "}
                  <span>{totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </p>
                <p className="d-flex">
                  <span>Phí vận chuyển: </span>{" "}
                  <span>{shippingFee.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </p>
                <hr />
                <p className="d-flex total-price">
                  <span>Thành tiền</span>{" "}
                  <span>{updateTotalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                </p>
              </div>
              <p className="text-center">
                <a href="/sportify/cart/checkout" className="btn btn-primary py-3 px-4">
                  Tiến hành thanh toán
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ...existing footer code as JSX or in layout... */}
    </div>
  );
};

export default Cart;
