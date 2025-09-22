import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getImageUrl from '../../../utils/getImageUrl ';

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
  categories: {
    categoryid: number;
    categoryname: string;
  };
}

const ProductDetail: React.FC = () => {
	const productid = useParams().productid as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [addQuantity, setAddQuantity] = useState<number>(1);

  useEffect(() => {
    fetch(`http://localhost:8081/api/sportify/product-single/${productid}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, []);

  const addProductToCart = () => {
    fetch(`http://localhost:8081/api/user/cart/add/${productid}?quantity=${addQuantity}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
       .then((data) => {
      if (data?.ok) {
        alert("Thêm sản phẩm vào giỏ hàng thành công!");
      } else {
        alert("Thêm sản phẩm thất bại!");
      }
    })
    .catch((err) => {
      console.error("Add to cart failed:", err);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    });
    
    setCartCount(cartCount + addQuantity);
    if (product) {
      setCartItems([...cartItems, { ...product, quantity: addQuantity }]);
      setTotalPrice(totalPrice + addQuantity * (product.price - product.discountprice));
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ backgroundImage: `url('/user/images/bgAll.png')`, backgroundRepeat: 'repeat', backgroundSize: '100% 100%' }}>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5" style={{ backgroundImage: `url('/user/images/bg_product.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="overlay bg-dark bg-opacity-50 position-absolute w-100 h-100"></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb justify-content-center bg-transparent">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white text-decoration-none">
                      Trang Chủ <i className="fas fa-chevron-right ms-2"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/product" className="text-white text-decoration-none">
                      Products <i className="fas fa-chevron-right ms-2"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Products Single
                  </li>
                </ol>
              </nav>
              <h1 className="display-4 fw-bold mb-0">Chi tiết sản phẩm</h1>
            </div>
          </div>
        </div>
      </section>
      {/* Product Detail Section */}
      <section className="py-5">
        <div className="container">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <div className="row g-5">
                <div className="col-lg-6">
                  <div className="position-relative">
                    <img 
                      src={getImageUrl(product.image)} 
                      className="img-fluid rounded shadow" 
                      alt={product.productname}
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                    {!product.productstatus && (
                      <div className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end">
                        Hết hàng
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="h-100 d-flex flex-column">
                    <h1 className="display-5 fw-bold text-dark mb-3">{product.productname}</h1>
                    
                    <div className="mb-4">
                      <span className="badge bg-primary fs-6 mb-2">{product.categories.categoryname}</span>
                    </div>
                    
                    <div className="price-section mb-4">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <span className="h4 text-muted text-decoration-line-through mb-0">
                          {product.price.toLocaleString()} đ
                        </span>
                        <span className="badge bg-danger fs-6">
                          -{((product.discountprice / product.price) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h2 text-success fw-bold mb-0">
                        {(product.price - product.discountprice).toLocaleString()} đ
                      </div>
                    </div>

                    <div className="product-info mb-4">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className="fas fa-box text-primary me-2"></i>
                            <span className="fw-semibold">Số lượng:</span>
                            <span className="ms-2">{product.quantity}</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i className={`fas fa-circle me-2 ${product.productstatus ? 'text-success' : 'text-danger'}`}></i>
                            <span className={`fw-semibold ${product.productstatus ? 'text-success' : 'text-danger'}`}>
                              {product.productstatus ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Thêm trường nhập số lượng */}
                      <div className="mt-3">
                        <label htmlFor="addQuantity" className="fw-semibold me-2">Thêm số lượng:</label>
                        <input
                          id="addQuantity"
                          type="number"
                          min={1}
                          max={product.quantity}
                          value={addQuantity}
                          onChange={e => setAddQuantity(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
                          style={{ width: 80 }}
                          className="form-control d-inline-block"
                        />
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        className={`btn btn-lg px-5 py-3 w-100 ${product.productstatus ? 'btn-success' : 'btn-secondary'}`}
                        onClick={addProductToCart}
                        disabled={!product.productstatus}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        {product.productstatus ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Description */}
          <div className="card shadow-lg border-0 mt-5">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Mô tả sản phẩm
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="description-content">
                <p className="lead text-muted" style={{ 
                  whiteSpace: 'pre-line', 
                  wordWrap: 'break-word', 
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  {product.descriptions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default ProductDetail;