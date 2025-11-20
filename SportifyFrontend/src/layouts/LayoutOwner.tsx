import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import OwnerHeader from "../components/owner/Header";
import OwnerSidebar from "../components/owner/Sidebar";
import OwnerAIChatbox from "../components/owner/OwnerAIChatbox";
import { AuthContext } from "../helper/AuthContext";

const LayoutOwner: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "Field Owner") {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h4>Không có quyền truy cập</h4>
          <p className="text-muted">Bạn cần đăng nhập bằng tài khoản chủ sân để sử dụng mục này.</p>
          <a href="/login" className="btn btn-primary">Đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Field Owner Sportify</title>
        <base href="/" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/admin/assets/img/logotitle.png"
        />
        <link rel="stylesheet" href="/admin/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/admin/assets/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/admin/assets/css/line-awesome.min.css" />
        <link rel="stylesheet" href="/admin/assets/plugins/morris/morris.css" />
        <link rel="stylesheet" href="/admin/assets/css/style.css" />
        <link rel="stylesheet" href="/admin/assets/css/dataTables.bootstrap4.min.css" />
        <link rel="stylesheet" href="/admin/assets/css/select2.min.css" />
        <link rel="stylesheet" href="/admin/assets/css/bootstrap-datetimepicker.min.css" />
        <script src="/admin/assets/js/jquery-3.5.1.min.js"></script>
        <script src="/admin/assets/js/jquery.dataTables.min.js"></script>
        <script src="/admin/assets/js/dataTables.bootstrap4.min.js"></script>
        <script src="/admin/assets/js/popper.min.js"></script>
        <script src="/admin/assets/js/bootstrap.min.js"></script>
        <script src="/admin/assets/js/jquery.slimscroll.min.js"></script>
        <script src="/admin/assets/plugins/raphael/raphael.min.js"></script>
        <script src="/admin/assets/plugins/morris/morris.min.js"></script>
        <script src="/admin/assets/js/chart.js"></script>
        <script src="/admin/assets/js/moment.min.js"></script>
        <script src="/admin/assets/js/bootstrap-datetimepicker.min.js"></script>
        <script src="/admin/assets/js/select2.min.js"></script>
        <script src="/admin/assets/js/app.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-route/1.8.3/angular-route.min.js"></script>
      </Helmet>

      <div className="admin-layout">
        <OwnerHeader username={user.username} />
        <OwnerSidebar />
        <OwnerAIChatbox />
        <main className="main-content mt-5">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutOwner;
