import React, { useEffect, useState } from "react";

type BookingInfo = {
  bookingId: number;
  bookingDate: string;
  bookingPrice: number;
  note: string;
  bookingStatus: string;
  fieldName: string;
  fieldImage: string;
  bookingType: string;
  startDate: string | null;
  endDate: string | null;
  dayOfWeeks: string | null;
};

const statusColor = (status: string) => {
  if (status === "Hoàn Thành") return "#39AEA9";
  if (status === "Đã Cọc") return "#FFA41B";
  if (status === "Hủy Đặt") return "red";
  return "#6C757D";
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const bookingTypeLabel = (type: string) => {
  if (type === "PERMANENT") return "Đặt cố định";
  if (type === "ONCE") return "Đặt một lần";
  return type;
};

const LichSuDatSan: React.FC = () => {
  const [listbooking, setListBooking] = useState<BookingInfo[]>([]);

  useEffect(() => {
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
    fetch(`${URL_BACKEND}/api/user/field/profile/historybooking`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setListBooking(data.listbooking);
      })
      .catch(() => setListBooking([]));
  }, []);

  return (
    <>
      <style>
        {`
          #nz-div-3 h3.tde span {
            background: #EA3A3C;
            padding: 10px 20px 8px 20px;
            color: white;
            position: relative;
            display: inline-block;
            margin: 0;
            border-radius: 23px 23px 0px 0px;
          }

          #nz-div-3 h3.tde {
            margin: 15px 0;
            border-bottom: 2px solid #ea3a3c;
            font-size: 16px;
            line-height: 20px;
            text-transform: uppercase;
          }

          .nz-div-7 {
            position: relative;
            margin: 20px 0;
            text-align: center;
          }

          .nz-div-7 .box-title-name {
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            color: #333;
            display: inline-block;
            vertical-align: top;
            position: relative;
            z-index: 1;
            padding-bottom: 28px;
          }

          .nz-div-7 .box-title-name:before {
            content: "";
            position: absolute;
            border-top: 10px solid #00aa46;
            border-left: 15px solid transparent;
            border-bottom: 7px solid transparent;
            border-right: 15px solid transparent;
            left: calc(50% - 40px);
            bottom: -7px;
            width: 50px;
          }

          .nz-div-7 .box-title-name:after {
            content: "";
            position: absolute;
            z-index: 2;
            bottom: 0;
            height: 9px;
            width: 200px;
            left: calc(50% - 100px);
            border-top: 2px solid #00aa46;
          }
        `}
      </style>

      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: "url('/user/images/backgroundField.gif')" }}
        data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
      </section>

      <div className="nz-div-7">
        <div className="box-title-name">
          <span className="null">Lịch Sử</span> Đặt Sân Của Bạn
        </div>
      </div>

      <div className="container d-flex justify-content-center rounded mb-5">
        <div className="col-md-12 rounded row" id="profiles" style={{ marginTop: 50, backgroundColor: "rgb(247 249 250)" }}>
          <div id="nz-div-3">
            <h3 className="tde">
              <span>Hiển thị 20 phiếu đặt sân gần nhất</span>
            </h3>
          </div>

          {listbooking.map((booking, idx) => (
            <div key={idx} className="card col-12 mb-3" style={{ borderRadius: 10 }}>
              <h6 className="card-header d-flex justify-content-between align-items-center">
                <span>
                  <b>Mã phiếu:</b> #{booking.bookingId}
                  <span style={{ color: "#1F8A70", fontWeight: "bold", marginLeft: 10 }}>
                    Đặt lúc: {formatDate(booking.bookingDate)}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "medium",
                    color: "snow",
                    fontWeight: "bold",
                    padding: "3px 10px",
                    borderRadius: 10,
                    backgroundColor: statusColor(booking.bookingStatus),
                  }}
                >
                  {booking.bookingStatus}
                </span>
              </h6>
              <div className="card-body row">
                <div className="col-md-3 d-flex align-items-center justify-content-center">
                  <img style={{ width: "100%", borderRadius: 10 }} src={`/user/images/${booking.fieldImage}`} alt="Sân" />
                </div>
                <div className="col-md-9">
                  <h5 className="card-title text-success font-weight-bold">{booking.fieldName}</h5>
                  <p><b>Loại đặt sân:</b> {bookingTypeLabel(booking.bookingType)}</p>
                  <p>
                    <b>Ngày bắt đầu:</b> {formatDate(booking.startDate)}<br />
                    <b>Ngày kết thúc:</b> {formatDate(booking.endDate)}
                  </p>
                  {booking.dayOfWeeks && (
                    <p><b>Ngày trong tuần:</b> {booking.dayOfWeeks}</p>
                  )}
                  <p className="card-text limited-length5">{booking.note || "Không có ghi chú"}</p>
                  <hr />
                  <p>
                    <b>Tổng tiền:</b>{" "}
                    <span className="text-danger font-weight-bold">{formatCurrency(booking.bookingPrice)}</span>
                    <a
                      style={{ float: "right" }}
                      href={`/sportify/field/profile/historybooking/detail?bookingId=${booking.bookingId}&bookingPrice=${booking.bookingPrice}`}
                    >
                      <button type="button" className="btn btn-outline-info">
                        Xem Chi Tiết
                      </button>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LichSuDatSan;
