import { Outlet } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import AIChatbox from "../components/Others/AIChatbox";
import Header from "../components/user/Header";

export default function Layout() {


  return (

    <>
      <Helmet>
        <title>Sportify</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Spectral:wght@200;300;400;500;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link rel="stylesheet" href="/user/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/user/css/animate.css" />
        <link rel="stylesheet" href="/user/css/owl.theme.default.min.css" />
        <link rel="stylesheet" href="/user/css/magnific-popup.css" />
        <link rel="stylesheet" href="/user/css/flaticon.css" />
        <link rel="stylesheet" href="/user/css/style.css" />

        <script src="/user/js/jquery.min.js"></script>
        {/* <script src="/user/js/angular.min.js"></script> */}
        <script src="/user/js/jquery-migrate-3.0.1.min.js"></script>
        <script src="/user/js/popper.min.js"></script>
        <script src="/user/js/bootstrap.min.js"></script>
        <script src="/user/js/jquery.easing.1.3.js"></script>
        <script src="/user/js/jquery.waypoints.min.js"></script>
        <script src="/user/js/jquery.stellar.min.js"></script>
        <script src="/user/js/owl.carousel.min.js"></script>
        <script src="/user/js/jquery.magnific-popup.min.js"></script>
        <script src="/user/js/jquery.animateNumber.min.js"></script>
        <script src="/user/js/scrollax.min.js"></script>
        <script src="/user/js/main.js"></script>
      </Helmet>

      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <Header />
        <Navbar />

        {/* Content thay đổi */}
        <main className="flex-fill">
          <Outlet />
        </main>

        {/* Chatbox AI */}
        <AIChatbox /> {/* Thêm dòng này */}

        {/* Footer */}
        <Footer />
      </div>
    </>

  );

}
