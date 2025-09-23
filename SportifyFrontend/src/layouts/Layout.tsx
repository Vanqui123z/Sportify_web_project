import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import AIChatbox from "../components/Others/AIChatbox";
import Header from "../components/user/Header";

export default function Layout() {


  return (
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
  );
}
