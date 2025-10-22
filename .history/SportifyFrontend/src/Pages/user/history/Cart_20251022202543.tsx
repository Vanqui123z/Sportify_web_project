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
      <style>
        {`
          body {
            background-image: url('/user/images/bgAll.png');
            background-repeat: repeat;
            background-size: 100% 100%;
          }
          .cart-item-payment {
            background: white;
            padding: 20px;
          }
          .clear-cart-btn {
            float: right;
          }
          .total-cart-payment {
            background: white;
          }
        `}
      </style>

      {/* Background */}
      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: "url('/user/images/bg_product.png')" }}
        data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2"><a href="index.html">Trang Chủ <i className="fa fa-chevron-right"></i></a></span> 
                <span>Cửa hàng <i className="fa fa-chevron-right"></i></span>
              </p>
              <h2 className="mb-0 bread">Giỏ Hàng</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          {/* Hiển thị từng sản phẩm với khung thanh toán riêng */}
          {cart && cart.items.length > 0 ? (
            cart.items.map((item, idx) => {
              const itemTotalPrice = item.quantity * (item.price - item.discountprice);
              const itemShippingFee = 30000;
              const itemFinalPrice = itemTotalPrice + itemShippingFee;

              return (
                <div key={item.cartItemId} className="row mb-4 pb-4 border-bottom">
                  {/* Bảng sản phẩm - Chiếm 7 cột */}
                  <div className="col-lg-7 col-md-12 mb-3">
                    <div className="table-wrap">
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
                          <tr className="alert" role="alert">
                            <td>
                              <img className="img" alt="Error" src={`/user/images/${item.image}`} />
                            </td>
                            <td>
                              <div className="email">
                                <span>{item.productName}</span>
                                <span></span>
                              </div>
                            </td>
                            <td className="price-tag">
                              {(item.price - item.discountprice).toLocaleString()}đ
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
                                  title="Số lượng sản phẩm"
                                  aria-label="Số lượng sản phẩm"
                                />
                              </div>
                            </td>
                            <td className="price-tag total-price">
                              {itemTotalPrice.toLocaleString()}đ
                            </td>
                            <td>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                                onClick={() => removeProduct(item.cartItemId)}
                              >
                                <span aria-hidden="true"><i className="fa fa-close"></i></span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Khung thanh toán riêng - Chiếm 5 cột */}
                  <div className="col-lg-5 col-md-12">
                    <div className="cart-wrap cart-item-payment">
                      <div className="cart-total mb-3">
                        <h3>Thanh toán sản phẩm</h3>
                        <p className="d-flex">
                          <span>Tạm tính: </span>
                          <span>{itemTotalPrice.toLocaleString()}đ</span>
                        </p>
                        <p className="d-flex">
                          <span>Phí vận chuyển: </span>
                          <span>{itemShippingFee.toLocaleString()}đ</span>
                        </p>
                        <hr />
                        <p className="d-flex total-price">
                          <span>Thành tiền</span>
                          <span>{itemFinalPrice.toLocaleString()}đ</span>
                        </p>
                      </div>
                      <p className="text-center">
                        <a 
                          href={`/sportify/cart/checkout?items=${item.cartItemId}`} 
                          className="btn btn-primary py-3 px-4"
                        >
                          Thanh toán sản phẩm này
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="row">
              <div className="col-12 text-center">
                <p>Giỏ hàng trống</p>
              </div>
            </div>
          )}

          {/* Nút xóa toàn bộ giỏ hàng */}
          {cart && cart.items.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <button onClick={clearCart} className="btn btn-danger clear-cart-btn">
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>
          )}

          {/* Thanh toán tất cả */}
          {cart && cart.items.length > 0 && (
            <div className="row justify-content-end mt-5">
              <div className="col col-lg-5 col-md-6 cart-wrap total-cart-payment">
                <div className="cart-total mb-3">
                  <h3>Thanh toán toàn bộ giỏ hàng</h3>
                  <p className="d-flex">
                    <span>Tạm tính: </span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                  </p>
                  <p className="d-flex">
                    <span>Phí vận chuyển: </span>
                    <span>{shippingFee.toLocaleString()}đ</span>
                  </p>
                  <hr />
                  <p className="d-flex total-price">
                    <span>Thành tiền</span>
                    <span>{updateTotalPrice.toLocaleString()}đ</span>
                  </p>
                </div>
                <p className="text-center">
                  <a href="/sportify/cart/checkout" className="btn btn-primary py-3 px-4">
                    Thanh toán tất cả
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
