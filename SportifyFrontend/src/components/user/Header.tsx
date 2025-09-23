export default function Header() {
  return (
      <div className="wrap" style={{ zIndex: 9, position: "relative" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <div className="social-media mr-4 m-1">
                <p className="mb-0 d-flex">
                  <a href="#" className="d-flex align-items-center justify-content-center">
                    <span className="fa fa-facebook"><i className="sr-only">Facebook</i></span>
                  </a>
                  <a href="#" className="d-flex align-items-center justify-content-center">
                    <span className="fa fa-twitter"><i className="sr-only">Twitter</i></span>
                  </a>
                  <a href="#" className="d-flex align-items-center justify-content-center">
                    <span className="fa fa-instagram"><i className="sr-only">Instagram</i></span>
                  </a>
                  <a href="#" className="d-flex align-items-center justify-content-center">
                    <span className="fa fa-dribbble"><i className="sr-only">Dribbble</i></span>
                  </a>
                </p>
              </div>
              <p className="mb-0 phone pl-md-2">
                <a href="#" className="mr-2">
                  <span className="fa fa-phone mr-1"></span>
                  +00 1234 567
                </a>
                <a href="#">
                  <span className="fa fa-paper-plane mr-1"></span>
                  youremail@email.com
                </a>
              </p>
            </div>
            <div className="col-md-6 d-flex justify-content-md-end">
              {/* Note: Login functionality would be handled by parent component/layout */}
              <div className="reg m-1">
                <p className="mb-0">
                  <a href="/sportify/login" className="mr-2" style={{ color: "white" }}>
                    Đăng nhập |
                  </a>
                  <a href="/sportify/signup" style={{ color: "white" }}>
                    Đăng kí
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
