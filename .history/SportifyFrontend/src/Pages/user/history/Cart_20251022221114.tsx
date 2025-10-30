import React, { useEffect, useState } from "react";
import { useCart } from "../../../helper/useCartCount";

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { updateCartCount } = useCart();

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
    
    const newQuantity = Math.max(1, Math.min(15, quantity));
    const item = cart.items[index];
    
    // Cập nhật UI ngay lập tức
    const items = [...cart.items];
    items[index].quantity = newQuantity;
    setCart({ ...cart, items });
    
    // Gọi API để lưu vào database
    fetch(`http://localhost:8081/api/user/cart/update/${item.cartItemId}?quantity=${newQuantity}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log("Quantity updated successfully");
        // Cập nhật số lượng giỏ hàng trong header
        updateCartCount();
      }
    })
    .catch((err) => {
      console.error("Error updating quantity:", err);
      // Nếu có lỗi, có thể rollback UI về số lượng cũ
    });
  };

  const toggleSelectItem = (cartItemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(cartItemId)) {
        return prev.filter(id => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (!cart) return;
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map(item => item.cartItemId));
    }
  };

  const removeProduct = (cartItemId: number) => {
    console.log("Removing item with ID:", cartItemId);
    
    // Lấy số lượng của item trước khi xóa để cập nhật cart count
    const itemToRemove = cart?.items.find(item => item.cartItemId === cartItemId);
    const quantityToRemove = itemToRemove?.quantity || 0;
    
    fetch(`http://localhost:8081/api/user/cart/remove/${cartItemId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }, 
    })
    .then((res) => {
      console.log("Delete response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Delete response data:", data);
      if (!cart) return;
      const items = cart.items.filter((item) => item.cartItemId !== cartItemId);
      setCart({ ...cart, items });
      setSelectedItems(prev => prev.filter(id => id !== cartItemId));
      // Cập nhật số lượng giỏ hàng trong header
      updateCartCount();
    })
    .catch((err) => {
      console.error("Error removing product:", err);
      // Vẫn cập nhật UI ngay cả khi có lỗi
      if (!cart) return;
      const items = cart.items.filter((item) => item.cartItemId !== cartItemId);
      setCart({ ...cart, items });
      setSelectedItems(prev => prev.filter(id => id !== cartItemId));
      // Cập nhật số lượng giỏ hàng trong header
      updateCartCount();
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
      setSelectedItems([]);
      // Cập nhật số lượng giỏ hàng trong header
      updateCartCount();
    });
  };

  const cartCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  
  // Tính tổng tiền của TẤT CẢ sản phẩm
  const totalPrice = cart
    ? cart.items.reduce(
        (sum, item) => sum + item.quantity * (item.price - item.discountprice),
        0
      )
    : 0;
  
  // Tính tổng tiền của các sản phẩm ĐƯỢC CHỌN
  const selectedTotalPrice = cart
    ? cart.items
        .filter(item => selectedItems.includes(item.cartItemId))
        .reduce((sum, item) => sum + item.quantity * (item.price - item.discountprice), 0)
    : 0;
  
  const shippingFee = selectedTotalPrice > 0 ? 30000 : 0;
  const updateTotalPrice = selectedTotalPrice + shippingFee;

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
                    <th>
                      <input
                        type="checkbox"
                        checked={!!(cart && cart.items.length > 0 && selectedItems.length === cart.items.length)}
                        onChange={toggleSelectAll}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </th>
                    <th>Hình ảnh</th>
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
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.cartItemId)}
                            onChange={() => toggleSelectItem(item.cartItemId)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </td>
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
                      <td colSpan={7} className="text-center">
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
                {selectedItems.length > 0 ? (
                  <>
                    <p className="d-flex">
                      <span>Đã chọn: </span>
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {selectedItems.length} sản phẩm
                      </span>
                    </p>
                    <p className="d-flex">
                      <span>Tạm tính: </span>
                      <span>{selectedTotalPrice.toLocaleString()}đ</span>
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
                  </>
                ) : (
                  <p className="text-center text-muted" style={{ padding: '20px 0' }}>
                    Vui lòng chọn sản phẩm để thanh toán
                  </p>
                )}
              </div>
              <p className="text-center">
                {selectedItems.length > 0 ? (
                  <a 
                    href={`/sportify/cart/checkout/items?ids=${selectedItems.join(',')}`}
                    className="btn btn-primary py-3 px-4"
                  >
                    Thanh toán ({selectedItems.length} sản phẩm)
                  </a>
                ) : (
                  <button 
                    className="btn btn-secondary py-3 px-4" 
                    disabled
                    style={{ cursor: 'not-allowed' }}
                  >
                    Thanh toán
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
