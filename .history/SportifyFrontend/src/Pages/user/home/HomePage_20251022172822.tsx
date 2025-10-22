import { useEffect, useState, useContext } from "react";
import Loader from "../../../components/user/Loader";
import type { Field, Product } from "../../../Types/interface";
import getImageUrl from "../../../helper/getImageUrl";
import { useFtcoAnimation } from "../../../helper/useFtcoAnimation";
import { fetchHomeData } from '../../../service/user/home/homeApi';
import { AuthContext } from "../../../helper/AuthContext";



// Add body background style
const bodyStyle = {
  backgroundImage: "url('/user/images/bgAll.png')",
  backgroundRepeat: "repeat",
  backgroundSize: "100% 100%"
};

// Apply body style when component mounts
if (typeof document !== 'undefined') {
  Object.assign(document.body.style, bodyStyle);
}

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
  const [fieldList, setFieldList] = useState<Field[]>([]);
  const [topProduct, setTopProduct] = useState<Product[]>([]);
  const [eventList, setEventList] = useState<EventApi[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch data using service
    const fetchData = async () => {
      try {
        // Truyền username nếu user đã đăng nhập
        const username = user?.username;
        console.log("🔍 Fetching home data with username:", username);
        const { mainData, eventData } = await fetchHomeData(username);
        
        if (mainData && mainData.fieldList && Array.isArray(mainData.fieldList)) {
          console.log("📊 Received fieldList from backend:", mainData.fieldList);
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
          console.log("✅ Transformed fields:", transformedFields);
          setFieldList(transformedFields);
        } else {
          setFieldList([]);
        }
        if (mainData && mainData.topproduct && Array.isArray(mainData.topproduct)) {
          const transformedProducts = mainData.topproduct.map((product: any[]) => ({
            id: product[0],
            name: product[1],
            count: product[2],
            image: product[3],
            price: product[4],
            description: product[5]
          }));
          setTopProduct(transformedProducts);
        } else {
          setTopProduct([]);
        }
        if (eventData && eventData.content && Array.isArray(eventData.content)) {
          setEventList(eventData.content);
        } else {
          setEventList([]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setFieldList([]);
        setTopProduct([]);
        setEventList([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Additional useEffect to ensure carousel initialization
  useEffect(() => {
    if (!loading) {
      const initCarouselAgain = () => {
        const $ = (window as any).$;
        if ($ && $.fn.owlCarousel) {
          // Destroy existing carousel if any
          $('.carousel-testimony').trigger('destroy.owl.carousel');
          $('.carousel-testimony').removeClass('owl-carousel owl-loaded');
          $('.carousel-testimony').find('.owl-stage-outer').children().unwrap();
          
          // Re-initialize
          setTimeout(() => {
            $('.carousel-testimony').addClass('owl-carousel').owlCarousel({
              center: true,
              loop: true,
              items: 1,
              margin: 30,
              stagePadding: 0,
              nav: false,
              dots: true,
              autoplay: true,
              autoplayTimeout: 5000,
              responsive: {
                0: { items: 1 },
                600: { items: 1 },
                1000: { items: 1 }
              }
            });
          }, 500);
        }
      };
      
      setTimeout(initCarouselAgain, 2000);
    }
  }, [loading]);

  // Add this useEffect after your existing useEffects
  useFtcoAnimation(loading);

  if (loading) return <Loader />;

  return (
    <>
    

 

      {/* Hero Section */}
      <div
        className="hero-wrap"
        style={{ backgroundImage: "url('/user/images/bgSum.jpg')" }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-center">
            <div className="col-md-8 ftco-animate d-flex align-items-end">
              <div className="text w-100 text-center">
                <h1 className="mb-2" style={{ fontSize: "100px" }}>
                  <span>Good Sport <br /> For Good Health</span>
                </h1>
                <p>
                  <a href="/sportify/field" className="btn btn-primary py-2 px-4">
                    Đặt Sân Ngay
                  </a>{" "}
                  <a href="/sportify/product" className="btn btn-white btn-outline-white py-2 px-4">
                    Đi Mua Sắm
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="ftco-intro">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-4 d-flex">
              <div className="intro d-lg-flex w-100 ftco-animate">
                <div className="icon">
                  <span className="flaticon-support"></span>
                </div>
                <div className="text">
                  <h2>Hỗ trợ 24/7</h2>
                  <br />
                  <p>Bạn có thể yên tâm, chúng tôi luôn đồng hành cùng bạn, ngay cả vào cuối tuần và ngày lễ.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className="intro color-1 d-lg-flex w-100 ftco-animate">
                <div className="icon">
                  <span className="flaticon-cashback"></span>
                </div>
                <div className="text">
                  <h2>Thanh toán với nhiều hình thức</h2>
                  <p>Chúng tôi đáp ứng nhu cầu thanh toán của bạn với sự linh hoạt và tiện lợi. Bạn có thể chọn từ nhiều phương thức thanh toán phù hợp với bạn.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className="intro color-2 d-lg-flex w-100 ftco-animate">
                <div className="icon">
                  <span className="flaticon-free-delivery"></span>
                </div>
                <div className="text">
                  <h2>Miễn phí giao hàng &amp; Hoàn trả</h2>
                  <p>Chúng tôi cam kết cung cấp dịch vụ giao hàng nhanh chóng và hoàn trả dễ dàng để mang lại trải nghiệm tốt nhất cho bạn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="ftco-section ftco-no-pb">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/vot.png)" }}></div>
                <h5>Vợt Tennis</h5>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/bong.png)" }}></div>
                <h5>Bóng Đá</h5>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/caulong.png)" }}></div>
                <h5>Vợt Cầu Lông</h5>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/dothethao.jpg)" }}></div>
                <h5>Đồ Thể Thao</h5>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/giay.png)" }}></div>
                <h5>Giày Thể Thao</h5>
              </div>
            </div>
            <div className="col-lg-2 col-md-4">
              <div className="sort w-100 text-center ftco-animate">
                <div className="img" style={{ backgroundImage: "url(/user/images/bongro.png)" }}></div>
                <h5>Bóng Rổ</h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fields Section */}
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-md-7 heading-section text-center ftco-animate">
              <h2>SÂN NỔI BẬT</h2>
              <span className="subheading">
                {user 
                  ? "Dành riêng cho bạn - Sân yêu thích và hay đặt nhất" 
                  : "Top 4 sân được đặt nhiều nhất"}
              </span>
            </div>
          </div>
          <div className="row d-flex">
            {fieldList.slice(0, 4).map(f => (
              <div key={f.id} className="col-lg-6 d-flex align-items-stretch ftco-animate">
                <div className="blog-entry d-flex">
                  <img className="block-20 img" alt="" src={getImageUrl(f.image)} />
                  <div className="text p-4 bg-light">
                    <h3 className="heading mb-3">
                      <a href={`/sportify/field/detail/${f.id}`}>{f.name}</a>
                    </h3>
                    <p>
                      <span className="text-success font-weight-bold">Giá tiền</span>:{" "}
                      <span className="text-danger font-weight-bold">
                        {f.price.toLocaleString()} VND
                      </span>
                    </p>
                    <p>
                      <span className="text-success font-weight-bold">Địa chỉ</span>:{" "}
                      <span className="text-dark font-weight">{f.address}</span>
                    </p>
                    <a href={`/sportify/field/detail/${f.id}`} className="btn-custom">
                      Chi tiết <span className="fa fa-long-arrow-right"></span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <a href="/sportify/field" className="btn btn-primary d-block">
                Xem thêm sân
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Trends Section */}
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-md-7 heading-section text-center ftco-animate">
              <h2>XU HƯỚNG MUA SẮM</h2>
              <span className="subheading">Top 4 sản phẩm bán chạy</span>
            </div>
          </div>
          <div className="row d-flex">
            {topProduct.slice(0, 4).map(p => (
              <div key={p.id} className="col-lg-6 d-flex align-items-stretch ftco-animate">
                <div className="blog-entry d-flex">
                  <img className="block-20 img" alt="" src={getImageUrl(p.image)} />
                  <div className="text p-4 bg-light">
                    <h3 className="heading mb-3">
                      <a href={`/sportify/product-single/${p.id}`}>{p.name}</a>
                    </h3>
                    <p>
                      <span className="text-success font-weight-bold">Giá tiền</span>:{" "}
                      <span className="text-danger font-weight-bold">
                        {p.price.toLocaleString()} VND
                      </span>
                    </p>
                    <p>
                      <span className="text-success font-weight-bold">Mô tả</span>:{" "}
                      <span className="text-dark font-weight limited-length">{p.description}</span>
                    </p>
                    <a href={`/sportify/product-single/${p.id}`} className="btn-custom">
                      Chi tiết <span className="fa fa-long-arrow-right"></span>
                    </a>
                    <p style={{ color: "#252B48", fontWeight: "bold", width: "50%", paddingLeft: "4px", marginTop: "30px", borderRadius: "10px" }}>
                      <span>Lượt mua:</span>
                      <span>{p.count}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <a href="/sportify/product" className="btn btn-primary d-block">
                Xem thêm sản phẩm khác
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="ftco-section testimony-section img" style={{ backgroundImage: "url(/user/images/bgcaunoi.jpg)" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
              <span className="subheading">Câu nói</span>
              <h2 className="mb-3">Truyền cảm hứng</h2>
            </div>
          </div>
          <div className="row ftco-animate">
            <div className="col-md-12">
              <div className="carousel-testimony owl-carousel">
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="fa fa-quote-left"></span>
                    </div>
                    <div className="text text-center">
                       <p className="mb-4 fst-italic" style={{ fontSize: '1.3rem', lineHeight: '1.7', color: '#ffffff' }}>"Thành công không phải là bất ngờ. Đó là công việc khó khăn, kiên trì, học hỏi, học tập, hy sinh và hơn hết, tình yêu của những gì bạn đang làm hoặc học tập để làm".</p>
                       <br /> <br />
                       <div className="d-flex align-items-center justify-content-center">
                         <div className="user-img" style={{ backgroundImage: "url(/user/images/pele.png)" }}></div>
                         <div className="pl-3 text-center">
                           <p className="name fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Pelé</p>
                           <span className="position" style={{ fontSize: '1rem', color: '#e0e0e0' }}>Ngôi sao vĩ đại trên sân cỏ</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="fa fa-quote-left"></span>
                    </div>
                    <div className="text text-center">
                       <p className="mb-4 fst-italic" style={{ fontSize: '1.3rem', lineHeight: '1.7', color: '#ffffff' }}>"Mỗi năm tôi đều cố gắng phấn đấu với tư cách là một cầu thủ. Và tôi không muốn sự nghiệp của mình đi theo một lối mòn. Tôi luôn cố gắng trong mỗi trận đấu theo mọi cách có thể."</p>
                       <br /> <br />
                       <div className="d-flex align-items-center justify-content-center">
                         <div className="user-img" style={{ backgroundImage: "url(/user/images/messi.png)" }}></div>
                         <div className="pl-3 text-center">
                           <p className="name fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Lionel Messi</p>
                           <span className="position" style={{ fontSize: '1rem', color: '#e0e0e0' }}>Cầu thủ xuất sắc nhất thế giới.</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="fa fa-quote-left"></span>
                    </div>
                    <div className="text text-center">
                       <p className="mb-4 fst-italic" style={{ fontSize: '1.3rem', lineHeight: '1.7', color: '#ffffff' }}>"Đã chọn thể thao thì bắt buộc phải nỗ lực và hy sinh, bởi tôi muốn vươn lên đỉnh cao trong sự nghiệp, bởi kỷ lục không bao giờ có giới hạn, nên với tôi ngày hôm nay phải tốt hơn ngày hôm qua."</p>
                       <br />
                       <div className="d-flex align-items-center justify-content-center">
                         <div className="user-img" style={{ backgroundImage: "url(/user/images/anhvien.jpg)" }}></div>
                         <div className="pl-3 text-center">
                           <p className="name fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Nguyễn Thị Ánh Viên</p>
                           <span className="position" style={{ fontSize: '1rem', color: '#e0e0e0' }}>Vận động viên bơi lội</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="fa fa-quote-left"></span>
                    </div>
                    <div className="text text-center">
                       <p className="mb-4 fst-italic" style={{ fontSize: '1.3rem', lineHeight: '1.7', color: '#ffffff' }}>"Tôi đã trượt hơn 9000 cú ném trong sự nghiệp của mình. Tôi đã thua gần 300 trận đấu. 26 lần tôi được tin tưởng giao cho cú ném quyết định trận đấu và bỏ lỡ chúng. Tôi đã thất bại hết lần này đến lần khác trong đời mình. Và đó là lý do tôi thành công."</p>
                       <div className="d-flex align-items-center justify-content-center">
                         <div className="user-img" style={{ backgroundImage: "url(/user/images/ro.jpg)" }}></div>
                         <div className="pl-3 text-center">
                           <p className="name fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>Michael Jordan</p>
                           <span className="position" style={{ fontSize: '1rem', color: '#e0e0e0' }}>Cựu cầu thủ bóng rổ thế giới</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="icon d-flex align-items-center justify-content-center">
                      <span className="fa fa-quote-left"></span>
                    </div>
                     <div className="text text-center">
                       <p className="mb-4 fst-italic" style={{ fontSize: '1.3rem', lineHeight: '1.7', color: '#ffffff' }}>"Đừng ngại thất bại, đó là con đường dẫn đến thành công."</p>
                       <br /> <br />
                       <div className="d-flex align-items-center justify-content-center">
                         <div className="user-img" style={{ backgroundImage: "url(/user/images/LeBron_James.jpg)" }}></div>
                         <div className="pl-3 text-center">
                           <p className="name fw-bold" style={{ fontSize: '1.2rem', color: '#ffffff' }}>LeBron James</p>
                           <span className="position" style={{ fontSize: '1rem', color: '#e0e0e0' }}>Vận động viên bóng rổ Hoa Kỳ</span>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 heading-section text-center ftco-animate">
              <h2>HOẠT ĐỘNG</h2>
              <span className="subheading">Trong tháng {new Date().getMonth() + 1}</span>
            </div>
          </div>
          <div className="row d-flex">
            {eventList.slice(0, 4).map(e => (
              <div key={e.eventid} className="col-lg-6 d-flex align-items-stretch ftco-animate">
                <div className="blog-entry d-flex">
                  <img className="block-19 block-20 img" alt="" src={getImageUrl(e.image)} />
                  <div className="text p-4 bg-light">
                    <div className="meta d-flex">
                      <p className="fa fa-calendar m-2"></p>
                      <span className="m-1">{e.datestart}</span>
                      <p>|</p>
                      <p className="m-1">{e.dateend}</p>
                    </div>
                    <h3 className="heading mb-3">{e.nameevent}</h3>
                    <p className="limited-length">{e.descriptions}</p>
                    <a href={`/sportify/eventdetail/${e.eventid}`} className="btn-custom">
                      Chi tiết <span className="fa fa-long-arrow-right"></span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <a href="/sportify/event" className="btn btn-primary d-block">
                Xem thêm tin tức
              </a>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
