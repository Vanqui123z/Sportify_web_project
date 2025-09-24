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
    <div className="page-wrapper">
      {/* Page Content */}
      <div className="content container-fluid">
        
        <div className="row">
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
              <div className="card-body">
                <span className="dash-widget-icon"><i className="fa fa-user"></i></span>
                <div className="dash-widget-info">
                  <h3>{stats.countOrderInDate}</h3>
                  <span>Phiếu đặt hàng trong ngày</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
              <div className="card-body">
                <span className="dash-widget-icon"><i className="fa fa-usd"></i></span>
                <div className="dash-widget-info">
                  <h3>{stats.countBookingInDate}</h3>
                  <span>Phiếu đặt sân trong ngày</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
              <div className="card-body">
                <span className="dash-widget-icon"><i className="fa fa-diamond"></i></span>
                <div className="dash-widget-info">
                  <h3>{stats.countFieldActiving}</h3>
                  <span>Sân đang hoạt động</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
              <div className="card-body">
                <span className="dash-widget-icon"><i className="fa fa-cubes"></i></span>
                <div className="dash-widget-info">
                  <h3>{stats.countProductActive}</h3>
                  <span>Sản phẩm đang bày bán</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-lg-12 col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-body">
                <h4 className="card-title">Thống kê lịch đặt sân trong ngày</h4>
                <div className="statistics">
                  <div className="row">
                    <div className="col-md-6 col-6 text-center">
                      <div className="stats-box mb-4">
                        <p>Tổng số lịch đặt sân trong ngày</p>
                        <h3>{bookingStats.total}</h3>
                      </div>
                    </div>
                    <div className="col-md-6 col-6 text-center">
                      <div className="stats-box mb-4">
                        <p>Doanh thu</p>
                        <h3>{formatCurrency(bookingStats.revenue)}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="progress mb-4">
                  <div className="progress-bar bg-purple" role="progressbar"
                    style={{width: `${calculatePercentage(bookingStats.completed, bookingStats.total)}%`}} aria-valuenow={parseInt(calculatePercentage(bookingStats.completed, bookingStats.total))}
                    aria-valuemin={0} aria-valuemax={100}>{calculatePercentage(bookingStats.completed, bookingStats.total)}%</div>

                  <div className="progress-bar bg-warning" role="progressbar"
                    style={{width: `${calculatePercentage(bookingStats.deposit, bookingStats.total)}%`}} aria-valuenow={parseInt(calculatePercentage(bookingStats.deposit, bookingStats.total))}
                    aria-valuemin={0} aria-valuemax={100}>{calculatePercentage(bookingStats.deposit, bookingStats.total)}%</div>

                  <div className="progress-bar bg-danger" role="progressbar"
                    style={{width: `${calculatePercentage(bookingStats.cancelled, bookingStats.total)}%`}} aria-valuenow={parseInt(calculatePercentage(bookingStats.cancelled, bookingStats.total))}
                    aria-valuemin={0} aria-valuemax={100}>{calculatePercentage(bookingStats.cancelled, bookingStats.total)}%</div>
                </div>

                <div>
                  <p>
                    <i className="fa fa-dot-circle-o text-purple mr-2"></i>Hoàn thành <span
                      className="float-right">{bookingStats.completed}</span>
                  </p>
                  <p>
                    <i className="fa fa-dot-circle-o text-warning mr-2"></i>Đã đặt cọc <span
                      className="float-right">{bookingStats.deposit}</span>
                  </p>

                  <p>
                    <i className="fa fa-dot-circle-o text-danger mr-2"></i>Hủy đặt <span
                      className="float-right">{bookingStats.cancelled}</span>
                  </p>

                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-12 col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-body">
                <h4 className="card-title">Thống kê đơn hàng trong ngày</h4>
                <div className="statistics">
                  <div className="row">
                    <div className="col-md-6 col-6 text-center">
                      <div className="stats-box mb-4">
                        <p>Tổng số đơn hàng trong ngày</p>
                        <h3>{orderStats.total}</h3>
                      </div>
                    </div>
                    <div className="col-md-6 col-6 text-center">
                      <div className="stats-box mb-4">
                        <p>Doanh thu</p>
                        <h3>{formatCurrency(orderStats.revenue)}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="progress mb-4">
                  <div className="progress-bar bg-purple" role="progressbar"
                    style={{width: `${calculatePercentage(orderStats.paid, orderStats.total)}%`}}
                    aria-valuenow={parseInt(calculatePercentage(orderStats.paid, orderStats.total))} aria-valuemin={0}
                    aria-valuemax={100}>{calculatePercentage(orderStats.paid, orderStats.total)}%</div>

                  <div className="progress-bar bg-warning" role="progressbar"
                    style={{width: `${calculatePercentage(orderStats.unpaid, orderStats.total)}%`}}
                    aria-valuenow={parseInt(calculatePercentage(orderStats.unpaid, orderStats.total))} aria-valuemin={0}
                    aria-valuemax={100}>{calculatePercentage(orderStats.unpaid, orderStats.total)}%</div>
                </div>

                <div>
                  <p>
                    <i className="fa fa-dot-circle-o text-purple mr-2"></i>Đã thanh toán
                    <span className="float-right">{orderStats.paid}</span>
                  </p>
                  <p>
                    <i className="fa fa-dot-circle-o text-warning mr-2"></i>Chưa thanh
                    toán <span className="float-right">{orderStats.unpaid}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-lg-6 col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-body">
                <h4 className="card-title">
                  Góp ý trong ngày của khách hàng trong ngày <span
                    className="badge bg-inverse-danger ml-2">{stats.countLienHe}</span>
                </h4>
                {contacts.map((contact) => (
                  <div key={contact.contactid} className="leave-info-box">
                    <div className="media align-items-center">
                      <div className="avatar">
                        <img alt="" src={`/user/images/${contact.users.image || 'avatar1.png'}`} />
                      </div>
                      <div className="media-body">
                        <div className="text-sm my-0">{contact.users.firstname + ' ' + contact.users.lastname}</div>
                      </div>
                    </div>
                    <div className="row align-items-center mt-3">
                      <div className="col-6">
                        <h6 className="mb-0">{formatDate(contact.datecontact)}</h6>
                        <span className="text-sm text-muted">{contact.title}</span>
                      </div>
                      <div className="col-6 text-right">
                        <span className="badge bg-inverse-danger">{contact.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="load-more text-center">
                  <a className="text-dark" href="/admin/contacts">Xem thêm</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Statistics Widget */}

        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill">
              <div className="card-header">
                <h3 className="card-title mb-0">Top 3 sân được đặt nhiều nhất</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap custom-table mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên sân</th>
                        <th>Giá sân</th>
                        <th>Số lần đặt</th>
                        <th>Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topFields.map((field, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{field.name}</td>
                          <td>{formatCurrency(field.price)}</td>
                          <td>{field.bookings}</td>
                          <td>{formatCurrency(field.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer">
                <a href="/admin/fields">Xem tất cả sân</a>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill">
              <div className="card-header">
                <h3 className="card-title mb-0">Top 3 sản phẩm bán được nhiều nhất</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table custom-table table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá sản phẩm</th>
                        <th>Số lượt bán</th>
                        <th>Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>{product.sales}</td>
                          <td>{formatCurrency(product.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer">
                <a href="/admin/products">Xem tất cả sản phẩm</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* /Page Content */}
    </div>
  );
};

export default Dashboard;
