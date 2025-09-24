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
      <style>
        {`
          body {
            background-image: url('/user/images/bgAll.png');
            background-repeat: repeat;
            background-size: 100% 100%;
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
                            />
                          </div>
                        </td>
                        <td className="price-tag total-price">
                          {(item.quantity * (item.price - item.discountprice)).toLocaleString()}đ
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
            <div className="col col-lg-5 col-md-6 mt-5 cart-wrap" style={{ background: "white" }}>
              <div className="cart-total mb-3">
                <h3>Thanh toán giỏ hàng</h3>
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
                  Tiến hành thanh toán
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
