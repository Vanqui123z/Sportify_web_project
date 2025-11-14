const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
import React, { useEffect, useState } from "react";

interface Category {
  categoryid: number;
  categoryname: string;
}

interface ErrorField {
  field?: string;
  message: string;
}

const CategoryProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Category>>({});
  const [errors, setErrors] = useState<ErrorField[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Fetch all categories
  useEffect(() => {
    fetch(`${URL_BACKEND}/rest/categories/getAll`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchName) params.append("categoryname", searchName);
    fetch(`${URL_BACKEND}/rest/categories/search?${params}`)
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearchName("");
    fetch(`${URL_BACKEND}/rest/categories/getAll`)
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  // Add category handler
  const handleAddCategory = () => {
    fetch(`${URL_BACKEND}/rest/categories/create`, {
      method: "POST",
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
        alert("Thêm loại sản phẩm thành công!");
        if (data) {
          setCategories(prev => [...prev, data]);
          setShowAdd(false);
          setForm({});
          setErrors([]);
        }
      });
  };

  // Edit category handler
  const handleEditCategory = () => {
    if (!form.categoryid) return;
    fetch(`${URL_BACKEND}/rest/categories/update/${form.categoryid}`, {
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
        alert("Cập nhật loại sản phẩm thành công!");
        if (data) {
          setCategories(prev => prev.map(c => c.categoryid === data.categoryid ? data : c));
          setShowEdit(false);
          setForm({});
          setErrors([]);
        }
      });
  };

  // Delete category handler
  const handleDeleteCategory = (categoryid: number) => {
    fetch(`${URL_BACKEND}/rest/categories/delete/${categoryid}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        alert("Xóa loại sản phẩm thành công!");
        setCategories(prev => prev.filter(c => c.categoryid !== categoryid));
      });
  };

  // Open edit modal
  const openEditModal = (category: Category) => {
    setForm(category);
    setShowEdit(true);
    setErrors([]);
  };

  // Handle form change
  const handleFormChange = (field: keyof Category, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  return (
    <div className=" page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Loại sản phẩm</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Loại sản phẩm</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => { setShowAdd(true); setForm({}); setErrors([]); }}>
              <i className="fa fa-plus"></i> Thêm loại sản phẩm mới
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {/* Search Filter */}
        <form className="row g-2 mb-3">
          <div className="col-sm-6 col-md-3">
            <input type="text" className="form-control"
              placeholder="Tên loại sản phẩm"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <button type="button" className="btn btn-success w-100" onClick={handleSearch}>Tìm kiếm</button>
          </div>
          <div className="col-sm-6 col-md-3">
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
                    <th>Tên loại sản phẩm</th>
                    <th className="text-center col-md-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, idx) => (
                    <tr key={item.categoryid}>
                      <td>{idx + 1}</td>
                      <td>{item.categoryname}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => openEditModal(item)}>
                          <i className="fa fa-pencil me-1"></i> Xem chi tiết
                        </button>
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteCategory(item.categoryid)}>
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
                  <h5 className="modal-title">Thêm mới loại sản phẩm</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Tên loại sản phẩm <span className="text-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={form.categoryname || ""}
                            onChange={e => handleFormChange("categoryname", e.target.value)}
                          />
                          {errors.filter(e => e.field === "categoryname").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      <button type="button" className="btn btn-primary" onClick={handleAddCategory}>
                        Thêm mới loại sản phẩm
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
                  <h5 className="modal-title">Chỉnh sửa loại sản phẩm</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Tên loại sản phẩm <span className="text-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={form.categoryname || ""}
                            onChange={e => handleFormChange("categoryname", e.target.value)}
                          />
                          {errors.filter(e => e.field === "categoryname").map((e, i) => (
                            <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      <button type="button" className="btn btn-primary" onClick={handleEditCategory}>
                        Chỉnh sửa loại sản phẩm
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

export default CategoryProductPage;
