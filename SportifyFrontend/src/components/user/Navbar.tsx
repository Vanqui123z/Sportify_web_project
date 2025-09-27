

export default function Navbar() {
 

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/sportify">
            <img src="/user/images/Logo3.png" style={{ width: "200px" }} alt="" />
          </a>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link" href="/sportify">Trang chủ</a></li>
              <li className="nav-item">
                <a href="/sportify/field" className="nav-link">Sân</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/team" className="nav-link">Đội</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="footballDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Trực tiếp bóng đá
                </a>
                <div className="dropdown-menu" aria-labelledby="footballDropdown">
                  <a className="dropdown-item" href="https://xoilaczzcz.tv/" target="_blank" rel="noopener noreferrer">Xem trực tiếp</a>
                  <a className="dropdown-item" href="/sportify/football-prediction">Dự đoán tỉ số</a>
                </div>
              </li>
              <li className="nav-item">
                <a href="/sportify/product" className="nav-link">Cửa hàng</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/event" className="nav-link">Tin Tức</a>
              </li>
              <li className="nav-item">
                <a href="/sportify/contact" className="nav-link">Liên hệ</a>
              </li>
            </ul>

         
          </div>
        </div>
      </nav>

     
    </>
  );
}
         
