import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";

interface DashboardStats {
  countOrderInDate: number;
  countBookingInDate: number;
  countFieldActiving: number;
  countProductActive: number;
  countLienHe: number;
}

interface BookingStats {
  total: number;
  completed: number;
  deposit: number;
  cancelled: number;
  revenue: number;
}

interface OrderStats {
  total: number;
  paid: number;
  unpaid: number;
  revenue: number;
}

interface ContactItem {
  contactid: string;
  title: string;
  category: string;
  datecontact: string;
  users: {
    firstname: string;
    lastname: string;
    image?: string;
  };
}

interface TopField {
  name: string;
  price: number;
  bookings: number;
  revenue: number;
}

interface TopProduct {
  name: string;
  price: number;
  sales: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<DashboardStats>({
    countOrderInDate: 0,
    countBookingInDate: 0,
    countFieldActiving: 0,
    countProductActive: 0,
    countLienHe: 0,
  });
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    completed: 0,
    deposit: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    paid: 0,
    unpaid: 0,
    revenue: 0,
  });
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [topFields, setTopFields] = useState<TopField[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    // Fetch dashboard data from APIs
    fetchDashboardStats();
    fetchBookingStats();
    fetchOrderStats();
    fetchRecentContacts();
    fetchTopFields();
    fetchTopProducts();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Replace with actual API calls
      setStats({
        countOrderInDate: 15,
        countBookingInDate: 8,
        countFieldActiving: 12,
        countProductActive: 45,
        countLienHe: 3,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchBookingStats = async () => {
    try {
      setBookingStats({
        total: 25,
        completed: 18,
        deposit: 5,
        cancelled: 2,
        revenue: 15000000,
      });
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      setOrderStats({
        total: 20,
        paid: 15,
        unpaid: 5,
        revenue: 8500000,
      });
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  const fetchRecentContacts = async () => {
    try {
      setContacts([
        {
          contactid: "1",
          title: "Góp ý về dịch vụ",
          category: "Góp ý",
          datecontact: "2024-01-15",
          users: {
            firstname: "Nguyễn",
            lastname: "Văn A",
            image: "avatar1.jpg",
          },
        },
        {
          contactid: "2",
          title: "Phản hồi sản phẩm",
          category: "Phản hồi",
          datecontact: "2024-01-14",
          users: {
            firstname: "Trần",
            lastname: "Thị B",
            image: "avatar2.jpg",
          },
        },
      ]);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchTopFields = async () => {
    try {
      setTopFields([
        { name: "Sân bóng đá A", price: 300000, bookings: 45, revenue: 13500000 },
        { name: "Sân tennis B", price: 250000, bookings: 38, revenue: 9500000 },
        { name: "Sân cầu lông C", price: 150000, bookings: 52, revenue: 7800000 },
      ]);
    } catch (error) {
      console.error("Error fetching top fields:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      setTopProducts([
        { name: "Áo thể thao Nike", price: 150000, sales: 120, revenue: 18000000 },
        { name: "Giày bóng đá Adidas", price: 800000, sales: 45, revenue: 36000000 },
        { name: "Quần short Puma", price: 80000, sales: 95, revenue: 7600000 },
      ]);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0 ₫";
    }
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("vi-VN");

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  };

  return (
    <div className="container-fluid py-4">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-gradient-primary rounded-3 p-4 text-black">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h3 mb-1">Chào mừng trở lại, <strong>{user?.username || 'Admin'}!</strong></h2>
                <p className="mb-0 opacity-75">Hôm nay là {new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="text-end d-none d-md-block">
                <i className="fa fa-chart-line fa-3x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body position-relative">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i className="fa fa-shopping-cart fa-2x text-primary"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h2 mb-1 fw-bold text-primary">{stats.countOrderInDate}</h3>
                  <p className="text-muted mb-0 small">Đơn hàng hôm nay</p>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-2">
                <i className="fa fa-arrow-trend-up text-success small"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body position-relative">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <i className="fa fa-calendar-check fa-2x text-success"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h2 mb-1 fw-bold text-success">{stats.countBookingInDate}</h3>
                  <p className="text-muted mb-0 small">Lịch đặt sân hôm nay</p>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-2">
                <i className="fa fa-arrow-trend-up text-success small"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body position-relative">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <i className="fa fa-futbol fa-2x text-warning"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h2 mb-1 fw-bold text-warning">{stats.countFieldActiving}</h3>
                  <p className="text-muted mb-0 small">Sân đang hoạt động</p>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-2">
                <i className="fa fa-check-circle text-success small"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="card border-0 shadow-sm h-100 overflow-hidden">
            <div className="card-body position-relative">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <i className="fa fa-cube fa-2x text-info"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h2 mb-1 fw-bold text-info">{stats.countProductActive}</h3>
                  <p className="text-muted mb-0 small">Sản phẩm đang bán</p>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 p-2">
                <i className="fa fa-box text-info small"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="row g-4 mb-4">
        {/* Booking Analytics */}
        <div className="col-xl-4 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Thống kê đặt sân hôm nay</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fa fa-ellipsis-h"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="/admin/bookings">Xem chi tiết</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row text-center mb-4">
                <div className="col-6">
                  <div className="border-end pe-3">
                    <h4 className="h3 text-primary mb-1">{bookingStats.total}</h4>
                    <p className="text-muted small mb-0">Tổng lịch đặt</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ps-3">
                    <h4 className="h5 text-success mb-1">{formatCurrency(bookingStats.revenue)}</h4>
                    <p className="text-muted small mb-0">Doanh thu</p>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-medium">Tiến độ hoàn thành</span>
                  <span className="small text-muted">{calculatePercentage(bookingStats.completed, bookingStats.total)}%</span>
                </div>
                <div className="progress mb-3" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar bg-success rounded" 
                    style={{ width: `${calculatePercentage(bookingStats.completed, bookingStats.total)}%` }}
                  ></div>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${calculatePercentage(bookingStats.deposit, bookingStats.total)}%` }}
                  ></div>
                  <div 
                    className="progress-bar bg-danger" 
                    style={{ width: `${calculatePercentage(bookingStats.cancelled, bookingStats.total)}%` }}
                  ></div>
                </div>
              </div>

              {/* Legend */}
              <div className="d-flex justify-content-between small">
                <span><i className="fa fa-circle text-success me-1"></i>Hoàn thành ({bookingStats.completed})</span>
                <span><i className="fa fa-circle text-warning me-1"></i>Đã cọc ({bookingStats.deposit})</span>
                <span><i className="fa fa-circle text-danger me-1"></i>Hủy ({bookingStats.cancelled})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Analytics */}
        <div className="col-xl-4 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Thống kê đơn hàng hôm nay</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fa fa-ellipsis-h"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="/admin/order-products">Xem chi tiết</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row text-center mb-4">
                <div className="col-6">
                  <div className="border-end pe-3">
                    <h4 className="h3 text-primary mb-1">{orderStats.total}</h4>
                    <p className="text-muted small mb-0">Tổng đơn hàng</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ps-3">
                    <h4 className="h5 text-success mb-1">{formatCurrency(orderStats.revenue)}</h4>
                    <p className="text-muted small mb-0">Doanh thu</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-medium">Thanh toán</span>
                  <span className="small text-muted">{calculatePercentage(orderStats.paid, orderStats.total)}%</span>
                </div>
                <div className="progress mb-3" style={{ height: "10px" }}>
                  <div 
                    className="progress-bar bg-success rounded" 
                    style={{ width: `${calculatePercentage(orderStats.paid, orderStats.total)}%` }}
                  ></div>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${calculatePercentage(orderStats.unpaid, orderStats.total)}%` }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between small">
                <span><i className="fa fa-circle text-success me-1"></i>Đã thanh toán ({orderStats.paid})</span>
                <span><i className="fa fa-circle text-warning me-1"></i>Chưa thanh toán ({orderStats.unpaid})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="col-xl-4 col-lg-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">Góp ý khách hàng</h5>
                <span className="badge bg-danger rounded-pill">{stats.countLienHe}</span>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {contacts.map((contact, index) => (
                  <div key={contact.contactid} className="d-flex align-items-start p-3 bg-light rounded-3">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                        <i className="fa fa-user text-primary"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 small fw-bold">{contact.users.firstname} {contact.users.lastname}</h6>
                      <p className="text-muted small mb-2">{contact.title}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{formatDate(contact.datecontact)}</small>
                        <span className="badge bg-primary small">{contact.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <a href="/admin/contacts" className="btn btn-outline-primary btn-sm">
                  <i className="fa fa-eye me-1"></i> Xem tất cả
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performance Tables */}
      <div className="row g-4">
        {/* Top Fields */}
        <div className="col-xl-6 col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="fa fa-trophy text-warning me-2"></i>
                  Top 3 sân được đặt nhiều nhất
                </h5>
                <a href="/admin/fields" className="btn btn-sm btn-outline-primary">Xem tất cả</a>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">#</th>
                      <th className="border-0">Tên sân</th>
                      <th className="border-0">Giá sân</th>
                      <th className="border-0 text-center">Lượt đặt</th>
                      <th className="border-0 text-end">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFields.map((field, index) => (
                      <tr key={index} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center">
                            <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : 'bg-success'} me-2`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="fw-medium">{field.name}</td>
                        <td>{formatCurrency(field.price)}</td>
                        <td className="text-center">
                          <span className="badge bg-primary rounded-pill">{field.bookings}</span>
                        </td>
                        <td className="text-end text-success fw-bold">{formatCurrency(field.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-xl-6 col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="fa fa-medal text-success me-2"></i>
                  Top 3 sản phẩm bán chạy nhất
                </h5>
                <a href="/admin/products" className="btn btn-sm btn-outline-primary">Xem tất cả</a>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">#</th>
                      <th className="border-0">Tên sản phẩm</th>
                      <th className="border-0">Giá</th>
                      <th className="border-0 text-center">Đã bán</th>
                      <th className="border-0 text-end">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center">
                            <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : 'bg-success'} me-2`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="fw-medium">{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td className="text-center">
                          <span className="badge bg-success rounded-pill">{product.sales}</span>
                        </td>
                        <td className="text-end text-success fw-bold">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
