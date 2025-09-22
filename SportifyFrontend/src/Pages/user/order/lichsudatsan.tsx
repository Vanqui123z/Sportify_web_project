import React, { useEffect, useState } from "react";
import axios from "axios";

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
                  padding: "3px 10px",
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
                <br />
                <a className="btn btn-outline-info"
                  href={`/sportify/field/profile/historybooking/detail?bookingId=${bookingInfo[0]}&bookingPrice=${bookingInfo[2]}`}
                   
                >
                  Xem Chi Tiết
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LichSuDatSan;
