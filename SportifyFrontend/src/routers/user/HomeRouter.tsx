import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../Pages/user/home/HomePage";
import FieldPage from "../../Pages/user/home/FieldPage";
import DetailFields from "../../Pages/user/home/FieldDetails";
import Product from "../../Pages/user/home/Product";
import ProductDetail from "../../Pages/user/home/ProductDetail";
import Event from "../../Pages/user/home/Event";
import EventDetail from "../../Pages/user/home/EventDetail";
import Policy from "../../Pages/user/home/Policy";
import Contact from "../../Pages/user/home/Contact";
import Regulations from "../../Pages/user/home/Regulations";
import Profile from "../../Pages/user/home/Profile";
import TeamPage from "../../Pages/user/home/TeamPage";
import TeamDetail from "../../Pages/user/home/TeamDetail";
import OrderList from "../../Pages/user/order/OrderList";
import LichSuDatSan from "../../Pages/user/order/lichsudatsan";
import CheckoutDatSan from "../../Pages/user/checkout/CheckoutDatSan";
import LichSuDatSanDetail from "../../Pages/user/order/LichSuDatSanDetail";
import OrderDetailPage from "../../Pages/user/order/OrderDetail";
import Cart from "../../Pages/user/order/Cart";
import CheckoutCart from "../../Pages/user/checkout/CheckoutCart";
import FootballPredictionPage from "../../Pages/user/home/FootballPredictionPage";
import FootballTestPage from "../../Pages/user/home/FootballTestPage";
import PaymentResult from "../../Pages/user/checkout/PaymentResult";


const UserRoutes: React.FC = () => (
  <Routes>
    {/* Profile & Auth */}
    <Route path="" element={<HomePage />} />

    {/* <Route path="about" element={<HomeAbout />} /> */}
    <Route path="profile" element={<Profile />} />


    {/* Chính sách & Quy định */}
    <Route path="policy" element={<Policy />} />
    <Route path="regulations" element={<Regulations />} />
    <Route path="contact" element={<Contact />} />

    {/* Event */}
    <Route path="event" element={<Event />} />
    <Route path="eventdetail/:eventid" element={<EventDetail />} />
    <Route path="event/thethao" element={<Event />} />
    <Route path="event/khuyenmai" element={<Event />} />
    <Route path="event/baotri" element={<Event />} />

    {/* Field */}
    <Route path="field" element={<FieldPage />} />
    <Route path="field/:cid" element={<FieldPage />} />
    <Route path="field/detail/:idField" element={<DetailFields />} />
    <Route path="field/booking/:idField" element={<CheckoutDatSan />} />
    <Route path="field/profile/historybooking" element={<LichSuDatSan />} />
    <Route path="field/profile/historybooking/detail" element={<LichSuDatSanDetail />} />

    {/* Order */}
    {/* <Route path="order/cart" element={<OrderCart />} />*/}
    <Route path="order/checkout" element={<OrderDetailPage />} /> 
    <Route path="order/historyList" element={<OrderList />} />
     <Route path="order/historyList/detail/:id" element={<OrderDetailPage />} />
   
   
    {/*Product */}
     <Route path="product" element={<Product />} />
    <Route path="product-single/:productid" element={<ProductDetail />} />


{/* Cart */}
    <Route path="cart/view" element={<Cart />} />
    <Route path="cart/checkout" element={<CheckoutCart />} />
    

    {/* Team */}
    <Route path="team" element={<TeamPage />} />
    <Route path="team/:sporttypeid" element={<TeamPage />} />
    <Route path="team/detailteam/:teamId" element={<TeamDetail />} />
    <Route path="team/detailteam/:teamId/exit" element={<TeamDetail />} />

{/* prediction */}
    <Route path="football-prediction" element={<FootballPredictionPage />} />
    {/* <Route path="football-test" element={<FootballTestPage />} /> */}
    {/* <Route path="prediction" element={<FootballTestPage />} /> */}

    
  </Routes>
);

export default UserRoutes;
