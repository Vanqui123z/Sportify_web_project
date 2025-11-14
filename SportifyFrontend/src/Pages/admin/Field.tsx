const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import React, { useEffect, useState } from "react";
import BootstrapModal from "../../components/admin/BootstrapModal";
import "../../styles/AdminModal.css";

// Ensure JSX intrinsic elements are recognized
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface Field {
  fieldid: number;
  sporttypeid: string;
  namefield: string;
  descriptionfield: string;
  price: number;
  image: string;
  address: string;
  status: boolean;
}


interface SportType {
  sporttypeid: string;
  categoryname: string;
}

interface ErrorField {
  field?: string;
  message: string;
}

const VITE_CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL || "";

const FieldPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [form, setForm] = useState<Partial<Field>>({ status: true });
  const [errors, setErrors] = useState<ErrorField[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState({
    namefield: "",
    sporttypeid: "",
    status: "",
  });
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch all fields
  useEffect(() => {
    fetch(`${URL_BACKEND}/rest/fields/getAll`)
      .then(res => res.json())
      .then(data => setFields(data));
    // Fetch sport types
    fetch(`${URL_BACKEND}/rest/sportTypes/getAll`)
      .then(res => res.json())
      .then(data => setSportTypes(data));
  }, []);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.namefield) params.append("namefield", search.namefield);
    if (search.sporttypeid) params.append("sporttypeid", search.sporttypeid);
    if (search.status) params.append("status", search.status);
    fetch(`${URL_BACKEND}/rest/fields/search?${params}`)
      .then(res => res.json())
      .then(data => setFields(data));
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ namefield: "", sporttypeid: "", status: "" });
    fetch(`${URL_BACKEND}/rest/fields/getAll`)
      .then(res => res.json())
      .then(data => setFields(data));
  };

  // Handle image upload
  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      setImageFile(files[0]);
    }
  };

  // Add field handler
  const handleAddField = async () => {
    try {
      const formData = new FormData();
      // Thêm từng trường  vào formData
      Object.entries(form).forEach(([key, value]) => {
        if ((key === "fieldid" || key === "userid") && value === undefined) return;

        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else {
            formData.append(key, value as string);
          }
        }
      });
      // Thêm file ảnh nếu có
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      // Không set Content-Type ở đây!
      const res = await axios.post(`${URL_BACKEND}/rest/fields/create`, formData);
      const data = res.data;
      if (data) {
        alert("Thêm sân thành công");
        setFields(prev => [...prev, data]);
        setShowAdd(false);
        setForm({ status: true });
        setImageFile(null);
        setErrors([]);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors((err.response.data.errors || []).map((msg: string) => ({ message: msg })));
      }
    }
  };

  // Edit field handler
  const handleEditField = async () => {
    if (!form.fieldid) return;
    try {
      // Tạo đối tượng field với sporttype
      const fieldData = {
        ...form,
        status: form.status ?? true,
        sporttype: { sporttypeid: form.sporttypeid }
      };
      delete fieldData.sporttypeid;

      // Chuẩn bị formData
      const formData = new FormData();
      formData.append("field", new Blob([JSON.stringify(fieldData)], { type: "application/json" }));

      // Thêm file ảnh nếu có
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // Gửi request PUT
      const res = await axios.put(
        `${URL_BACKEND}/rest/fields/update/${form.fieldid}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const data = res.data;
      if (data) {
        alert("Cập nhật sân thành công");
        setFields(prev => prev.map(f => f.fieldid === data.fieldid ? data : f));
        setShowEdit(false);
        setForm({ status: true });
        setImageFile(null);
        setErrors([]);
      }
    } catch (err: any) {
      console.error("Error updating field:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors((err.response.data.errors || []).map((msg: string) => ({ message: msg })));
      } else {
        alert("Có lỗi xảy ra khi cập nhật sân thể thao: " + (err.response?.data || err.message));
      }
    }
  };

  // Delete field handler
  const handleDeleteField = (fieldid: number) => {
    fetch(`${URL_BACKEND}/rest/fields/delete/${fieldid}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        alert("Xóa sân thành công");
        setFields(prev => prev.filter(f => f.fieldid !== fieldid));
      });
  };

  // Open edit modal
  const openEditModal = (field: Field & { sporttype?: { sporttypeid: string } }) => {
    // Nếu field.sporttype là object, lấy sporttypeid từ đó
    let sporttypeid = field.sporttypeid;
    if ((field as any).sporttype && (field as any).sporttype.sporttypeid) {
      sporttypeid = (field as any).sporttype.sporttypeid;
    }
    setForm({ ...field, sporttypeid });
    setShowEdit(true);
    setErrors([]);
  };

  // Handle form change
  const handleFormChange = (field: keyof Field, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  // Format currency
  const formatCurrency = (value: number) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className=" page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Sân thể thao</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Sân thể thao</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => { setShowAdd(true); setForm({ status: true }); setErrors([]); }}>
              <i className="fa fa-plus"></i> Thêm mới sân thể thao
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {/* Search Filter */}
        <form className="row g-2 mb-3">
          <div className="col-sm-6 col-md-3">
            <input type="text" className="form-control"
              placeholder="Tên sân thể thao"
              value={search.namefield}
              onChange={e => setSearch(s => ({ ...s, namefield: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-3">
            <input type="text" className="form-control"
              placeholder="Mã môn thể thao"
              value={search.sporttypeid}
              onChange={e => setSearch(s => ({ ...s, sporttypeid: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <select className="form-select"
              value={search.status}
              onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Ngưng hoạt động</option>
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
                    <th>Mã môn thể thao</th>
                    <th>Tên sân</th>
                    <th>Hình ảnh</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Địa chỉ</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, idx) => (
                    <tr key={item.fieldid}>
                      <td>{idx + 1}</td>
                      <td>{item.sporttypeid}</td>
                      <td>{item.namefield}</td>
                      <td>
                        <img
                          src={
                            item.image
                              ? item.image.startsWith("v")
                                ? `${VITE_CLOUDINARY_BASE_URL}/${item.image}`
                                : `/user/images/${item.image}`
                              : "/user/images/default.png"
                          }
                          alt=""
                          style={{
                            width: "70%",
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #eee",
                            background: "#fafbfc"
                          }}
                        />
                      </td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.status ? "Đang hoạt động" : "Ngưng hoạt động"}</td>
                      <td>{item.address}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => openEditModal(item)}>
                          <i className="fa fa-pencil me-1"></i> Xem chi tiết
                        </button>
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteField(item.fieldid)}>
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
        <BootstrapModal
          show={showAdd}
          onHide={() => setShowAdd(false)}
          title="Thêm mới sân thể thao"
          size="lg"
          className="custom-modal"
          bodyClassName="modal-body"
          footer={
            <button type="button" className="btn btn-primary" onClick={handleAddField}>
              Thêm sân thể thao
            </button>
          }
        >
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
                    alt=""
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #eee",
                      background: "#fafbfc"
                    }}
                  />
                </label>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên sân thể thao <span className="text-danger">*</span></label>
                  <input className="form-control" type="text"
                    value={form.namefield || ""}
                    onChange={e => handleFormChange("namefield", e.target.value)}
                  />
                  {errors.filter(e => e.field === "namefield").map((e, i) => (
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
                  <label>Giá sân <span className="text-danger">*</span></label>
                  <input className="form-control" type="number"
                    value={form.price || ""}
                    onChange={e => handleFormChange("price", Number(e.target.value))}
                  />
                  {errors.filter(e => e.field === "price").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Địa chỉ <span className="text-danger">*</span></label>
                  <input className="form-control" type="text"
                    value={form.address || ""}
                    onChange={e => handleFormChange("address", e.target.value)}
                  />
                  {errors.filter(e => e.field === "address").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Môn thể thao <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={form.sporttypeid || ""}
                    onChange={e => handleFormChange("sporttypeid", e.target.value)}
                  >
                    <option value="">-- Chọn môn thể thao --</option>
                    {sportTypes.map(st => (
                      <option key={st.sporttypeid} value={st.sporttypeid}>
                        {st.categoryname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Trạng thái <span className="text-danger">*</span></label>
                  <select className="form-select"
                    value={form.status === undefined ? "1" : form.status ? "1" : "0"}
                    onChange={e => handleFormChange("status", e.target.value === "1")}
                  >
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Ngưng hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <label>Mô tả <span className="text-danger">*</span></label>
                  <textarea className="form-control"
                    value={form.descriptionfield || ""}
                    onChange={e => handleFormChange("descriptionfield", e.target.value)}
                  />
                  {errors.filter(e => e.field === "descriptionfield").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </BootstrapModal>

        {/* Edit Modal */}
        <BootstrapModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          title="Chỉnh sửa sân thể thao"
          size="lg"
          className="fade show"
          bodyClassName=""
          footer={
            <div className="text-end">
              <button type="button" className="btn btn-primary" onClick={handleEditField}>
                Chỉnh sửa sân thể thao
              </button>
              <button type="button" className="btn btn-danger ms-2" onClick={() => handleDeleteField(form.fieldid as number)}>
                Xóa sân thể thao
              </button>
            </div>
          }
        >
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
                    alt=""
                    style={{
                      width: "70%",

                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #eee",
                      background: "#fafbfc"
                    }}
                  />
                </label>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Tên sân thể thao <span className="text-danger">*</span></label>
                  <input className="form-control" type="text"
                    value={form.namefield || ""}
                    onChange={e => handleFormChange("namefield", e.target.value)}
                  />
                  {errors.filter(e => e.field === "namefield").map((e, i) => (
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
                  <label>Giá sân <span className="text-danger">*</span></label>
                  <input className="form-control" type="number"
                    value={form.price || ""}
                    onChange={e => handleFormChange("price", Number(e.target.value))}
                  />
                  {errors.filter(e => e.field === "price").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Địa chỉ <span className="text-danger">*</span></label>
                  <input className="form-control" type="text"
                    value={form.address || ""}
                    onChange={e => handleFormChange("address", e.target.value)}
                  />
                  {errors.filter(e => e.field === "address").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Môn thể thao <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={form.sporttypeid || ""}
                    onChange={e => handleFormChange("sporttypeid", e.target.value)}
                  >
                    <option value="">-- Chọn môn thể thao --</option>
                    {sportTypes.map(st => (
                      <option key={st.sporttypeid} value={st.sporttypeid}>
                        {st.categoryname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Trạng thái <span className="text-danger">*</span></label>
                  <select className="form-select"
                    value={form.status === undefined ? "1" : form.status ? "1" : "0"}
                    onChange={e => handleFormChange("status", e.target.value === "1")}
                  >
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Ngưng hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <label>Mô tả <span className="text-danger">*</span></label>
                  <textarea className="form-control"
                    value={form.descriptionfield || ""}
                    onChange={e => handleFormChange("descriptionfield", e.target.value)}
                  />
                  {errors.filter(e => e.field === "descriptionfield").map((e, i) => (
                    <div key={i} className="badge bg-danger mt-1">{e.message}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-end">
              <button type="button" className="btn btn-primary" onClick={handleEditField}>
                Chỉnh sửa sân thể thao
              </button>
            </div>
          </form>
        </BootstrapModal>
        {/* Toast/Notification */}
        <div id="toast"></div>
      </div>
    </div>
  );
};

export default FieldPage;
