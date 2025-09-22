import React, { useEffect, useState } from 'react';
import getImageUrl from '../../../utils/getImageUrl ';

interface EventItem {
  eventid: number;
  nameevent: string;
  datestart: string;
  dateend?: string;
  image?: string;
  descriptions?: string;
  eventtype?: string;
}

interface ApiResponse {
  content: EventItem[];
  totalPages: number;
  number: number; // current page (0-based)
  first: boolean;
  last: boolean;
  totalElements: number;
  size: number;
}

const Event: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(4);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const fetchEvents = async (pageNumber = 0, type = '', key = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNumber));
      params.append('size', String(size));
      if (type) params.append('eventType', type);
      if (key) params.append('keyword', key);

      const res = await fetch(`http://localhost:8081/api/sportify/event?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: ApiResponse = await res.json();
      setEvents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(0, filterType, keyword);
  };

  const handleFilter = (type: string) => {
    const newType = filterType === type ? '' : type; // toggle
    setFilterType(newType);
    fetchEvents(0, newType, keyword);
  };

  const goToPage = (p: number) => {
    if (p < 0 || p >= totalPages) return;
    fetchEvents(p, filterType, keyword);
  };

  // deduplicate event types from fetched events for the filter buttons
  const eventTypes = Array.from(new Set(events.map(e => e.eventtype).filter(Boolean))) as string[];

  return (
    <div>
      {/* Topbar & Navbar omitted - include in layout if needed */}

      {/* Hero section using Bootstrap utilities */}
      <section
        className="text-white py-5"
        style={{
          backgroundImage: `url('/user/images/eventbanner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container text-center py-5">
          <p className="mb-1 small">
            <a href="/" className="text-white text-decoration-none">Trang Chủ</a>
            <span className="mx-2">/</span>
            <span>Tin Tức</span>
          </p>
          <h2 className="display-5 fw-bold">Tin Tức</h2>
          <p className="lead text-white-50">Cập nhật sự kiện, khuyến mãi và thông báo bảo trì mới nhất</p>
        </div>
      </section>

      <section className="py-5" style={{ backgroundImage: `url(/user/images/bgAll.png)` }}>
        <div className="container">
          <div className="row align-items-start mb-4">
            <div className="col-lg-4 mb-3">
              <div className="card bg-dark text-white shadow-sm">
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button type="button" className={`btn ${filterType === '' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter('')}>Tất cả</button>
                    {eventTypes.map((type) => (
                      <button key={type} type="button" className={`btn ${filterType === type ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => handleFilter(type)}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div id="carouselExampleIndicators" className="carousel slide shadow-sm rounded" data-bs-ride="carousel">
                <ol className="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
                  <li data-target="#carouselExampleIndicators" data-slide-to={1} />
                  <li data-target="#carouselExampleIndicators" data-slide-to={2} />
                </ol>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="/user/images/event3.png" className="d-block w-100 img-fluid rounded" alt="slide-1" style={{ maxHeight: 400, objectFit: 'cover' }} />
                  </div>
                  <div className="carousel-item">
                    <img src="/user/images/event4.png" className="d-block w-100 img-fluid rounded" alt="slide-2" style={{ maxHeight: 400, objectFit: 'cover' }} />
                  </div>
                  <div className="carousel-item">
                    <img src="/user/images/event5.png" className="d-block w-100 img-fluid rounded" alt="slide-3" style={{ maxHeight: 400, objectFit: 'cover' }} />
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-md-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Tìm kiếm theo tên..."
                    maxLength={200}
                    aria-label="Search"
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button className="btn btn-success" type="submit">Tìm</button>
                </div>
              </form>
            </div>
          </div>

          <div className="row">
            {loading ? (
              <div className="col-12 text-center py-5">Loading...</div>
            ) : events.length === 0 ? (
              <div className="col-12 text-center py-5">Không tìm thấy sự kiện.</div>
            ) : (
              events.map((ev) => (
                <div key={ev.eventid} className="col-lg-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={ev.image ? getImageUrl(ev.image) : '/user/images/default.png'}
                      className="card-img-top"
                      alt={ev.nameevent}
                      style={{ objectFit: 'cover', height: 220 }}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        <span className="badge bg-info me-2">{ev.eventtype}</span>
                        <small className="text-muted">
                          <i className="fa fa-calendar me-1"></i>
                          {new Date(ev.datestart).toLocaleDateString()}
                          {ev.dateend ? ` - ${new Date(ev.dateend).toLocaleDateString()}` : ""}
                        </small>
                      </div>
                      <h5 className="card-title mb-3">
                        <a href={`/sportify/eventdetail/${ev.eventid}`} className="text-decoration-none text-dark">
                          {ev.nameevent}
                        </a>
                      </h5>
                      <a
                        href={`/sportify/eventdetail/${ev.eventid}`}
                        className="btn btn-outline-primary mt-auto align-self-start"
                      >
                        Xem Chi Tiết <span className="fa fa-long-arrow-right ms-2"></span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="row mt-4">
            <div className="col-12 text-center">
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(page - 1)}>&laquo;</button>
                  </li>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <li key={idx} className={`page-item ${page === idx ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(idx)}>{idx + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages - 1 || totalPages === 0 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(page + 1)}>&raquo;</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Event;