import React, { useEffect, useState } from "react";

interface BookingInfo {
  [index: number]: any;
}

interface ApiResponse {
  conlai: number;
  thanhtien: number;
  phuthu: number;
  giamgia: number;
  tamtinh: number;
  tiencoc: number;
  listbooking: BookingInfo[];
}

const LichSuDatSanDetail: React.FC = () => {
   const searchParams = new URLSearchParams(location.search);
   const bookingId = searchParams.get("bookingId");
   const bookingPrice = searchParams.get("bookingPrice");
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
   fetch(
        `http://localhost:8081/api/user/field/profile/historybooking/detail?bookingId=${bookingId}&bookingPrice=${bookingPrice}`,{
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  console.log(data);
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {/* ...navbar and header code (convert as needed)... */}
      <div className="nz-div-7">
        <div className="box-title-name">
          <span className="null">Chi Tiết</span> Lịch Sử Đặt Sân
        </div>
      </div>
      <div className="container d-flex justify-content-center rounded mb-5">
        <div className="col-md-12 rounded row" id="profiles" style={{ marginTop: 50, backgroundColor: "rgb(247, 249, 250)" }}>
          {data.listbooking.map((bookingInfo, idx) => {
            const statusColor =
              bookingInfo[2] === "Hoàn Thành"
                ? "#39AEA9"
                : bookingInfo[2] === "Đã Cọc"
                ? "#FFA41B"
                : bookingInfo[2] === "Hủy Đặt"
                ? "red"
                : "white";
            return (
              <div key={idx} className="card col-12 mb-3" style={{ borderRadius: 10, marginTop: 20 }}>
                <h6 className="card-header">
                  Mã phiếu <span style={{ color: "black", fontWeight: "bold" }}>#{bookingInfo[0]}</span>{" "}
                  <span>Đặt lúc</span>{" "}
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    {new Date(bookingInfo[1]).toLocaleString("vi-VN")}
                  </span>
                  <span
                    style={{
                      fontSize: "medium",
                      color: "snow",
                      fontWeight: "bold",
                      marginLeft: "3%",
                      marginRight: "3%",
                      padding: "3px 10px 3px 10px",
                      borderRadius: "10px",
                      backgroundColor: statusColor,
                    }}
                  >
                    {bookingInfo[2]}
                  </span>
                  <span>Thành Tiền:</span>{" "}
                  <span className="font-weight-bold" style={{ color: "#279EFF", padding: 5, borderRadius: 8 }}>
                    {data.thanhtien.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                  <span>
                    <a style={{ paddingLeft: "2%" }} href="/sportify/field/profile/historybooking">
                      <button type="button" className="btn btn-outline-dark font-weight-bold">
                        VỀ TRANG DANH SÁCH ĐẶT SÂN
                      </button>
                    </a>
                  </span>
                </h6>
                <div className="card-body">
                  <h5 className="card-title text-success font-weight-bold">{bookingInfo[6]}</h5>
                  <img style={{ width: "20%", height: "50%" }} src={`/user/images/${bookingInfo[7]}`} alt="Image" />
                  <div>
                    <span style={{ color: "black" }}>Ngày nhận sân:</span>{" "}
                    <span style={{ color: "#1F8A70", fontWeight: "bold" }}>
                      {new Date(bookingInfo[4]).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "black" }}>Giờ chơi:</span>{" "}
                    <span style={{ color: "#1F8A70", fontWeight: "bold" }}>{bookingInfo[8]}</span>
                  </div>
                  <div>
                    <span style={{ color: "black" }}>Giá sân gốc / 1h:</span>{" "}
                    <span style={{ color: "#1F8A70", fontWeight: "bold" }}>
                      {bookingInfo[5].toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </span>
                  </div>
                  <hr />
                  <div>
                    <p>
                      <span>Phụ Thu: </span>
                      <span className="font-weight-bold">
                        {data.phuthu.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                      <span>Tạm Tính:</span>
                      <span className="font-weight-bold">
                        {data.tamtinh.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                      <span>Giảm giá:</span>
                      <span className="font-weight-bold">
                        {data.giamgia.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                      {" || "}
                      <span>Tiền đã cọc:</span>
                      <span className="text-success font-weight-bold">
                        {data.tiencoc.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                      {" || "}
                      <span>Khi nhận sân thanh toán:</span>
                      <span className="text-danger font-weight-bold">
                        {data.conlai.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LichSuDatSanDetail;
