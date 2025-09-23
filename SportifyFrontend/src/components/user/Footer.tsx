import React from "react";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="ftco-footer">
        <div className="container">
          <div className="row mb-5">
            <div className="col-sm-12 col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2 logo">
                  <a href="#">Sportify - Giải Pháp Sân Thể Thao</a>
                </h2>
                <p>Nền tảng đa năng cho đặt sân, tạo đội và mua sắm sản phẩm thể thao</p>
                <ul className="ftco-footer-social list-unstyled mt-2">
                  <li className="ftco-animate">
                    <a href="#"><span className="fa fa-twitter"></span></a>
                  </li>
                  <li className="ftco-animate">
                    <a href="https://www.facebook.com/profile.php?id=100094025267338">
                      <span className="fa fa-facebook"></span>
                    </a>
                  </li>
                  <li className="ftco-animate">
                    <a href="#"><span className="fa fa-instagram"></span></a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-sm-12 col-md">
              <div className="ftco-footer-widget mb-4 ml-md-4">
                <h2 className="ftco-heading-2">Chính sách và điều kiện</h2>
                <ul className="list-unstyled">
                  <li>
                    <a href="/sportify/chinhsach">
                      <span className="fa fa-chevron-right mr-2"></span>Chính sách
                    </a>
                  </li>
                  <li>
                    <a href="/sportify/quydinh">
                      <span className="fa fa-chevron-right mr-2"></span>Quy Định & Điều Kiện
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-12 col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2">Liên Hệ Nhanh</h2>
                <ul className="list-unstyled">
                  <li>
                    <a href="/sportify/contact">
                      <span className="fa fa-chevron-right mr-2"></span>Liên Hệ
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-sm-12 col-md">
              <div className="ftco-footer-widget mb-4">
                <h2 className="ftco-heading-2">Thông tin liên hệ</h2>
                <div className="block-23 mb-3">
                  <ul>
                    <li>
                      <span className="icon fa fa-map marker"></span>
                      <span className="text">
                        Công viên phần mềm Quang QTSC Building 1, Trung, P Q.12, Thành phố Hồ Chí Minh, Việt Nam
                      </span>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon fa fa-phone"></span>
                        <span className="text">0123456789</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="icon fa fa-paper-plane pr-4"></span>
                        <span className="text">sportify@gmail.com</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid px-0 py-5 bg-black">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <p className="mb-0" style={{ color: "rgba(255, 255, 255, .5)" }}>
                  Bản quyền &copy; {new Date().getFullYear()} Bảo lưu mọi quyền | Mẫu này được thực hiện{" "}
                  <i className="fa fa-heart color-danger" aria-hidden="true"></i> bởi{" "}
                  <a href="/sportify/about" target="_blank">
                    Team Developer Sportify
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
