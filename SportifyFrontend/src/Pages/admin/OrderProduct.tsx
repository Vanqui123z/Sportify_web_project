import React, { useEffect, useState } from "react";

interface User {
  username: string;
  firstname: string;
  lastname: string;
  // ...other fields
}

interface Order {
  orderid: number;
  username: string;
  createdate: string;
  address: string;
  note: string;
  orderstatus: string;
  paymentstatus: boolean;
  totalprice: number;
  users?: User;
  // ...other fields
}

interface OrderDetail {
  orderdetailsid: number;
  price: number;
  quantity: number;
  products: {
    productid: number;
    productname: string;
    // ...other fields
  };
  orders: {
    orderid: number;
    username: string;
    // ...other fields
  };
}

const OrderProductPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<Partial<Order>>({});
  const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState({
    searchName: "",
    searchDate: "",
    searchStatus: "",
    searchPayment: "",
  });

  // Fetch all orders
  useEffect(() => {
    fetch("http://localhost:8081/sportify/rest/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  // Search handler
  const handleSearch = () => {
    const params = new URLSearchParams({
      name: search.searchName,
      date: search.searchDate,
      status: search.searchStatus,
      payment: search.searchPayment,
    });
    fetch(`http://localhost:8081/sportify/rest/orders/search?${params}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ searchName: "", searchDate: "", searchStatus: "", searchPayment: "" });
    fetch("http://localhost:8081/sportify/rest/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  // Open edit modal
  const openEditModal = (order: Order) => {
    setForm(order);
    setShowEdit(true);
    fetch(`http://localhost:8081/rest/orderdetails/${order.orderid}`)
      .then(res => res.json())
      .then(data => setOrderDetail(data));
  };

  // Handle form change
  const handleFormChange = (field: keyof Order, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Update order handler
  const handleUpdateOrder = () => {
    if (!form.orderid) return;
    fetch(`http://localhost:8081/sportify/rest/orders/${form.orderid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        setOrders(prev => prev.map(o => o.orderid === data.orderid ? data : o));
        setShowEdit(false);
      });
  };

  // Confirm order handler
  const handleConfirmOrder = () => {
    if (!form.orderid) return;
    fetch(`http://localhost:8081/sportify/rest/orders/confirm/${form.orderid}`, {
      method: "POST",
    })
      .then(() => handleRefresh());
  };

  // Cancel order handler
  const handleCancelOrder = () => {
    if (!form.orderid) return;
    fetch(`http://localhost:8081/sportify/rest/orders/cancel/${form.orderid}`, {
      method: "POST",
    })
      .then(() => handleRefresh());
  };

  // Format currency
  const formatCurrency = (value: number) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN");
  };

  return (
    <div className="container-fluid page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Đơn hàng</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Đơn hàng</li>
              </ol>
            </nav>
          </div>
        </div>
        {/* /Page Header */}

        {/* Search Filter */}
        <form className="row g-2 mb-3">
          <div className="col-sm-6 col-md-2">
            <label className="form-label">Họ tên người đặt</label>
            <input type="text" className="form-control"
              value={search.searchName}
              onChange={e => setSearch(s => ({ ...s, searchName: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <label className="form-label">Ngày đặt</label>
            <input type="date" className="form-control"
              value={search.searchDate}
              onChange={e => setSearch(s => ({ ...s, searchDate: e.target.value }))}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <label className="form-label">Trạng thái đơn hàng</label>
            <select className="form-select"
              value={search.searchStatus}
              onChange={e => setSearch(s => ({ ...s, searchStatus: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
              <option value="Đang Giao">Đang Giao</option>
              <option value="Hoàn Thành">Hoàn Thành</option>
              <option value="Hủy Đặt">Hủy Đặt</option>
              <option value="Trả Hàng">Trả Hàng</option>
            </select>
          </div>
          <div className="col-sm-2 col-md-2">
            <label className="form-label">Trạng thái thanh toán</label>
            <select className="form-select"
              value={search.searchPayment}
              onChange={e => setSearch(s => ({ ...s, searchPayment: e.target.value }))}
            >
              <option value="">Tất cả</option>
              <option value="1">Đã thanh toán</option>
              <option value="0">Chưa thanh toán</option>
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end gap-2">
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
                    <th>#</th>
                    <th>Người đặt</th>
                    <th>Ngày đặt</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Trạng thái giao hàng</th>
                    <th>Trạng thái thanh toán</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, idx) => (
                    <tr key={item.orderid}>
                      <td>{idx + 1}</td>
                      <td>
                        {item.users
                          ? `${item.users.firstname} ${item.users.lastname}`
                          : item.username}
                      </td>
                      <td>{formatDate(item.createdate)}</td>
                      <td>{item.address}</td>
                      <td>{item.orderstatus}</td>
                      <td>{item.paymentstatus ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                      <td className="text-center">
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

        {/* Edit Modal */}
        {showEdit && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: 1300 }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết phiếu đặt hàng</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Mã phiếu <span className="text-danger">*</span></label>
                          <input className="form-control" type="text" value={form.orderid || ""} readOnly />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Người đặt <span className="text-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={
                              form.users
                                ? `${form.users.firstname} ${form.users.lastname}`
                                : form.username || ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Ngày đặt <span className="text-danger">*</span></label>
                          <input className="form-control" type="text" value={formatDate(form.createdate || "")} readOnly />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Địa chỉ <span className="text-danger">*</span></label>
                          <input className="form-control" type="text" value={form.address || ""} readOnly />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Trạng thái đặt hàng <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.orderstatus || ""}
                            onChange={e => handleFormChange("orderstatus", e.target.value)}
                          >
                            <option value="Trả Hàng">Trả Hàng</option>
                            <option value="Hoàn Thành">Hoàn Thành</option>
                            <option value="Hủy Đặt">Hủy Đặt</option>
                            <option value="Đang Giao">Đang Giao</option>
                            <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Trạng thái thanh toán <span className="text-danger">*</span></label>
                          <select className="form-select"
                            value={form.paymentstatus ? "true" : "false"}
                            onChange={e => handleFormChange("paymentstatus", e.target.value === "true")}
                          >
                            <option value="true">Đã thanh toán</option>
                            <option value="false">Chưa thanh toán</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Thành tiền <span className="text-danger">*</span></label>
                          <input className="form-control" type="text" value={formatCurrency(form.totalprice || 0)} readOnly />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label>Ghi chú</label>
                          <textarea className="form-control" value={form.note || ""} readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 d-flex mt-4">
                      <div className="card card-table flex-fill">
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-nowrap custom-table mb-0">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Tên sản phẩm</th>
                                  <th>Giá</th>
                                  <th>Số lượng</th>
                                  <th>Tổng tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderDetail.map((o, idx) => (
                                  <tr key={o.orderdetailsid}>
                                    <td>{idx + 1}</td>
                                    <td>{o.products.productname}</td>
                                    <td>{formatCurrency(o.price)}</td>
                                    <td>{o.quantity}</td>
                                    <td>{formatCurrency(o.price * o.quantity)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      {form.orderstatus === "Chờ Xác Nhận" && (
                        <>
                          <button type="button" className="btn btn-success me-2" onClick={handleConfirmOrder}>
                            Xác nhận đơn hàng
                          </button>
                          <button type="button" className="btn btn-danger me-2" onClick={handleCancelOrder}>
                            Hủy đơn hàng
                          </button>
                        </>
                      )}
                      <button type="button" className="btn btn-info" onClick={handleUpdateOrder}>
                        Chỉnh sửa đơn hàng
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

export default OrderProductPage;
