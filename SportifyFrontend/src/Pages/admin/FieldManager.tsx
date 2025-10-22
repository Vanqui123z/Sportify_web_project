import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Table, Alert, Button } from 'react-bootstrap';
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
interface FieldUsageDTO {
  fieldId: number;
  date: string;
  total: number;
}

interface FieldUsageDetailDTO {
  fieldId: number;
  fieldName: string;
  oneTimeBookings: number;
  permanentBookings: number;
  totalBookings: number;
}

const FieldManager: React.FC = () => {
  // State variables
  const [dailyUsageData, setDailyUsageData] = useState<FieldUsageDTO[]>([]);
  const [monthlyUsageData, setMonthlyUsageData] = useState<FieldUsageDTO[]>([]);
  const [dailyTotal, setDailyTotal] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [dailyDetailData, setDailyDetailData] = useState<FieldUsageDetailDTO[]>([]);
  const [monthlyDetailData, setMonthlyDetailData] = useState<FieldUsageDetailDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [search, setSearch] = useState({
    fieldName: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch initial data
  useEffect(() => {
    fetchDailyData();
    fetchMonthlyData();
    fetchTotalData();
    fetchDailyDetailData(selectedDate);
    fetchMonthlyDetailData(selectedMonth);
  }, []);

  // Fetch data when date/month changes
  useEffect(() => {
    fetchDailyDetailData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchMonthlyDetailData(selectedMonth);
  }, [selectedMonth]);

  // Data fetching functions
  const fetchDailyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/field-usage/by-day');
      setDailyUsageData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch daily usage data');
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/field-usage/by-month');
      setMonthlyUsageData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch monthly usage data');
      setLoading(false);
    }
  };

  const fetchTotalData = async () => {
    try {
      setLoading(true);
      const dailyTotalResponse = await axios.get('http://localhost:8081/api/field-usage/daily-total');
      setDailyTotal(dailyTotalResponse.data);
      
      const monthlyTotalResponse = await axios.get('http://localhost:8081/api/field-usage/monthly-total');
      setMonthlyTotal(monthlyTotalResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch total usage data');
      setLoading(false);
    }
  };

  const fetchDailyDetailData = async (date: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/field-usage/detail/by-date?date=${date}`);
      setDailyDetailData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch daily detail data');
      setLoading(false);
    }
  };

  const fetchMonthlyDetailData = async (yearMonth: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/field-usage/detail/by-month?yearMonth=${yearMonth}`);
      setMonthlyDetailData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch monthly detail data');
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = () => {
    // Here would be the implementation for searching based on field name and date range
    // This would require additional API endpoints not specified in the documentation
    console.log("Search with params:", search);
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ fieldName: "", fromDate: "", toDate: "" });
    fetchDailyData();
    fetchMonthlyData();
    fetchTotalData();
    fetchDailyDetailData(selectedDate);
    fetchMonthlyDetailData(selectedMonth);
  };

  // Prepare chart data
  const prepareDailyChartData = () => {
    // Group by date
    const dates = Array.from(new Set(dailyUsageData.map(item => item.date))).sort();
    const fieldIds = Array.from(new Set(dailyUsageData.map(item => item.fieldId)));
    
    const datasets = fieldIds.map(fieldId => {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      
      return {
        label: `Field ${fieldId}`,
        data: dates.map(date => {
          const usage = dailyUsageData.find(item => item.fieldId === fieldId && item.date === date);
          return usage ? usage.total : 0;
        }),
        backgroundColor: color,
      };
    });

    return {
      labels: dates,
      datasets,
    };
  };

  const prepareMonthlyChartData = () => {
    // Group by month
    const months = Array.from(new Set(monthlyUsageData.map(item => item.date))).sort();
    const fieldIds = Array.from(new Set(monthlyUsageData.map(item => item.fieldId)));
    
    const datasets = fieldIds.map(fieldId => {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      
      return {
        label: `Field ${fieldId}`,
        data: months.map(month => {
          const usage = monthlyUsageData.find(item => item.fieldId === fieldId && item.date === month);
          return usage ? usage.total : 0;
        }),
        backgroundColor: color,
      };
    });

    return {
      labels: months,
      datasets,
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
        text: 'Field Usage Statistics',
      },
    },
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="page-wrapper py-4">
      <div className="container bg-white rounded shadow-sm p-4">
        {/* Page Header */}
        <div className="row align-items-center mb-4">
          <div className="col">
            <h3 className="mb-0">Field Usage Management</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Field Usage</li>
              </ol>
            </nav>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <i className="fa fa-print"></i> Print Report
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Dashboard Cards */}
        <div className="row mb-4">
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Daily Bookings</h5>
                <p className="display-4 mb-0 fw-bold text-primary">{dailyTotal}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Monthly Bookings</h5>
                <p className="display-4 mb-0 fw-bold text-success">{monthlyTotal}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">One-Time Bookings</h5>
                <p className="display-4 mb-0 fw-bold text-info">
                  {dailyDetailData.reduce((sum, item) => sum + item.oneTimeBookings, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Permanent Bookings</h5>
                <p className="display-4 mb-0 fw-bold text-warning">
                  {dailyDetailData.reduce((sum, item) => sum + item.permanentBookings, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <form className="row g-2 mb-4">
          <div className="col-sm-12 col-md-4">
            <input type="text" className="form-control"
              placeholder="Field name"
              value={search.fieldName}
              onChange={e => setSearch(s => ({ ...s, fieldName: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <input type="date" className="form-control"
              placeholder="From Date"
              value={search.fromDate}
              onChange={e => setSearch(s => ({ ...s, fromDate: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <input type="date" className="form-control"
              placeholder="To Date"
              value={search.toDate}
              onChange={e => setSearch(s => ({ ...s, toDate: e.target.value }))}
            />
          </div>
          <div className="col-sm-6 col-md-2">
            <button type="button" className="btn btn-success w-100" onClick={handleSearch}>
              <i className="fa fa-search me-1"></i> Search
            </button>
          </div>
          <div className="col-sm-6 col-md-2">
            <button type="button" className="btn btn-secondary w-100" onClick={handleRefresh}>
              <i className="fa fa-refresh me-1"></i> Refresh
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
              Daily Usage
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly Usage
            </button>
          </li>
        </ul>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{activeTab === 'daily' ? 'Daily' : 'Monthly'} Field Usage Chart</h5>
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
                  dailyUsageData.length > 0 ? (
                    <Bar data={prepareDailyChartData()} options={chartOptions} />
                  ) : (
                    <p className="text-center">No daily usage data available</p>
                  )
                ) : (
                  monthlyUsageData.length > 0 ? (
                    <Bar data={prepareMonthlyChartData()} options={chartOptions} />
                  ) : (
                    <p className="text-center">No monthly usage data available</p>
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
                <h5 className="mb-0">{activeTab === 'daily' ? 'Daily' : 'Monthly'} Field Usage Details</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Field ID</th>
                        <th>Field Name</th>
                        <th>One-Time Bookings</th>
                        <th>Permanent Bookings</th>
                        <th>Total Bookings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === 'daily' ? (
                        dailyDetailData.length > 0 ? (
                          dailyDetailData.map((item, idx) => (
                            <tr key={item.fieldId}>
                              <td>{idx + 1}</td>
                              <td>{item.fieldId}</td>
                              <td>{item.fieldName}</td>
                              <td>{item.oneTimeBookings}</td>
                              <td>{item.permanentBookings}</td>
                              <td>{item.totalBookings}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">No data available for selected date</td>
                          </tr>
                        )
                      ) : (
                        monthlyDetailData.length > 0 ? (
                          monthlyDetailData.map((item, idx) => (
                            <tr key={item.fieldId}>
                              <td>{idx + 1}</td>
                              <td>{item.fieldId}</td>
                              <td>{item.fieldName}</td>
                              <td>{item.oneTimeBookings}</td>
                              <td>{item.permanentBookings}</td>
                              <td>{item.totalBookings}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">No data available for selected month</td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="table-secondary">
                        <td colSpan={3}><strong>Total</strong></td>
                        <td>
                          <strong>
                            {activeTab === 'daily' 
                              ? dailyDetailData.reduce((sum, item) => sum + item.oneTimeBookings, 0)
                              : monthlyDetailData.reduce((sum, item) => sum + item.oneTimeBookings, 0)}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {activeTab === 'daily'
                              ? dailyDetailData.reduce((sum, item) => sum + item.permanentBookings, 0)
                              : monthlyDetailData.reduce((sum, item) => sum + item.permanentBookings, 0)}
                          </strong>
                        </td>
                        <td>
                          <strong>
                            {activeTab === 'daily'
                              ? dailyDetailData.reduce((sum, item) => sum + item.totalBookings, 0)
                              : monthlyDetailData.reduce((sum, item) => sum + item.totalBookings, 0)}
                          </strong>
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
                <h5 className="mb-0">Most Booked Fields</h5>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Field Name</th>
                      <th>Total Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === 'daily' ? dailyDetailData : monthlyDetailData)
                      .sort((a, b) => b.totalBookings - a.totalBookings)
                      .slice(0, 5)
                      .map((item, idx) => (
                        <tr key={item.fieldId}>
                          <td>{idx + 1}</td>
                          <td>{item.fieldName}</td>
                          <td>{item.totalBookings}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Booking Type Ratio</h5>
              </div>
              <div className="card-body">
                <div className="text-center p-4">
                  <div className="d-flex justify-content-center">
                    <div className="px-3">
                      <h6>One-Time</h6>
                      <div className="display-6 text-primary">
                        {activeTab === 'daily'&& Math.round((dailyDetailData.reduce((sum, item) => sum + item.oneTimeBookings, 0) / 
                              (dailyDetailData.reduce((sum, item) => sum + item.totalBookings, 0) || 1)) * 100)
                          
                        }%
                      </div>
                    </div>
                    <div className="px-3">
                      <h6>Permanent</h6>
                      <div className="display-6 text-warning">
                        {activeTab === 'daily'&&
                          Math.round((dailyDetailData.reduce((sum, item) => sum + item.permanentBookings, 0) / 
                              (dailyDetailData.reduce((sum, item) => sum + item.totalBookings, 0) || 1)) * 100)
                          
                        }%
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

export default FieldManager;
