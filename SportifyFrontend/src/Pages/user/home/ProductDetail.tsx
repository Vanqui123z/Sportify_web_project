import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import getImageUrl from '../../../utils/getImageUrl';

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
      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: `url('/user/images/bg_product.png')` }}
        data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2">
                  <Link to="/">Trang Chủ <i className="fa fa-chevron-right"></i></Link>
                </span>
                <span>
                  <Link to="/product">Products <i className="fa fa-chevron-right"></i></Link>
                </span>
                <span>Products Single <i className="fa fa-chevron-right"></i></span>
              </p>
              <h2 className="mb-0 bread">Chi tiết SP</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="ftco-section">
        <div className="container">
          <div className="row" style={{ background: 'white' }}>
            <div className="col-lg-6 mb-5">
              <a href="#" className="image-popup prod-img-bg">
                <img
                  src={`/user/images/products_img/${product.image}`}
                  className="img-fluid"
                  alt={product.productname}
                />
              </a>
            </div>
            <div className="col-lg-6 product-details pl-md-5">
              <h1>{product.productname}</h1>
              <p className="price">
                <h3>
                  Giá gốc:
                  <del>
                    <span>{product.price.toLocaleString()} đ</span>
                  </del>
                </h3>
                <h3>
                  Giá bán: <span>{(product.price - product.discountprice).toLocaleString()} đ</span>
                </h3>
              </p>

              <div className="row mt-4">
                <div className="w-100"></div>
                <div className="col-md-12">
                  <p style={{ color: '#000' }}>
                    {product.productstatus ? 'Còn hàng' : 'Hết hàng'}
                  </p>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="row mt-3">
                <div className="col-md-12">
                  <label htmlFor="addQuantity" style={{ color: '#000', fontWeight: 'bold', marginRight: '10px' }}>
                    Số lượng:
                  </label>
                  <input
                    id="addQuantity"
                    type="number"
                    min={1}
                    max={product.quantity}
                    value={addQuantity}
                    onChange={e => setAddQuantity(Math.max(1, Math.min(product.quantity, Number(e.target.value))))}
                    style={{ width: '80px', padding: '5px', marginLeft: '10px' }}
                    className="form-control d-inline-block"
                  />
                </div>
              </div>

              <p className="mt-4">
                <button
                  onClick={addProductToCart}
                  disabled={!product.productstatus}
                  className="btn btn-product py-3 px-5 mr-2"
                  style={{ color: 'black', border: '1px solid black', opacity: product.productstatus ? 1 : 0.5 }}
                >
                  {product.productstatus ? 'Thêm vào giỏ' : 'Hết hàng'}
                </button>
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className="row mt-5">
            <div className="col-md-12 nav-link-wrap">
              <div className="nav nav-pills d-flex text-center" id="v-pills-tab"
                role="tablist" aria-orientation="vertical">
                <a className="nav-link active mr-lg-1" id="v-pills-1-tab"
                  data-toggle="pill" href="#v-pills-1" role="tab"
                  aria-controls="v-pills-1" aria-selected="true">Mô tả</a>
              </div>
            </div>
            <div className="col-md-12 tab-wrap">
              <div className="tab-content bg-light" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-1"
                  role="tabpanel" aria-labelledby="day-1-tab">
                  <div className="p-4">
                    <div style={{
                      whiteSpace: 'pre-line',
                      wordWrap: 'break-word',
                      fontFamily: '14/18px Arial, sans-serif',
                      textAlign: 'justify',
                      fontSize: '16px',
                      lineHeight: '1.5'
                    }}>
                      {product.descriptions}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;