import { useEffect, useState } from "react";
import Loader from "../../../components/user/Loader";
import type { User, Field, Product } from "../../../Types/interface";
import CustomCard from "../../../components/user/CustomCard";

interface EventApi {
  eventid: number;
  nameevent: string;
  datestart: string;
  dateend: string;
  image: string;
  descriptions: string;
  eventtype: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [topProduct, setTopProduct] = useState<Product[]>([]);
  const [eventList, setEventList] = useState<EventApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8081/api/sportify").then(res => res.json()),
      fetch("http://localhost:8081/api/sportify/event").then(res => res.json())
    ])
      .then(([mainData, eventData]) => {
        // Transform fieldList array data to objects
        const transformedFields = mainData.fieldList.map((field: any[]) => ({
          id: field[0],
          code: field[1],
          name: field[2],
          description: field[3],
          price: field[4],
          image: field[5],
          address: field[6],
          isActive: field[7]
        }));

        // Transform topproduct array data to objects
        const transformedProducts = mainData.topproduct.map((product: any[]) => ({
          id: product[0],
          name: product[1],
          count: product[2],
          image: product[3],
          price: product[4],
          description: product[5]
        }));

        setFieldList(transformedFields);
        setTopProduct(transformedProducts);
        setEventList(eventData.content || []);
        setUser(null); // No user data in the API response
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setFieldList([]);
        setTopProduct([]);
        setEventList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
    

      {/* Hero */}
      <section
        className="position-relative d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: "url(/user/images/bgSum.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh"
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 }}></div>
        <div className="container text-center position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-1 fw-bold mb-4">
            Good Sport <br /> For Good Health
          </h1>
          <div className="mt-4">
            <a href="/sportify/field" className="btn btn-primary btn-lg me-3 px-4 py-2">
              Đặt Sân Ngay
            </a>
            <a href="/sportify/product" className="btn btn-outline-light btn-lg px-4 py-2">
              Đi Mua Sắm
            </a>
          </div>
        </div>
      </section>

      {/* Section: Sân nổi bật */}
      <section className="container my-5">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-primary mb-3">SÂN NỔI BẬT</h2>
          <p className="lead text-muted">Top 4 sân được đặt nhiều nhất</p>
        </div>
        <div className="row g-4">
          {fieldList.slice(0, 4).map(f => (
            <div key={f.id} className="col-lg-3 col-md-6">
              <CustomCard
                id={f.id}
                title={f.name}
                link={`sportify/field/detail/${f.id}`}
                image={`/user/images/${f.image}`}
                badgeText={`${f.price.toLocaleString()} VND`}
                badgeColor="bg-danger"
                description={f.address}
                buttonText="Xem chi tiết"
                buttonColor="btn-primary"
              />
            </div>
          ))}

        </div>
        <div className="text-center mt-5">
          <a href="sportify/field" className="btn btn-outline-primary btn-lg rounded-pill px-4">
            <i className="fas fa-plus me-2"></i>
            Xem thêm sân
          </a>
        </div>
      </section>

      {/* Section: Xu hướng mua sắm */}
      <section className="container my-5">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-success mb-3">XU HƯỚNG MUA SẮM</h2>
          <p className="lead text-muted">Top 4 sản phẩm bán chạy</p>
        </div>
        <div className="row g-4">
          {topProduct.slice(0, 4).map(p => (
            <div key={p.id} className="col-lg-3 col-md-6">
              <CustomCard
                id={p.id}
                title={p.name}
                link={`sportify/product-single/${p.id}`}
                image={`/user/images/${p.image}`}
                badgeText={`${p.price.toLocaleString()} VND`}
                badgeColor="bg-success"
                description={p.description}
                extraInfo={
                  <small className="text-warning fw-bold">
                    <i className="fas fa-shopping-cart me-1"></i>
                    Đã bán: {p.count}
                  </small>
                }
                buttonText="Xem chi tiết"
                buttonColor="btn-success"
              />
            </div>
          ))}

        </div>
        <div className="text-center mt-5">
          <a href="/sportify/product" className="btn btn-outline-success btn-lg rounded-pill px-4">
            <i className="fas fa-plus me-2"></i>
            Xem thêm sản phẩm khác
          </a>
        </div>
      </section>

      {/* Section: Hoạt động */}
      <section className="container my-5">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold text-info mb-3">HOẠT ĐỘNG</h2>
          <p className="lead text-muted">Trong tháng {new Date().getMonth() + 1}</p>
        </div>
        <div className="row g-4">
          {eventList.slice(0, 4).map(e => (
            <div key={e.eventid} className="col-lg-3 col-md-6">
              <CustomCard
                id={e.eventid}
                title={e.nameevent}
                link={`sportify/eventdetail/${e.eventid}`}
                image={`/user/images/${e.image}`}
                badgeText="Sự kiện"
                badgeColor="bg-info"
                description={e.descriptions}
                extraInfo={
                  <>
                    <i className="fas fa-calendar me-1"></i>
                    <span className="me-2">{e.datestart} - {e.dateend}</span>
                  </>
                }
                buttonText="Xem chi tiết"
                buttonColor="btn-info"
              />
            </div>
          ))}

        </div>
        <div className="text-center mt-5">
          <a href="sportify/event" className="btn btn-outline-info btn-lg rounded-pill px-4">
            <i className="fas fa-plus me-2"></i>
            Xem thêm tin tức
          </a>
        </div>
      </section>

    </>
  );
}
