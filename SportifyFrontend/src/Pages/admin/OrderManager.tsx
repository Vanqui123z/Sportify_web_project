import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Legend,
);

// Define interfaces based on the API documentation
interface ProductSalesDTO {
  productId: number;
  productName: string;
  image: string;
  price: number;
  quantitySold: number;
}

interface SalesReportDTO {
  productSales: ProductSalesDTO[];
  totalQuantitySold: number;
  period: 'day' | 'month';
  date: string;
}

const OrderManager: React.FC = () => {
  // State variables
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [salesData, setSalesData] = useState<SalesReportDTO | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState({
    productName: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch sales data based on the active tab
  useEffect(() => {
    if (activeTab === 'daily') {
      fetchDailySales(selectedDate);
    } else {
      fetchMonthlySales(selectedMonth);
    }
  }, [activeTab, selectedDate, selectedMonth]);

  // Fetch daily sales data
  const fetchDailySales = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8081/sportify/rest/sales/by-date?date=${date}`);
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch daily sales data');
      setLoading(false);
    }
  };

  // Fetch monthly sales data
  const fetchMonthlySales = async (month: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:8081/sportify/rest/sales/by-month?month=${month}`);
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch monthly sales data');
      setLoading(false);
    }
  };

  // Search handler
  const handleSearch = () => {
    // This would require an additional API endpoint for searching
    console.log("Search with params:", search);
  };

  // Refresh handler
  const handleRefresh = () => {
    setSearch({ productName: "", fromDate: "", toDate: "" });
    if (activeTab === 'daily') {
      fetchDailySales(selectedDate);
    } else {
      fetchMonthlySales(selectedMonth);
    }
  };

  // Calculate total revenue
  const calculateTotalRevenue = (): number => {
    if (!salesData || !salesData.productSales) return 0;
    return salesData.productSales.reduce((total, product) => 
      total + (product.price * product.quantitySold), 0);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!salesData || !salesData.productSales) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = salesData.productSales.map(product => product.productName);
    const quantities = salesData.productSales.map(product => product.quantitySold);
    const revenues = salesData.productSales.map(product => product.price * product.quantitySold);

    return {
      labels,
      datasets: [
        {
          label: 'Quantity Sold',
          data: quantities,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderWidth: 1,
        },
        {
          label: 'Revenue ($)',
          data: revenues,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderWidth: 1,
        }
      ]
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
        text: 'Product Sales Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
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
            <h3 className="mb-0">Product Sales Management</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent p-0">
                <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active" aria-current="page">Product Sales</li>
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

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Dashboard Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Products Sold</h5>
                <p className="display-4 mb-0 fw-bold text-primary">
                  {salesData?.totalQuantitySold || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Revenue</h5>
                <p className="display-4 mb-0 fw-bold text-success">
                  ${calculateTotalRevenue().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Average Price</h5>
                <p className="display-4 mb-0 fw-bold text-warning">
                  ${salesData?.totalQuantitySold ? 
                    (calculateTotalRevenue() / salesData.totalQuantitySold).toFixed(2) : 
                    "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <form className="row g-2 mb-4">
          <div className="col-sm-12 col-md-4">
            <input type="text" className="form-control"
              placeholder="Product name"
              value={search.productName}
              onChange={e => setSearch(s => ({ ...s, productName: e.target.value }))}
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
              Daily Sales
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly Sales
            </button>
          </li>
        </ul>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{activeTab === 'daily' ? 'Daily' : 'Monthly'} Sales Chart</h5>
                {activeTab === 'daily' ? (
                  <input
                    type="date"
                    className="form-control w-auto"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                ) : (
                  <input
                    type="month"
                    className="form-control w-auto"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                )}
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : salesData?.productSales && salesData.productSales.length > 0 ? (
                  <Bar data={prepareChartData()} options={chartOptions} />
                ) : (
                  <p className="text-center py-5">No sales data available for the selected period.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Sales Table */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Product Sales Details</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : salesData?.productSales && salesData.productSales.length > 0 ? (
                        salesData.productSales.map((product, idx) => (
                          <tr key={product.productId}>
                            <td>{idx + 1}</td>
                            <td>
                              <img 
                                src={`/user/images/${product.image}`} 
                                alt={product.productName} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded border"
                              />
                            </td>
                            <td>{product.productName}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.quantitySold}</td>
                            <td>${(product.price * product.quantitySold).toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">No sales data available for the selected period.</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="table-secondary">
                        <td colSpan={4}><strong>Total</strong></td>
                        <td><strong>{salesData?.totalQuantitySold || 0}</strong></td>
                        <td><strong>${calculateTotalRevenue().toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Top Selling Products</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData?.productSales && salesData.productSales.length > 0 ? (
                        salesData.productSales
                          .slice(0, 5)
                          .map((product, idx) => (
                            <tr key={product.productId}>
                              <td>{idx + 1}</td>
                              <td>{product.productName}</td>
                              <td>{product.quantitySold}</td>
                              <td>${(product.price * product.quantitySold).toFixed(2)}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Sales Period Summary</h5>
              </div>
              <div className="card-body">
                <div className="p-4 text-center">
                  <h4>
                    {activeTab === 'daily' ? 'Daily Sales Report' : 'Monthly Sales Report'}
                  </h4>
                  <p className="text-muted">
                    Period: {salesData?.date ? 
                      (activeTab === 'daily' ? formatDate(salesData.date) : 
                        new Date(salesData.date + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                      ) : '-'}
                  </p>
                  <div className="row mt-4">
                    <div className="col-6">
                      <h5>Total Quantity</h5>
                      <p className="display-6 text-primary">{salesData?.totalQuantitySold || 0}</p>
                    </div>
                    <div className="col-6">
                      <h5>Total Revenue</h5>
                      <p className="display-6 text-success">${calculateTotalRevenue().toFixed(2)}</p>
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

export default OrderManager;
