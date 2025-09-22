import React, { useEffect, useState } from 'react';
import CustomCard from '../../../components/user/CustomCard';

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
        const res = await fetch('http://localhost:8081/api/sportify/product');
        const data = await res.json();
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
      <section className="ftco-section m-2">
        <div className="container">
          <div className="row">
            <form onSubmit={handleSearchSubmit} className="mb-0 d-flex justify-content-center col-md-12">
              <input value={searchText} onChange={(e) => setSearchText(e.target.value)} name="searchText" className="form-control me-2 col-6" type="search" placeholder="Tìm kiếm theo tên" aria-label="Search" />
              <button className="btn btn-outline-success col-2" type="submit">Search</button>
            </form>

            <div className="d-flex justify-content-center col-md-12 mt-1">
              <div className="mr-4 col-md-8" />
            </div>

            <div className="col-md-9">
              <div className="col-md-12" />

              <div className="row">
                {filteredProducts.map((product) => (
                  <div key={product.productid} className="d-flex col-xl-4 col-lg-4 col-md-6 col-sm-12">
                    <CustomCard id={product.productid}
                      title={product.productname}
                      link={`/sportify/product-single/${product.productid}`}
                      image={`/user/images/${product.image}`}
                      badgeText={formatPrice(product.discountprice)}
                      badgeColor="bg-success"
                      description={product.descriptions} 
                        extraInfo={product.categories ? product.categories.categoryname : 'Chưa phân loại'}
                        buttonText="Xem chi tiết"
                        buttonColor="btn-success"
                      />
                  </div>
                ))}
              </div>

            </div>

            <div className="col-md-3">
              <div className="sidebar-box ftco-animate">
                <div className="categories">
                  <h5 className="mb-3">Loại sản phẩm</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <button type="button" className={`btn btn-sm btn-link ${selectedCategory === null ? 'fw-bold text-primary' : 'text-muted'}`} onClick={() => setSelectedCategory(null)}>
                        Tất cả
                      </button>
                    </li>
                    {categoryList.map((category) => (
                      <li key={category.categoryid} className="mb-2">
                        <button type="button" className={`btn btn-sm btn-link ${selectedCategory === category.categoryid ? 'fw-bold text-primary' : 'text-muted'}`} onClick={() => setSelectedCategory(category.categoryid)}>
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