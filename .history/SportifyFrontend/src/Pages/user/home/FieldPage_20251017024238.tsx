import { useEffect, useState, useCallback } from "react";
import { fetchFieldList } from '../../../service/user/home/fieldApi';
import Loader from "../../../components/user/Loader";
import getImageUrl from "../../../helper/getImageUrl";
import { useFtcoAnimation } from "../../../helper/useFtcoAnimation";
import HeroSection from "../../../components/user/Hero";
import NearbyFieldFilter from "../../../components/user/NearbyFieldFilter";
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

type Location = {
  latitude: number | null;
  longitude: number | null;
}

type FieldItem = {
  fieldid: number;
  sporttypeid: string;
  namefield: string;
  descriptionfield: string;
  price: number;
  image: string;
  address: string;
  status: boolean;
  latitude?: number | null;
  longitude?: number | null;
  sporttype?: Category;
  distance?: number | null;
  location?: Location;
};

export default function FieldPage() {
  const [loading, setLoading] = useState(true);
  const [cates, setCates] = useState<Category[]>([]);
  const [shift, setShift] = useState<Shift[]>([]);
  const [fieldList, setFieldList] = useState<FieldItem[]>([]);
  const [filteredByLocation, setFilteredByLocation] = useState<FieldItem[]>([]);
  const [isNearbyFilterActive, setIsNearbyFilterActive] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("tatca");
  const [selectedShift, setSelectedShift] = useState<number | "">("");
  const [dateInput, setDateInput] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");

  // Utility: set min date to today (run unconditionally so hooks order is stable)
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    setDateInput(yyyy + "-" + mm + "-" + dd);
  }, []);

  useEffect(() => {
    fetchFieldList()
      .then((data) => {
        setCates(data.cates || []);
        setShift(data.shift || []);
        
        // Convert fields to have proper location structure for NearbyFieldFilter
        const fieldsWithLocation = (data.fieldList || []).map((field: FieldItem) => ({
          ...field,
          location: {
            latitude: field.latitude || null,
            longitude: field.longitude || null
          }
        }));
        
        setFieldList(fieldsWithLocation);
      })
      .catch((err) => console.error("Error fetching fields:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  // Handler for nearby filter
  const handleNearbyFilter = useCallback((nearbyFields: FieldItem[]) => {
    setFilteredByLocation(nearbyFields);
    setIsNearbyFilterActive(nearbyFields.length > 0);
  }, []);
  
  // Prepare fields for the NearbyFieldFilter component by adding location data
  const fieldsForNearbyFilter = fieldList.map(field => ({
    ...field,
    location: {
      latitude: field.latitude || null,
      longitude: field.longitude || null
    }
  }));

  // Derived filtered and sorted list
  const filtered = (isNearbyFilterActive ? filteredByLocation : fieldList)
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
      // If nearby filter is active and no other sorting, sort by distance
      if (isNearbyFilterActive && sortOrder === "") {
        return (a.distance || 9999) - (b.distance || 9999);
      }
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
              <div className="sidebar-box mb-4">
                <NearbyFieldFilter 
                  fields={fieldList}
                  onFilterChange={handleNearbyFilter}
                />
              </div>
              
              <div className="sidebar-box">
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
                              {e.distance && (
                                <span className="ml-2 badge badge-success">
                                  <i className="fa fa-location-arrow mr-1"></i>
                                  {e.distance} km
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