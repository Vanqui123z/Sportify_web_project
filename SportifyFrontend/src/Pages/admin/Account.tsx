import React, { useEffect, useState } from "react";
import axios from "axios";

interface Account {
  username: string;
  passwords: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  gender: boolean;
  image: string;
  status: boolean;
}

interface ErrorField {
  field: string;
  message: string;
}

const VITE_CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || '';

const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState<Partial<Account>>({});
  const [errors, setErrors] = useState<ErrorField[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [search, setSearch] = useState({
    keyword: "",
    searchUser: "",
    searchStatus: "",
    searchRole: "",
  });
  const [passwordFieldType, setPasswordFieldType] = useState<"password" | "text">("password");
  // Fetch all accounts
  useEffect(() => {
    axios.get("http://localhost:8081/api/rest/accounts/getAll").then(res => {
      setAccounts(res.data);
    });
  }, []);

  // Search handler
  const handleSearch = () => {
    axios.get("http://localhost:8081/api/rest/accounts/search", {
      params: {
        user: search.searchUser,
        keyword: search.keyword,
        status: search.searchStatus,
        role: search.searchRole,
      },
    }).then(res => setAccounts(res.data));
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ keyword: "", searchUser: "", searchStatus: "", searchRole: "" });
    axios.get("http://localhost:8081/api/rest/accounts/getAll").then(res => setAccounts(res.data));
  };

  // Thêm state cho preview ảnh khi chọn
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Sửa handleImageChange để lưu file và preview
  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      setImageFile(files[0]);
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  // Add account handler
  const handleAddAccount = () => {
    const formData = new FormData();
    // Thêm từng trường user vào formData
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value as string);
    });
    // Thêm file ảnh nếu có
    if (imageFile) {
      formData.append("avatarFile", imageFile);
    }
    console.log("Form Data Entries:", Array.from(formData.entries()));
    axios.post("http://localhost:8081/api/rest/accounts/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(res => {
        alert("Thêm tài khoản thành công");
        setAccounts(prev => [...prev, res.data]);
        setShowAdd(false);
        setForm({});
        setErrors([]);
        setImagePreview(null);
        setImageFile(null);
      })
      .catch(err => {
        if (err.response?.data?.errors) setErrors(err.response.data.errors);
      });
  };

  // Edit account handler
  const handleEditAccount = () => {
    if (!form.username) return;
    axios.put(`http://localhost:8081/api/rest/accounts/update/${form.username}`, form)
      .then(res => {
        alert("Cập nhật tài khoản thành công");
        setAccounts(prev => prev.map(acc => acc.username === res.data.username ? res.data : acc));
        setShowEdit(false);
        setForm({});
        setErrors([]);
      })
      .catch(err => {
        if (err.response?.data?.errors) setErrors(err.response.data.errors);
      });
  };

  // Open edit modal
  const openEditModal = (account: Account) => {
    setSelectedAccount(account);
    setForm(account);
    setShowEdit(true);
    setErrors([]);
  };

  const handleDelete=(username: string)=> {
    axios.delete(`http://localhost:8081/api/rest/accounts/delete/${username}`)
    .then(res => {
      alert("Xóa tài khoản thành công");
      setAccounts(prev => prev.filter(acc => acc.username !== username));
    })
    .catch(err => {
      console.error("Failed to delete account:", err);
    });
  }
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordFieldType(prev => prev === "password" ? "text" : "password");
  };

  // Validate rules
  const validators = {
    username: (v: string) => {
      if (!v) return "Username không được để trống";
      if (v.length < 6 || v.length > 15) return "Username từ 6-15 ký tự";
      return "";
    },
    passwords: (v: string) => {
      if (!v) return "Mật khẩu không được để trống";
      if (v.length < 6 || v.length > 15) return "Mật khẩu từ 6-15 ký tự";
      return "";
    },
    firstname: (v: string) => {
      if (!v) return "Họ không được để trống";
      if (!/^[\p{L} ]+$/u.test(v)) return "Họ chỉ chứa chữ và khoảng trắng";
      if (v.length > 50) return "Họ tối đa 50 ký tự";
      return "";
    },
    lastname: (v: string) => {
      if (!v) return "Tên không được để trống";
      if (!/^[\p{L} ]+$/u.test(v)) return "Tên chỉ chứa chữ và khoảng trắng";
      if (v.length > 50) return "Tên tối đa 50 ký tự";
      return "";
    },
    phone: (v: string) => {
      if (!v) return "Số điện thoại không được để trống";
      if (!/^(0|\+84)\d{9,10}$/.test(v)) return "Số điện thoại không hợp lệ";
      return "";
    },
    email: (v: string) => {
      if (!v) return "Email không được để trống";
      if (!/^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(v)) return "Email không hợp lệ";
      return "";
    },
    address: (v: string) => {
      if (!v) return "Địa chỉ không được để trống";
      return "";
    }
  };

  // State cho lỗi realtime
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Hàm validate 1 trường
  const validateField = (field: keyof typeof validators, value: string) => {
    const err = validators[field](value);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
    return err;
  };


  // Sửa handleFormChange để validate realtime
  const handleFormChange = (field: keyof Account, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors([]);
    if (field in validators) {
      validateField(field as keyof typeof validators, value);
    }
  };

  return (
    <div className="container-fluid page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Tài khoản</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/index.html">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Tài khoản</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => { 
              setShowAdd(true); 
              setForm({ gender: true, status: true }); // Thêm mặc định gender và status
              setErrors([]); 
            }}>
              <i className="fa fa-plus"></i> Thêm tài khoản mới
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {/* Search Filter */}
        <form className="row g-2 mb-3">
          <div className="col-sm-6 col-md-2">
            <input type="text" className="form-control"
              placeholder="Họ và tên"
              value={search.keyword}
              onChange={e => setSearch(s => ({ ...s, keyword: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <input type="text" className="form-control"
              placeholder="Username"
              value={search.searchUser}
              onChange={e => setSearch(s => ({ ...s, searchUser: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <select className="form-select"
              value={search.searchStatus}
              onChange={e => setSearch(s => ({ ...s, searchStatus: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="1">Còn hoạt động</option>
              <option value="0">Ngưng hoạt động</option>
            </select>
          </div>
          <div className="col-sm-6 col-md-2">
            <select className="form-select"
              value={search.searchRole}
              onChange={e => setSearch(s => ({ ...s, searchRole: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="col-sm-6 col-md-2 d-flex gap-2">
            <button type="button" className="btn btn-success w-100" onClick={handleSearch}>Tìm kiếm</button>
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
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Giới tính</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((item, idx) => (
                    <tr key={item.username}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img alt="" src={`${VITE_CLOUDINARY_BASE_URL}/${item.image}`} className="rounded-circle me-2" style={{ width: 40, height: 40, objectFit: "cover" }} />
                          <div>
                            <div>{item.firstname + " " + item.lastname}</div>
                            <small className="text-muted">{item.username}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.gender ? "Nam" : "Nữ"}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.username)}>
                          <i className="fa fa-pencil me-1"></i> Xóa
                        </button>
                        <button className="btn btn-outline-primary btn-sm"
                          onClick={() => openEditModal(item)}>
                          <i className="fa fa-pencil me-1"></i> Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm tài khoản mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAdd(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-sm-12 text-center mb-3">
                      <label htmlFor="image" className="form-label">
                        <img
                          src={imagePreview || "https://via.placeholder.com/200x200?text=Avatar"}
                          style={{ maxWidth: "100%", height: 200, objectFit: "cover" }}
                          alt="avatar"
                        />
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Họ <span className="text-danger">*</span></label>
                        <input className="form-control" type="text"
                          value={form.firstname || ""}
                          onChange={e => handleFormChange("firstname", e.target.value)}
                          onBlur={e => validateField("firstname", e.target.value)}
                        />
                        {/* Hiển thị lỗi realtime */}
                        {fieldErrors.firstname && (
                          <div className="badge bg-danger mt-1">{fieldErrors.firstname}</div>
                        )}
                        {/* Hiển thị lỗi từ backend nếu có */}
                        {errors.filter(e => e.field === "firstname").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Tên</label>
                        <input className="form-control" type="text"
                          value={form.lastname || ""}
                          onChange={e => handleFormChange("lastname", e.target.value)}
                          onBlur={e => validateField("lastname", e.target.value)}
                        />
                        {/* Hiển thị lỗi realtime */}
                        {fieldErrors.lastname && (
                          <div className="badge bg-danger mt-1">{fieldErrors.lastname}</div>
                        )}
                        {/* Hiển thị lỗi từ backend nếu có */}
                        {errors.filter(e => e.field === "lastname").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Username <span className="text-danger">*</span></label>
                        <input className="form-control" type="text"
                          value={form.username || ""}
                          onChange={e => handleFormChange("username", e.target.value)}
                          onBlur={e => validateField("username", e.target.value)}
                        />
                        {fieldErrors.username && (
                          <div className="badge bg-danger mt-1">{fieldErrors.username}</div>
                        )}
                        {errors.filter(e => e.field === "username").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Email <span className="text-danger">*</span></label>
                        <input className="form-control" type="email"
                          value={form.email || ""}
                          onChange={e => handleFormChange("email", e.target.value)}
                          onBlur={e => validateField("email", e.target.value)}
                        />
                        {fieldErrors.email && (
                          <div className="badge bg-danger mt-1">{fieldErrors.email}</div>
                        )}
                        {errors.filter(e => e.field === "email").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label>Mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input className="form-control"
                          type={passwordFieldType}
                          value={form.passwords || ""}
                          onChange={e => handleFormChange("passwords", e.target.value)}
                          onBlur={e => validateField("passwords", e.target.value)}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                          <i className={`fa ${passwordFieldType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </button>
                      </div>
                      {errors.filter(e => e.field === "passwords").map((e, i) => (
                        <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                      ))}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Địa chỉ <span className="text-danger">*</span></label>
                        <input type="text"
                          className="form-control"
                          value={form.address || ""}
                          onChange={e => handleFormChange("address", e.target.value)}
                          onBlur={e => validateField("address", e.target.value)}
                        />
                        {fieldErrors.address && (
                          <div className="badge bg-danger mt-1">{fieldErrors.address}</div>
                        )}
                        {errors.filter(e => e.field === "address").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Số điện thoại <span className="text-danger">*</span></label>
                        <input type="text"
                          className="form-control"
                          value={form.phone || ""}
                          onChange={e => handleFormChange("phone", e.target.value)}
                          onBlur={e => validateField("phone", e.target.value)}
                        />
                        {fieldErrors.phone && (
                          <div className="badge bg-danger mt-1">{fieldErrors.phone}</div>
                        )}
                        {errors.filter(e => e.field === "phone").map((e, i) => (
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
                        <label>Giới tính <span className="text-danger">*</span></label>
                        <select className="form-select"
                          value={form.gender === undefined ? "" : form.gender ? "true" : "false"}
                          onChange={e => handleFormChange("gender", e.target.value === "true")}
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Trạng thái <span className="text-danger">*</span></label>
                        <select className="form-select"
                          value={form.status === undefined ? "" : form.status ? "true" : "false"}
                          onChange={e => handleFormChange("status", e.target.value === "true")}
                        >
                          <option value="true">Còn hoạt động</option>
                          <option value="false">Tắt hoạt động</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-end">
                    <button type="button" className="btn btn-primary" onClick={handleAddAccount}>
                      Thêm tài khoản mới
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
                <h5 className="modal-title">Chỉnh sửa tài khoản</h5>
                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-sm-12 text-center mb-3">
                      <label htmlFor="image" className="form-label">
                        <img src={form.image ? `${VITE_CLOUDINARY_BASE_URL}/${form.image}` : "https://via.placeholder.com/200x200?text=Avatar"} style={{ maxWidth: "100%", height: 200, objectFit: "cover" }} alt="avatar" />
                      </label>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Họ <span className="text-danger">*</span></label>
                        <input className="form-control" type="text"
                          value={form.firstname || ""}
                          onChange={e => handleFormChange("firstname", e.target.value)}
                          onBlur={e => validateField("firstname", e.target.value)}
                        />
                        {/* Hiển thị lỗi realtime */}
                        {fieldErrors.firstname && (
                          <div className="badge bg-danger mt-1">{fieldErrors.firstname}</div>
                        )}
                        {/* Hiển thị lỗi từ backend nếu có */}
                        {errors.filter(e => e.field === "firstname").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Tên</label>
                        <input className="form-control" type="text"
                          value={form.lastname || ""}
                          onChange={e => handleFormChange("lastname", e.target.value)}
                          onBlur={e => validateField("lastname", e.target.value)}
                        />
                        {/* Hiển thị lỗi realtime */}
                        {fieldErrors.lastname && (
                          <div className="badge bg-danger mt-1">{fieldErrors.lastname}</div>
                        )}
                        {/* Hiển thị lỗi từ backend nếu có */}
                        {errors.filter(e => e.field === "lastname").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Username <span className="text-danger">*</span></label>
                        <input className="form-control" type="text"
                          value={form.username || ""}
                          onChange={e => handleFormChange("username", e.target.value)}
                          onBlur={e => validateField("username", e.target.value)}
                        />
                        {fieldErrors.username && (
                          <div className="badge bg-danger mt-1">{fieldErrors.username}</div>
                        )}
                        {errors.filter(e => e.field === "username").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Email <span className="text-danger">*</span></label>
                        <input className="form-control" type="email"
                          value={form.email || ""}
                          onChange={e => handleFormChange("email", e.target.value)}
                          onBlur={e => validateField("email", e.target.value)}
                        />
                        {fieldErrors.email && (
                          <div className="badge bg-danger mt-1">{fieldErrors.email}</div>
                        )}
                        {errors.filter(e => e.field === "email").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label>Mật khẩu <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input className="form-control"
                          type={passwordFieldType}
                          value={form.passwords || ""}
                          onChange={e => handleFormChange("passwords", e.target.value)}
                          onBlur={e => validateField("passwords", e.target.value)}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                          <i className={`fa ${passwordFieldType === "password" ? "fa-eye" : "fa-eye-slash"}`}></i>
                        </button>
                      </div>
                      {errors.filter(e => e.field === "passwords").map((e, i) => (
                        <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                      ))}
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Địa chỉ <span className="text-danger">*</span></label>
                        <input type="text"
                          className="form-control"
                          value={form.address || ""}
                          onChange={e => handleFormChange("address", e.target.value)}
                          onBlur={e => validateField("address", e.target.value)}
                        />
                        {fieldErrors.address && (
                          <div className="badge bg-danger mt-1">{fieldErrors.address}</div>
                        )}
                        {errors.filter(e => e.field === "address").map((e, i) => (
                          <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Số điện thoại <span className="text-danger">*</span></label>
                        <input type="text"
                          className="form-control"
                          value={form.phone || ""}
                          onChange={e => handleFormChange("phone", e.target.value)}
                          onBlur={e => validateField("phone", e.target.value)}
                        />
                        {fieldErrors.phone && (
                          <div className="badge bg-danger mt-1">{fieldErrors.phone}</div>
                        )}
                        {errors.filter(e => e.field === "phone").map((e, i) => (
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
                        <label>Giới tính <span className="text-danger">*</span></label>
                        <select className="form-select"
                          value={form.gender === undefined ? "" : form.gender ? "true" : "false"}
                          onChange={e => handleFormChange("gender", e.target.value === "true")}
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Trạng thái <span className="text-danger">*</span></label>
                        <select className="form-select"
                          value={form.status === undefined ? "" : form.status ? "true" : "false"}
                          onChange={e => handleFormChange("status", e.target.value === "true")}
                        >
                          <option value="true">Còn hoạt động</option>
                          <option value="false">Tắt hoạt động</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-end">
                    <button type="button" className="btn btn-primary" onClick={handleEditAccount}>
                      Chỉnh sửa tài khoản
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
  );
};

export default AccountPage;
