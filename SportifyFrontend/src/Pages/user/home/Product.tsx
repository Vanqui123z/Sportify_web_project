import React, { useEffect, useState } from 'react';
import { fetchProductList } from '../../../service/user/home/productApi';
import CustomCard from '../../../components/user/CustomCard';
import getImageUrl from '../../../utils/getImageUrl';
import HeroSection from "../../../components/user/Hero"; // Thêm import

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
  categories?: Category;
}

const Product: React.FC = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductList();
        setCategoryList(data.categoryList || []);
        setProductList(data.productList || []);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // client-side filtering is applied automatically by filteredProducts
  };

  const filteredProducts = productList.filter((p) =>
    p.productname.toLowerCase().includes(searchText.toLowerCase()) &&
    (selectedCategory ? p.categoryid === selectedCategory : true)
  );

  const formatPrice = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <HeroSection
        backgroundImage="/user/images/bg_product.png"
        title="Sản Phẩm"
        breadcrumbs={[
          { label: "Trang Chủ", href: "/sportify" },
          { label: "Sản Phẩm" }
        ]}
      />
      {/* container sản phẩm */}
      <section className="ftco-section">
        <div className="container">
          <div className="row">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="mb-0 d-flex justify-content-center col-md-12">
              <input 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                name="searchText"
                className="form-control me-2 col-6" 
                type="search"
                placeholder="Tìm kiếm theo tên" 
                aria-label="Search" 
              />
              <button className="btn btn-outline-success col-2" type="submit">Search</button>
            </form>

            {/* Search results message */}
            <div className="d-flex justify-content-center col-md-12 mt-1">
              <div className="mr-4 col-md-8"></div>
            </div>
            <br />

            {/* show sản phẩm */}
            <div className="col-md-9">
              {/* No products found message */}
              <div className="col-md-12">
                {filteredProducts.length === 0 && searchText && (
                  <div>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchText}"</div>
                )}
              </div>

              {/* Product grid */}
              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product.productid} className="d-flex col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <div className="product" style={{backgroundColor: '#EEEEEE'}}>
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          className="img d-flex align-items-center justify-content-center"
                          src={getImageUrl(product.image)}
                          alt="Error"
                          style={{height: '250px', width: '255px', objectFit: 'fill'}}
                        />
                      </div>
                      <div className="text text-center">
                        <div className="row hoverIcons col-12">
                          <div className="col-12 mb-2">
                            <a 
                              href={`/sportify/product-single/${product.productid}`}
                              className="btn btn-success btn-sm"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </div>
                        <h2>{product.productname}</h2>
                        <p className="mb-0">
                          <p>
                            Giá gốc:
                            <del>{formatPrice(product.price)}</del>
                          </p>
                          <p>
                            Giá bán: <span className="price">{formatPrice(product.discountprice)}</span>
                          </p>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="row mt-5">
                {/* Pagination can be added here if needed */}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-3">
              {/* Category sidebar */}
              <div className="sidebar-box">
                <div className="categories">
                  <h3>
                    <a href="/sportify/product">Loại sản phẩm</a>
                  </h3>
                  <ul className="p-0">
                    <li>
                      <button 
                        type="button" 
                        className={`btn btn-link ${selectedCategory === null ? 'fw-bold text-primary' : 'text-muted'}`} 
                        onClick={() => setSelectedCategory(null)}
                        style={{textDecoration: 'none', padding: 0, border: 'none', background: 'none'}}
                      >
                        Tất cả
                      </button>
                    </li>
                    {categoryList.map((category) => (
                      <li key={category.categoryid}>
                        <button 
                          type="button" 
                          className={`btn btn-link ${selectedCategory === category.categoryid ? 'fw-bold text-primary' : 'text-muted'}`} 
                          onClick={() => setSelectedCategory(category.categoryid)}
                          style={{textDecoration: 'none', padding: 0, border: 'none', background: 'none'}}
                        >
                          {category.categoryname}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;