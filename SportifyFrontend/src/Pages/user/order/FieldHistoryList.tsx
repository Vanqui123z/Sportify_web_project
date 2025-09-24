import React, { useEffect, useState } from "react";

type BookingInfo = [
  string, // bookingId
  string, // bookingTime
  number, // bookingPrice
  string, // description
  string, // status
  string, // fieldName
  string  // image
];

const statusColor = (status: string) => {
  if (status === "Hoàn Thành") return "#39AEA9";
  if (status === "Đã Cọc") return "#FFA41B";
  if (status === "Hủy Đặt") return "red";
  return "white";
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const LichSuDatSan: React.FC = () => {
  const [listbooking, setListBooking] = useState<BookingInfo[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/user/field/profile/historybooking",{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setListBooking(data.listbooking))
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
        style={{backgroundImage: "url('/user/images/backgroundField.gif')"}}
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
          
          {listbooking.map((bookingInfo, idx) => (
            <div key={idx} className="card col-12 mb-3" style={{ borderRadius: 10 }}>
              <h6 className="card-header">
                Mã phiếu #<span>{bookingInfo[0]}</span>
                <span style={{ color: "#1F8A70", fontWeight: "bold", marginLeft: 10 }}>Đặt lúc</span>
                <span style={{ color: "#1F8A70", fontWeight: "bold", marginLeft: 5 }}>
                  {formatDate(bookingInfo[1])}
                </span>
                <span
                  style={{
                    fontSize: "medium",
                    color: "snow",
                    fontWeight: "bold",
                    marginLeft: "44%",
                    padding: "3px 10px 3px 10px",
                    borderRadius: 10,
                    backgroundColor: statusColor(bookingInfo[4]),
                  }}
                >
                  {bookingInfo[4]}
                </span>
              </h6>
              <div className="card-body">
                <h5 className="card-title text-success font-weight-bold">{bookingInfo[5]}</h5>
                <img style={{ width: "20%", height: "50%" }} src={`/user/images/${bookingInfo[6]}`} alt="Image" />
                <p className="card-text limited-length5">{bookingInfo[3]}</p>
                <hr />
                <p>
                  Tổng tiền:{" "}
                  <span className="text-danger font-weight-bold">{formatCurrency(bookingInfo[2])}</span>
                  <a 
                    style={{ paddingLeft: "70%" }} 
                    href={`/sportify/field/profile/historybooking/detail?bookingId=${bookingInfo[0]}&bookingPrice=${bookingInfo[2]}`}
                  >
                    <button type="button" className="btn btn-outline-info">
                      Xem Chi Tiết
                    </button>
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LichSuDatSan;
