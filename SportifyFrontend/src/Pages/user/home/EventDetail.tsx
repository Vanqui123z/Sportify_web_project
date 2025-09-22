import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import getImageUrl from '../../../utils/getImageUrl ';

interface EventDetailData {
  eventdetail: EventItem;
  eventLQ: EventItem[];
}

interface EventItem {
  eventid: number;
  nameevent: string;
  datestart: string;
  dateend?: string;
  image?: string;
  descriptions?: string;
  eventtype?: string;
}

const EventDetail: React.FC = () => {
  const { eventid } = useParams<{ eventid: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [related, setRelated] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!eventid) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8081/api/sportify/eventdetail/${eventid}`);
        if (!res.ok) throw new Error('Failed to fetch event detail');
        const data: EventDetailData = await res.json();
        setEvent(data.eventdetail || null);
        setRelated(data.eventLQ || []);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin sự kiện.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventid]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-danger">{error}</div>;
  if (!event) return <div className="p-4 text-center">Không tìm thấy sự kiện.</div>;

  return (
    <div>
      <section
        className="hero-wrap hero-wrap-2"
        style={{
          backgroundImage: event.image ? `url('/user/images/${event.image}')` : `url('/user/images/eventbanner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 240
        }}
      >
        <div className="overlay" />
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9 ftco-animate mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2"><Link to="/">Trang Chủ <i className="fa fa-chevron-right" /></Link></span>
                <span className="mr-2"><Link to="/sportify/event">Tin Tức <i className="fa fa-chevron-right" /></Link></span>
                <span>{event.nameevent}</span>
              </p>
              <h2 className="mb-0 bread text-white">{event.nameevent}</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section" style={{ backgroundImage: `url('/user/images/bgAll.png')`, backgroundRepeat: 'repeat', backgroundSize: '100% 100%' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm mb-4">
                {event.image && (
                  <img src={getImageUrl(event.image)} alt={event.nameevent} className="card-img-top img-fluid" style={{ objectFit: 'cover', height: 400 }} />
                )}
                <div className="card-body">
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted me-3"><i className="fa fa-calendar me-1" /> {new Date(event.datestart).toLocaleDateString()}</small>
                      {event.dateend && (
                        <small className="text-muted"><i className="fa fa-calendar-o me-1" /> {new Date(event.dateend).toLocaleDateString()}</small>
                      )}
                    </div>
                    <div>
                      <span className="badge bg-primary">{event.eventtype || 'Sự kiện'}</span>
                    </div>
                  </div>

                  <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '1rem' }} className="text-dark">
                    {event.descriptions}
                  </div>

                  <div className="mt-4">
                    <Link to="/sportify/event" className="btn btn-outline-secondary me-2">Quay lại</Link>
                    <a href={`/user/images/${event.image}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary">Xem ảnh lớn</a>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Sự kiện liên quan</h5>
                </div>
                <div className="list-group list-group-flush">
                  {related && related.length > 0 ? (
                    related.map((r) => (
                      <Link key={r.eventid} to={`/sportify/eventdetail/${r.eventid}`} className="list-group-item list-group-item-action d-flex align-items-start">
                        <img src={r.image ? `/user/images/${r.image}` : '/user/images/event3.png'} alt={r.nameevent} style={{ width: 72, height: 64, objectFit: 'cover' }} className="me-3 rounded" />
                        <div>
                          <div className="fw-bold">{r.nameevent}</div>
                          <small className="text-muted">{new Date(r.datestart).toLocaleDateString()}</small>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-muted">Không có sự kiện liên quan.</div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="card-title">Liên hệ</h6>
                  <p className="card-text text-muted">Nếu cần hỗ trợ thêm, vui lòng liên hệ: <br /> <a href="tel:0123456789">0123456789</a> | <a href="mailto:sportify@gmail.com">sportify@gmail.com</a></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default EventDetail;
