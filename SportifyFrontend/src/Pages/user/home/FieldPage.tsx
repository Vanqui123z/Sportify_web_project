import { useEffect, useState } from "react";
import Loader from "../../../components/user/Loader";

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
  const [cateNotAll, setCateNotAll] = useState<Category[]>([]);
  const [shift, setShift] = useState<Shift[]>([]);
  const [fieldList, setFieldList] = useState<FieldItem[]>([]);

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
    fetch("http://localhost:8081/api/sportify/field")
      .then((res) => res.json())
      .then((data) => {
        setCates(data.cates || []);
        setCateNotAll(data.cateNotAll || []);
        setShift(data.shift || []);
        setFieldList(data.fieldList || []);
      })
      .catch((err) => console.error("Error fetching fields:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

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
 

      <section className="py-5" style={{ backgroundImage: "url('/user/images/backgroundField.gif')", backgroundSize: 'cover' }}>
        <div className="container text-center text-white">
          <h2 className="display-5">Sân</h2>
        </div>
      </section>

      <main className="container my-5">
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <h4 className="text-start">Tìm kiếm sân trống</h4>
          </div>

          <div className="col-12">
            <form className="row g-2 align-items-center">
              <div className="col-md-3">
                <input
                  id="dateInput"
                  type="date"
                  className="form-control"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  min={dateInput}
                />
              </div>

              <div className="col-md-3">
                <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {cateNotAll.length > 0 && cateNotAll.map((c) => (
                    <option key={c.sporttypeid} value={c.sporttypeid}>{c.categoryname}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select className="form-select" value={selectedShift} onChange={(e) => setSelectedShift(e.target.value ? Number(e.target.value) : "") }>
                  <option value="">Chọn ca</option>
                  {shift.map((s) => (
                    <option key={s.shiftid} value={s.shiftid}>{s.nameshift}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 d-flex">
                <button type="button" className="btn btn-success me-2" onClick={() => handleSort("")}>Mặc định</button>
                <button type="button" className="btn btn-outline-success me-2" onClick={() => handleSort("asc")}>Giá tăng dần</button>
                <button type="button" className="btn btn-outline-success" onClick={() => handleSort("desc")}>Giá giảm dần</button>
              </div>
            </form>
          </div>

          <aside className="col-md-3 mt-4">
            <div className="list-group">
              <h5 className="list-group-item">LOẠI SÂN</h5>
              {cates.map((c) => (
                <button key={c.sporttypeid} type="button" className={`list-group-item list-group-item-action ${c.sporttypeid === selectedCategory ? 'active' : ''}`} onClick={() => setSelectedCategory(c.sporttypeid)}>
                  {c.categoryname}
                </button>
              ))}
            </div>
          </aside>

          <section className="col-md-9 mt-4">
            <div className="row g-4">
              {filtered.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-info">Không có sân phù hợp.</div>
                </div>
              ) : (
                filtered.map((e) => (
                  <div key={e.fieldid} className="col-lg-6">
                    <div className="card h-100 shadow-sm">
                      <div style={{ position: 'relative' }}>
                        <img src={`/user/images/${e.image}`} className="card-img-top" alt={e.namefield} style={{ height: 220, objectFit: 'cover' }} />
                        <span className="badge bg-danger rounded-pill" style={{ position: 'absolute', right: 12, top: 12 }}>
                          {e.price.toLocaleString()} VND
                        </span>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title"><a href={`/sportify/field/detail/${e.fieldid}`} className="text-decoration-none">{e.namefield}</a></h5>
                        <p className="text-muted mb-2"><i className="fas fa-map-marker-alt me-1"></i>{e.address}</p>
                        <p className="text-truncate" style={{ maxHeight: 72 }}>{e.descriptionfield}</p>
                        <div className="mt-auto d-flex justify-content-end">
                          <a href={`/sportify/field/detail/${e.fieldid}`} className="btn btn-success">Chọn sân này</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}