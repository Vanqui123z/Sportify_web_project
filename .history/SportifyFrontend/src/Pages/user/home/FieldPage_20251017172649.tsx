import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFieldList } from '../../../service/user/home/fieldApi';
import Loader from "../../../components/user/Loader";
import getImageUrl from "../../../helper/getImageUrl";
import { useFtcoAnimation } from "../../../helper/useFtcoAnimation";
import HeroSection from "../../../components/user/Hero";
import NearestFieldFinder from "../../../components/user/NearestFieldFinder";
import "../../../styles/NearestFieldFinder.css";
type Category = {
  sporttypeid: string;
  categoryname: string;
};

type Shift = {
  shiftid: number;
  nameshift: string;
  starttime: string;
  endtime: string;
};

type FieldItem = {
  fieldid: number;
  sporttypeid: string;
  namefield: string;
  descriptionfield: string;
  price: number;
  image: string;
  address: string;
  status: boolean;
  sporttype?: Category;
};

export default function FieldPage() {
  const [loading, setLoading] = useState(true);
  const [cates, setCates] = useState<Category[]>([]);
  const [shift, setShift] = useState<Shift[]>([]);
  const [fieldList, setFieldList] = useState<FieldItem[]>([]);
  const [fieldDistances, setFieldDistances] = useState<Record<number, string>>({});
  const [isNearestSearch, setIsNearestSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("tatca");
  const [selectedShift, setSelectedShift] = useState<number | "">("");
  const [dateInput, setDateInput] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");
  
  const [searchParams] = useSearchParams();

  // Utility: set min date to today (run unconditionally so hooks order is stable)
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    setDateInput(yyyy + "-" + mm + "-" + dd);
  }, []);

  useEffect(() => {
    // Check if we're coming from nearest fields search
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const categoryParam = searchParams.get('categorySelect') || 'tatca';
    
    if (latitude && longitude) {
      // This is a nearest fields search
      setIsNearestSearch(true);
      setSelectedCategory(categoryParam);
      
      // Fetch nearest fields data
      console.log('Đang gọi API tìm sân gần nhất với tọa độ:', latitude, longitude, 'và loại sân:', categoryParam);
      // Kiểm tra lại tọa độ trước khi gọi API
      // Đảm bảo tọa độ phù hợp với Việt Nam
      let validLatitude = parseFloat(latitude || "0");
      let validLongitude = Math.abs(parseFloat(longitude || "0")); // Đảm bảo longitude dương
      
      // Kiểm tra xem tọa độ có nằm trong khu vực Việt Nam hay không
      if (validLatitude < 8 || validLatitude > 23 || validLongitude < 102 || validLongitude > 109) {
        console.log('Tọa độ nằm ngoài Việt Nam:', validLatitude, validLongitude);
        console.log('Sử dụng tọa độ mặc định TP.HCM');
        validLatitude = 10.7769;
        validLongitude = 106.7;
      }
      
      console.log('Đang gọi API với tọa độ đã kiểm tra:', validLatitude, validLongitude);
      
      // Thêm tham số maxDistance để mở rộng phạm vi tìm kiếm
      fetch(`/api/sportify/field/nearest?latitude=${validLatitude}&longitude=${validLongitude}&categorySelect=${categoryParam}&limit=50&maxDistance=25`)
        .then(response => {
          console.log('Trạng thái phản hồi:', response.status);
          if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dữ liệu nhận được:', data);
          setCates(data.cates || []);
          setShift(data.shift || []);
          setFieldList(data.fieldList || []);
          setFieldDistances(data.fieldDistances || {});
          console.log('Số sân tìm thấy:', (data.fieldList || []).length);
          
          if ((data.fieldList || []).length === 0) {
            console.log('Không tìm thấy sân nào gần vị trí của bạn trong bán kính tìm kiếm.');
            setError("Không tìm thấy sân nào gần vị trí của bạn trong bán kính tìm kiếm. Vui lòng thử lại sau hoặc chọn một khu vực khác.");
          }
        })
        .catch(err => {
          console.error("Lỗi khi lấy dữ liệu sân gần nhất:", err);
          setError(err.message || "Không thể tìm sân gần nhất. Vui lòng thử lại sau.");
        })
        .finally(() => setLoading(false));
    } else {
      // Normal field list fetch
      fetchFieldList()
        .then((data) => {
          setCates(data.cates || []);
          setShift(data.shift || []);
          setFieldList(data.fieldList || []);
        })
        .catch((err) => console.error("Error fetching fields:", err))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  if (loading) return <Loader />;
  
  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger m-4 text-center">
          <h4>Đã xảy ra lỗi khi tìm sân gần nhất</h4>
          <p>{error}</p>
          <button className="btn btn-primary mt-3" onClick={() => {
            setError(null);
            window.location.href = '/sportify/field';
          }}>
            Quay lại trang sân bóng
          </button>
        </div>
      </div>
    );
  }

  // Derived filtered and sorted list
  const filtered = fieldList
    .filter((f) => {
      if (!f) return false;
      if (selectedCategory && selectedCategory !== "tatca") {
        return f.sporttype?.sporttypeid === selectedCategory || f.sporttypeid === selectedCategory;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const handleSort = (order: "asc" | "desc" | "") => {
    setSortOrder(order);
  };
  return (
    <div>
      <HeroSection
        backgroundImage="/user/images/backgroundField.gif"
        title="Sân"
        breadcrumbs={[
          { label: "Trang Chủ", href: "/sportify" },
          { label: "Sân" }
        ]}
      />
      <section className="ftco-section">
        <div className="container">
          <div className="row">
            <div className="col-11 d-flex justify-content-center">
              <h4 className="col-9"
                style={{ color: '#187498', fontFamily: 'times-new-roman', fontWeight: 600, paddingLeft: '0px' }}>
                Tìm kiếm sân trống
              </h4>
            </div>

            <div className="col-12 mb-4 pb-4 d-flex justify-content-center">
              <div className="row w-100 align-items-center">
                {/* Thêm component tìm sân gần nhất */}
                <div className="col-md-3 mb-3">
                  <NearestFieldFinder 
                    className="w-100" 
                    categorySelect={selectedCategory}
                  />
                </div>
                
                <div className="col-md-2">
                  <input
                    style={{
                      borderTop: '3px solid #28a745',
                      borderLeft: '3px solid #28a745',
                      borderBottom: '3px solid #28a745',
                      fontWeight: 'lighter'
                    }}
                    id="dateInput"
                    name="dateInput"
                    value={dateInput}
                    required
                    className="form-control rounded-0"
                    type="date"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={(e) => setDateInput(e.target.value)}
                    min={dateInput}
                  />
                </div>
                
                <div className="col-md-2">
                  <select
                    style={{
                      borderTop: '3px solid #28a745',
                      borderLeft: '3px solid #28a745',
                      borderBottom: '3px solid #28a745',
                      fontWeight: 'lighter'
                    }}
                    name="categorySelect"
                    className="form-control rounded-0 custom-select"
                    id="inputGroupSelect01"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {cates.map((c) => (
                      <option key={c.sporttypeid} value={c.sporttypeid}>
                        {c.categoryname}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-3">
                  <select
                    style={{
                      borderTop: '3px solid #28a745',
                      borderLeft: '3px solid #28a745',
                      borderBottom: '3px solid #28a745',
                      fontWeight: 'lighter'
                    }}
                    name="shiftSelect"
                    className="form-control rounded-0 custom-select"
                    aria-label="Tìm kiếm theo tên"
                    id="inputGroupSelect02"
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">Chọn ca</option>
                    {shift.map((s) => (
                      <option key={s.shiftid} value={s.shiftid}>
                        {s.nameshift}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <button
                    style={{ border: '3px solid #28a745' }}
                    className="rounded-0 btn btn-success w-100"
                    type="button"
                    onClick={() => handleSort("")}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="sidebar-box ">
                <div className="list-group">
                  <h4 className="text-center border-bottom font-weight-bold text-success py-2">
                    LOẠI SÂN
                  </h4>
                  {cates.map((c) => (
                    <button
                      key={c.sporttypeid}
                      type="button"
                      style={{ fontSize: '18px' }}
                      className={`list-group-item list-group-item-action ${
                        c.sporttypeid === selectedCategory 
                          ? 'active bg-success text-white' 
                          : ''
                      }`}
                      onClick={() => setSelectedCategory(c.sporttypeid)}
                    >
                      {c.categoryname}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="row mb-4">
                <div className="col-md-12 d-flex justify-content-end align-items-center">
                  <div className="dropdown filter">
                    <button
                      className="btn btn-success dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Lọc
                    </button>
                    <div className="dropdown-menu dropdown-menu-end filter-item" aria-labelledby="dropdownMenuButton">
                      <button className="dropdown-item" type="button" onClick={() => handleSort("")}>
                        Mặc định
                      </button>
                      <button className="dropdown-item" type="button" onClick={() => handleSort("asc")}>
                        Giá tăng dần
                      </button>
                      <button className="dropdown-item" type="button" onClick={() => handleSort("desc")}>
                        Giá giảm dần
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row d-flex">
                {filtered.length === 0 ? (
                  <div className="col-12">
                    <div className="alert alert-info text-center">Không có sân phù hợp.</div>
                  </div>
                ) : (
                  filtered.map((e) => (
                    <div key={e.fieldid} className="col-lg-12 d-flex align-items-stretch  mb-3">
                      <div className="blog-entry d-flex w-100 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ flexShrink: 0, width: '200px', height: '200px' }}>
                          <img
                            className="img"
                            src={getImageUrl(e.image)}
                            alt="Image"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        </div>
                        <div className="text p-4 bg-light d-flex flex-column" style={{ flex: 1 }}>
                          <div className="meta mb-2">
                            <div>
                              <span className="text-info">
                                <i className="fa fa-map-marker mr-2"></i>
                                {e.address}
                              </span>
                              {fieldDistances[e.fieldid] && (
                                <span className="ml-2 badge bg-info text-white" style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  marginLeft: '10px',
                                  fontSize: '11px',
                                  padding: '4px 8px'
                                }}>
                                  <i className="fa fa-walking mr-1" style={{ marginRight: '4px' }}></i>
                                  Cách bạn {fieldDistances[e.fieldid]}
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="heading mb-2">
                            <a 
                              href={`/sportify/field/detail/${e.fieldid}`}
                              className="text-decoration-none text-dark"
                              style={{ fontSize: '1.5rem', fontWeight: '600' }}
                            >
                              {e.namefield}
                            </a>
                            {fieldDistances[e.fieldid] && (
                              <span className="distance-badge ml-2" style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                marginLeft: '8px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}>
                                <i className="fa fa-location-arrow" style={{ marginRight: '4px' }}></i> 
                                {fieldDistances[e.fieldid]}
                              </span>
                            )}
                          </h3>
                          <p className="font-weight-bold mb-2">
                            Loại sân: {' '}
                            <span className="text-success">
                              {e.sporttype?.categoryname}
                            </span>
                          </p>
                          <div className="d-flex align-items-center justify-content-between mt-auto">
                            <a
                              href={`/sportify/field/detail/${e.fieldid}`}
                              className="btn btn-success px-4 py-2"
                            >
                              Chọn sân này
                            </a>
                            <span className="text-danger font-weight-bold" style={{ fontSize: '1.25rem' }}>
                              {e.price.toLocaleString()} VND
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}