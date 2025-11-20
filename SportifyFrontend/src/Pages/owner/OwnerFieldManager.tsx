import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import getImageUrl from '../../helper/getImageUrl';
import { AuthContext } from '../../helper/AuthContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our data
interface FieldUsageDetailDTO {
  fieldId: number;
  fieldName: string;
  fieldImage: string;
  oneTimeBookings: number;
  permanentBookings: number;
  totalBookings: number;
}

const OwnerFieldManager: React.FC = () => {
  const { user } = useContext(AuthContext);
  const ownerUsername = user?.username || '';

  // State variables
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [dailyDetailData, setDailyDetailData] = useState<FieldUsageDetailDTO[]>([]);
  const [monthlyDetailData, setMonthlyDetailData] = useState<FieldUsageDetailDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (!ownerUsername) return;
    fetchDailyDetailData(selectedDate);
    fetchMonthlyDetailData(selectedMonth);
  }, [ownerUsername]);

  // Fetch data when date/month changes
  useEffect(() => {
    if (!ownerUsername) return;
    fetchDailyDetailData(selectedDate);
  }, [selectedDate, ownerUsername]);

  useEffect(() => {
    if (!ownerUsername) return;
    fetchMonthlyDetailData(selectedMonth);
  }, [selectedMonth, ownerUsername]);

  // Helper functions for calculations
  const calculateTotal = (data: FieldUsageDetailDTO[], property: keyof Pick<FieldUsageDetailDTO, 'oneTimeBookings' | 'permanentBookings' | 'totalBookings'>) => {
    return data.reduce((sum, item) => sum + item[property], 0);
  };
  
  const calculatePercentage = (part: number, total: number) => {
    return Math.round((part / (total || 1)) * 100);
  };

  // Data fetching functions - filter by owner
  const fetchDailyDetailData = async (date: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8081/api/field-usage/active-fields/by-date?date=${date}&ownerUsername=${ownerUsername}`
      );
      setDailyDetailData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching daily detail data:', err);
      setError('Không thể tải dữ liệu sử dụng sân theo ngày');
      setDailyDetailData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyDetailData = async (yearMonth: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8081/api/field-usage/active-fields/by-month?yearMonth=${yearMonth}&ownerUsername=${ownerUsername}`
      );
      setMonthlyDetailData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching monthly detail data:', err);
      setError('Không thể tải dữ liệu sử dụng sân theo tháng');
      setMonthlyDetailData([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    if (!ownerUsername) return;
    fetchDailyDetailData(selectedDate);
    fetchMonthlyDetailData(selectedMonth);
  };

  // Prepare chart data based on detail data
  const prepareDailyChartData = () => {
    const fieldNames = dailyDetailData.map(item => item.fieldName);
    const oneTimeData = dailyDetailData.map(item => item.oneTimeBookings);
    const permanentData = dailyDetailData.map(item => item.permanentBookings);
    
    return {
      labels: fieldNames,
      datasets: [
        {
          label: 'Đặt Một Lần',
          data: oneTimeData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Đặt Cố Định',
          data: permanentData,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        }
      ],
    };
  };
  
  const prepareMonthlyChartData = () => {
    const fieldNames = monthlyDetailData.map(item => item.fieldName);
    const oneTimeData = monthlyDetailData.map(item => item.oneTimeBookings);
    const permanentData = monthlyDetailData.map(item => item.permanentBookings);
    
    return {
      labels: fieldNames,
      datasets: [
        {
          label: 'Đặt Một Lần',
          data: oneTimeData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Đặt Cố Định',
          data: permanentData,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Thống Kê Sử Dụng Sân',
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false
      }
    }
  };

  // Helper function for rendering table rows
  const renderTableRows = (data: FieldUsageDetailDTO[]) => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-center">
            {activeTab === 'daily' ? 'Không có dữ liệu cho ngày đã chọn' : 'Không có dữ liệu cho tháng đã chọn'}
          </td>
        </tr>
      );
    }
    
    return data.map((item, idx) => (
      <tr key={item.fieldId}>
        <td>{idx + 1}</td>
        <td>{item.fieldId}</td>
        <td><img src={getImageUrl(item.fieldImage)} alt={item.fieldName} style={{ width: '80px', height: '50px', objectFit: 'cover' }} /></td>
        <td>{item.fieldName}</td>
        <td>{item.oneTimeBookings}</td>
        <td>{item.permanentBookings}</td>
        <td>{item.totalBookings}</td>
      </tr>
    ));
  };

  // Get current data based on active tab
  const getCurrentData = () => activeTab === 'daily' ? dailyDetailData : monthlyDetailData;

  if (!ownerUsername) {
    return (
      <div className="page-wrapper py-4">
        <div className="container bg-white rounded shadow-sm p-4">
          <Alert variant="warning">Vui lòng đăng nhập để xem dữ liệu</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Quản Lý Sử Dụng Sân</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/owner/dashboard">Trang Chủ</a></li>
                <li className="breadcrumb-item active" aria-current="page">Thống Kê Sân</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <i className="fa fa-print"></i> In Báo Cáo
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Alert variant="info">Đang tải dữ liệu...</Alert>}

        {/* Dashboard Cards */}
        <div className="row mb-4">
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Tổng Lượt Đặt Sân</h5>
                <p className="display-4 mb-0 fw-bold text-primary">
                  {calculateTotal(getCurrentData(), 'totalBookings')}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Số Sân Của Tôi</h5>
                <p className="display-4 mb-0 fw-bold text-success">
                  {getCurrentData().length}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Đặt Sân Một Lần</h5>
                <p className="display-4 mb-0 fw-bold text-info">
                  {calculateTotal(getCurrentData(), 'oneTimeBookings')}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Đặt Sân Cố Định</h5>
                <p className="display-4 mb-0 fw-bold text-warning">
                  {calculateTotal(getCurrentData(), 'permanentBookings')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <form className="row g-3 mb-4">
          <div className="col-sm-6 col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={handleRefresh}>
              <i className="fa fa-refresh me-1"></i> Làm Mới
            </button>
          </div>
        </form>
        {/* /Search Filter */}

        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Thống Kê Theo Ngày
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Thống Kê Theo Tháng
            </button>
          </li>
        </ul>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {activeTab === 'daily' ? 'Biểu Đồ Sử Dụng Theo Ngày' : 'Biểu Đồ Sử Dụng Theo Tháng'}
                </h5>
                {activeTab === 'daily' ? (
                  <Form.Control
                    type="date"
                    className="w-auto"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                ) : (
                  <Form.Control
                    type="month"
                    className="w-auto"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                )}
              </div>
              <div className="card-body">
                {activeTab === 'daily' ? (
                  dailyDetailData.length > 0 ? (
                    <Bar data={prepareDailyChartData()} options={chartOptions} />
                  ) : (
                    <p className="text-center">Không có dữ liệu sử dụng theo ngày</p>
                  )
                ) : (
                  monthlyDetailData.length > 0 ? (
                    <Bar data={prepareMonthlyChartData()} options={chartOptions} />
                  ) : (
                    <p className="text-center">Không có dữ liệu sử dụng theo tháng</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Data Table */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  {activeTab === 'daily' ? 'Chi Tiết Sử Dụng Theo Ngày' : 'Chi Tiết Sử Dụng Theo Tháng'}
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>ID Sân</th>
                        <th>Hình Ảnh</th>
                        <th>Tên Sân</th>
                        <th>Đặt Một Lần</th>
                        <th>Đặt Cố Định</th>
                        <th>Tổng Đặt Sân</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderTableRows(getCurrentData())}
                    </tbody>
                    <tfoot>
                      <tr className="table-secondary">
                        <td colSpan={4}><strong>Tổng Cộng</strong></td>
                        <td>
                          <strong>{calculateTotal(getCurrentData(), 'oneTimeBookings')}</strong>
                        </td>
                        <td>
                          <strong>{calculateTotal(getCurrentData(), 'permanentBookings')}</strong>
                        </td>
                        <td>
                          <strong>{calculateTotal(getCurrentData(), 'totalBookings')}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Sân Được Đặt Nhiều Nhất</h5>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Tên Sân</th>
                      <th>Tổng Lượt Đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentData().length > 0 ? (
                      getCurrentData()
                        .sort((a, b) => b.totalBookings - a.totalBookings)
                        .slice(0, 5)
                        .map((item, idx) => (
                          <tr key={item.fieldId}>
                            <td>{idx + 1}</td>
                            <td>{item.fieldName}</td>
                            <td>{item.totalBookings}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">Không có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Tỷ Lệ Loại Đặt Sân</h5>
              </div>
              <div className="card-body">
                <div className="text-center p-4">
                  <div className="d-flex justify-content-center">
                    <div className="px-3">
                      <h6>Đặt Một Lần</h6>
                      <div className="display-6 text-primary">
                        {calculatePercentage(
                          calculateTotal(getCurrentData(), 'oneTimeBookings'), 
                          calculateTotal(getCurrentData(), 'totalBookings')
                        )}%
                      </div>
                    </div>
                    <div className="px-3">
                      <h6>Đặt Cố Định</h6>
                      <div className="display-6 text-warning">
                        {calculatePercentage(
                          calculateTotal(getCurrentData(), 'permanentBookings'), 
                          calculateTotal(getCurrentData(), 'totalBookings')
                        )}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerFieldManager;
