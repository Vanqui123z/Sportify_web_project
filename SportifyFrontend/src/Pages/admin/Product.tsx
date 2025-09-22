import React, { useEffect, useState } from "react";

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

interface ErrorField {
  field?: string;
  message: string;
}
const VITE_CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || "";
const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<ErrorField[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [search, setSearch] = useState({
    searchName: "",
    searchCate: "",
    searchStatus: "",
  });

  // Fetch all products and categories
  useEffect(() => {
    fetch("http://localhost:8081/rest/products/getAll")
      .then(res => res.json())
      .then(data => setProducts(data));
    fetch("http://localhost:8081/rest/categories/getAll")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.searchName) params.append("productname", search.searchName);
    if (search.searchCate) params.append("categoryid", search.searchCate);
    if (search.searchStatus) params.append("productstatus", search.searchStatus);
    fetch(`http://localhost:8081/rest/products/search?${params}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ searchName: "", searchCate: "", searchStatus: "" });
    fetch("http://localhost:8081/rest/products/getAll")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  // Add product handler
  const handleAddProduct = () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "image"
        ) {
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, String(value));
          }
        }
      });
      // Thêm file ảnh nếu có
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      console.log("formData", Array.from(formData.entries()));
      fetch("http://localhost:8081/rest/products/create", {
        method: "POST",
        body: formData,
      })
        .then(async res => {
          if (!res.ok) {
            const err = await res.json();
            setErrors((err.errors || []).map((msg: string) => ({ message: msg })));
            return;
          }
          return res.json();
        })
        .then(data => {
          alert("Thêm sản phẩm thành công");
          if (data) {
            setProducts(prev => [...prev, data]);
            setShowAdd(false);
            setForm({});
            setErrors([]);
          }
        });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.");
    }
  };

  // Edit product handler
  const handleEditProduct = () => {
    if (!form.productid) return;
    fetch(`http://localhost:8081/rest/products/update/${form.productid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          setErrors((err.errors || []).map((msg: string) => ({ message: msg })));
          return;
        }
        return res.json();
      })
      .then(data => {
        alert("Cập nhật sản phẩm thành công");
        if (data) {
          setProducts(prev => prev.map(p => p.productid === data.productid ? data : p));
          setShowEdit(false);
          setForm({});
          setErrors([]);
        }
      });
  };

  // Delete product handler
  const handleDeleteProduct = (productid: number) => {
    fetch(`http://localhost:8081/rest/products/delete/${productid}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        alert("Xóa sản phẩm thành công");
        setProducts(prev => prev.filter(p => p.productid !== productid));
        setShowEdit(false);
      });
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setForm(product);
    setShowEdit(true);
    setErrors([]);
  };

  // Handle form change
  const handleFormChange = (field: keyof Product, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  // Handle image upload
  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      setImageFile(files[0]);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="container-fluid page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Sản phẩm</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Sản phẩm</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => { setShowAdd(true); setForm({}); setErrors([]); }}>
              <i className="fa fa-plus"></i> Thêm mới sản phẩm
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {/* Search Filter */}
        <form className="row g-2 mb-3">
          <div className="col-sm-6 col-md-3">
            <input type="text" className="form-control"
              placeholder="Tên sản phẩm"
              value={search.searchName}
              onChange={e => setSearch(s => ({ ...s, searchName: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <select className="form-select"
              value={search.searchCate}
              onChange={e => setSearch(s => ({ ...s, searchCate: e.target.value }))}
            >
              <option value="">Tất cả</option>
              {categories.map(c => (
                <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-6 col-md-2">
            <select className="form-select"
              value={search.searchStatus}
              onChange={e => setSearch(s => ({ ...s, searchStatus: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="1">Đang bán</option>
              <option value="0">Ngưng bán</option>
            </select>
          </div>
          <div className="col-sm-6 col-md-2">
            <button type="button" className="btn btn-success w-100" onClick={handleSearch}>Tìm kiếm</button>
          </div>
          <div className="col-sm-6 col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={handleRefresh}>Làm mới</button>
          </div>
        </form>
        {/* /Search Filter */}

        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Loại sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Giảm giá</th>
                    <th>Ngày tạo</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Số lượng</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, idx) => (
                    <tr key={item.productid}>
                      <td>{idx + 1}</td>
                      <td>{item.categories?.categoryname || ""}</td>
                      <td>{item.productname}</td>
                      <td>
                        <img
                          src={
                            item.image
                              ? item.image.startsWith("v")
                                ? `${VITE_CLOUDINARY_BASE_URL}/${item.image}`
                                : `/user/images/${item.image}`
                              : "/user/images/default.png"
                          }
                          width={100}
                          height={100}
                          style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee", background: "#fafbfc" }}
                          alt={item.productname}
                        />
                      </td>
                      <td>{formatCurrency(item.discountprice)}</td>
                      <td>{formatDate(item.datecreate)}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.productstatus ? "Đang bán" : "Ngưng bán"}</td>
                      <td>{item.quantity}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => openEditModal(item)}>
                          <i className="fa fa-pencil me-1"></i> Xem chi tiết
                        </button>
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteProduct(item.productid)}>
                          <i className="fa fa-trash me-1"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm mới sản phẩm</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-12 text-center mb-3">
                        <label htmlFor="image" className="form-label">
                          <img
                            src={
                              form.image
                                ? form.image.startsWith("v") // hoặc form.image.includes("/")
                                  ? `${VITE_CLOUDINARY_BASE_URL}/${form.image}`
                                  : `/user/images/${form.image}`
                                : "/user/images/default.png" // fallback nếu null
                            }
                            width="70%"
                            style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee", background: "#fafbfc" }}
                            alt={form.productname}
                          />
                        </label>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Tên sản phẩm <span className="text-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={form.productname || ""}
                            onChange={e => handleFormChange("productname", e.target.value)}
                          />
                          {errors.filter(e => e.field === "productname").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Giảm giá <span className="text-danger">*</span></label>
                          <input className="form-control" type="number"
                            value={form.discountprice || ""}
                            onChange={e => handleFormChange("discountprice", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "discountprice").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Hình ảnh <span className="text-danger">*</span></label>
                          <input type="file"
                            className="form-control"
                            id="image"
                            onChange={e => handleImageChange(e.target.files)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Ngày tạo <span className="text-danger">*</span></label>
                          <input className="form-control" type="date"
                            value={form.datecreate || ""}
                            onChange={e => handleFormChange("datecreate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Trạng thái <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.productstatus === undefined ? "" : form.productstatus ? "1" : "0"}
                            onChange={e => handleFormChange("productstatus", e.target.value === "1")}
                          >
                            <option value="1">Đang bán</option>
                            <option value="0">Ngưng bán</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Số lượng <span className="text-danger">*</span></label>
                          <input type="number"
                            className="form-control"
                            value={form.quantity || ""}
                            onChange={e => handleFormChange("quantity", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "quantity").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Loại sản phẩm <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.categoryid || ""}
                            onChange={e => handleFormChange("categoryid", Number(e.target.value))}
                          >
                            <option value="">Chọn loại sản phẩm</option>
                            {categories.map(c => (
                              <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Giá <span className="text-danger">*</span></label>
                          <input type="number"
                            className="form-control"
                            value={form.price || ""}
                            onChange={e => handleFormChange("price", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "price").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Mô tả <span className="text-danger">*</span></label>
                          <textarea className="form-control"
                            value={form.descriptions || ""}
                            onChange={e => handleFormChange("descriptions", e.target.value)}
                          />
                          {errors.filter(e => e.field === "descriptions").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                        Thêm sản phẩm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-12 text-center mb-3">
                        <label htmlFor="image" className="form-label">
                        <img
                            src={
                              form.image
                                ? form.image.startsWith("v") // hoặc form.image.includes("/")
                                  ? `${VITE_CLOUDINARY_BASE_URL}/${form.image}`
                                  : `/user/images/${form.image}`
                                : "/user/images/default.png" // fallback nếu null
                            }
                            width="60%"
                            style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #eee", background: "#fafbfc" }}
                            alt={form.productname}
                          />    
                        </label>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Tên sản phẩm <span className="text-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={form.productname || ""}
                            onChange={e => handleFormChange("productname", e.target.value)}
                          />
                          {errors.filter(e => e.field === "productname").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Giảm giá <span className="text-danger">*</span></label>
                          <input className="form-control" type="number"
                            value={form.discountprice || ""}
                            onChange={e => handleFormChange("discountprice", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "discountprice").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Hình ảnh <span className="text-danger">*</span></label>
                          <input type="file"
                            className="form-control"
                            id="image"
                            onChange={e => handleImageChange(e.target.files)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Ngày tạo <span className="text-danger">*</span></label>
                          <input className="form-control" type="date"
                            value={form.datecreate || ""}
                            onChange={e => handleFormChange("datecreate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Trạng thái <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.productstatus === undefined ? "" : form.productstatus ? "1" : "0"}
                            onChange={e => handleFormChange("productstatus", e.target.value === "1")}
                          >
                            <option value="1">Đang bán</option>
                            <option value="0">Ngưng bán</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Số lượng <span className="text-danger">*</span></label>
                          <input type="number"
                            className="form-control"
                            value={form.quantity || ""}
                            onChange={e => handleFormChange("quantity", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "quantity").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Loại sản phẩm <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.categoryid || ""}
                            onChange={e => handleFormChange("categoryid", Number(e.target.value))}
                          >
                            <option value="">Chọn loại sản phẩm</option>
                            {categories.map(c => (
                              <option key={c.categoryid} value={c.categoryid}>{c.categoryname}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Giá <span className="text-danger">*</span></label>
                          <input type="number"
                            className="form-control"
                            value={form.price || ""}
                            onChange={e => handleFormChange("price", Number(e.target.value))}
                          />
                          {errors.filter(e => e.field === "price").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Mô tả <span className="text-danger">*</span></label>
                          <textarea className="form-control"
                            value={form.descriptions || ""}
                            onChange={e => handleFormChange("descriptions", e.target.value)}
                          />
                          {errors.filter(e => e.field === "descriptions").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      <button type="button" className="btn btn-primary" onClick={handleEditProduct}>
                        Chỉnh sửa sản phẩm
                      </button>
                      <button type="button" className="btn btn-danger ms-2" onClick={() => handleDeleteProduct(form.productid as number)}>
                        Xóa sản phẩm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast/Notification */}
        <div id="toast"></div>
      </div>
    </div>
  );
};

export default ProductPage;
