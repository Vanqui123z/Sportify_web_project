import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="mb-4">
              <h5 className="text-primary fw-bold mb-3">
                <a href="#" className="text-decoration-none text-primary">
                  Sportify - Giải Pháp Sân Thể Thao
                </a>
              </h5>
              <p className="text-muted">
                Nền tảng đa năng cho đặt sân, tạo đội và mua sắm sản phẩm thể thao
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-light">
                  <i className="fab fa-twitter fs-5"></i>
                </a>
                <a href="https://www.facebook.com/profile.php?id=100094025267338" className="text-light">
                  <i className="fab fa-facebook fs-5"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="fab fa-instagram fs-5"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="mb-4">
              <h5 className="text-white fw-bold mb-3">Chính sách và điều kiện</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/sportify/chinhsach" className="text-decoration-none text-muted d-flex align-items-center">
                    <i className="fas fa-chevron-right me-2 text-primary"></i>
                    Chính sách
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/sportify/quydinh" className="text-decoration-none text-muted d-flex align-items-center">
                    <i className="fas fa-chevron-right me-2 text-primary"></i>
                    Quy Định &amp; Điều Kiện
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="mb-4">
              <h5 className="text-white fw-bold mb-3">Liên Hệ Nhanh</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/sportify/contact" className="text-decoration-none text-muted d-flex align-items-center">
                    <i className="fas fa-chevron-right me-2 text-primary"></i>
                    Liên Hệ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="mb-4">
              <h5 className="text-white fw-bold mb-3">Thông tin liên hệ</h5>
              <div>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex">
                    <i className="fas fa-map-marker-alt text-primary me-3 mt-1"></i>
                    <span className="text-muted">
                      Công viên phần mềm Quang QTSC Building 1, Trung, P Q.12,
                      Thành phố Hồ Chí Minh, Việt Nam
                    </span>
                  </li>
                  <li className="mb-3 d-flex">
                    <i className="fas fa-phone text-primary me-3 mt-1"></i>
                    <a href="tel:0123456789" className="text-decoration-none text-muted">
                      0123456789
                    </a>
                  </li>
                  <li className="mb-3 d-flex">
                    <i className="fas fa-envelope text-primary me-3 mt-1"></i>
                    <a href="mailto:sportify@gmail.com" className="text-decoration-none text-muted">
                      sportify@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top border-secondary py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 text-muted">
                Bản quyền &copy; {new Date().getFullYear()} Bảo lưu mọi quyền | Mẫu
                này được thực hiện{" "}
                <i className="fas fa-heart text-danger"></i>{" "}
                bởi{" "}
                <a href="/sportify/about" target="_blank" className="text-decoration-none text-primary">
                  Team Developer Sportify
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
