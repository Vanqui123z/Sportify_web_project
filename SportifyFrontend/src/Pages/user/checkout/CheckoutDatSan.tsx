import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

interface SportType {
  sporttypeid: string;
  categoryname: string;
}

interface Field {
  fieldid: number;
  sporttypeid: string;
  namefield: string;
  descriptionfield: string;
  price: number;
  image: string;
  address: string;
  status: boolean;
  sporttype: SportType;
}

interface User {
  username: string;
  passwords: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  address: string;
  image?: string | null;
  gender: boolean;
  status: boolean;
}

const CheckoutDatSan: React.FC = () => {

  const fieldid = useParams().idField || '';
  const location = useLocation();

  // Lấy nameshift từ cả nameShift và nameshift để đảm bảo nhận đúng giá trị
  const searchParams = new URLSearchParams(location.search);
  const nameshift = searchParams.get('nameshift') || searchParams.get('nameShift') || '';
  const dateselect = searchParams.get('dateselect') || '';

  // Lấy shiftid từ query string (nếu có)
  const shiftid = searchParams.get('shiftid') || '';

  const [user, setUser] = useState<User | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState(0);
  const [thanhtien, setThanhtien] = useState(0);
  const [pricefield, setPricefield] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Kiểm tra giá trị truyền lên
    if (!fieldid || !shiftid || !dateselect) {
      console.error("Thiếu fieldid, shiftid hoặc dateselect khi gọi API booking");
      return;
    }
    fetch(`http://localhost:8081/api/user/field/booking/${fieldid}?shiftid=${encodeURIComponent(shiftid)}&dateselect=${encodeURIComponent(dateselect)}`, {
      method: 'GET',
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`API trả về lỗi ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const f = data.fieldListById[0];
        setUser(data.user);
        setField(f);
        setPricefield(f.price);
        setThanhtien(data.totalprice); // lấy từ API
        setAmount(Math.round(data.totalprice * 0.3)); // cọc 30% của tổng tiền
        // Nếu cần dùng shiftid hoặc dateselect, có thể lưu vào state ở đây
        // setShiftId(data.shiftid);
        // setDateSelect(data.dateselect);
      })
      .catch(err => {
        console.error("Lỗi khi gọi API booking:", err);
      });
  }, [fieldid, nameshift, dateselect]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const allowedCharactersRegex = /^[,.\p{L}0-9\s]*$/u;
    const maxLength = 5000;
    if (!allowedCharactersRegex.test(val)) {
      setError('Không nhập ký tự đặc biệt, ngoại trừ , và .');
    } else if (val.length > maxLength) {
      setError(`Tối đa ${maxLength} ký tự`);
    } else {
      setError('');
      setNote(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    const formData = new FormData();
    formData.append('amount', amount.toString());
    formData.append('thanhtien', thanhtien.toString());
    formData.append('note', note);
    formData.append('fieldid', field?.fieldid?.toString() || '');
    formData.append('pricefield', pricefield.toString());
    formData.append('phone', user?.phone || '');
    formData.append('shiftid', shiftid.toString());
    formData.append('playdate', dateselect);

    try {
      const res = await fetch('http://localhost:8081/api/user/getIp/create', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`API trả về lỗi ${res.status}`);
      }
      const data = await res.json();
      // Nếu API trả về url để redirect, chuyển hướng tại đây
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        // Xử lý khi không có url trả về
        alert('Đặt sân thành công!');
      }
    } catch (err: any) {
      alert('Có lỗi khi thanh toán, vui lòng thử lại!');
    }
  };

  if (!field) return <div>Loading...</div>;

  return (
    <div>
      <style>{`
        .info-content {
          display: none;
          background-color: #FAF0E4;
          color: #606C5D;
          font-weight: bold;
          padding: 5px;
          border: 1px solid #ccc;
          position: absolute;
          top: 20px;
          left: 0;
          z-index: 1;
          border-radius: 5px;
        }

        .info-icon {
          display: inline-block;
          width: 15px;
          height: 15px;
          background-color: #F2BE22;
          color: white;
          text-align: center;
          line-height: 15px;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
        }

        .info-container:hover .info-content {
          display: block;
        }
      `}</style>
      <section className="hero-wrap hero-wrap-2"
        style={{ backgroundImage: "url('/user/images/bgcheckoutField.png')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end justify-content-center">
            <div className="col-md-9  mb-5 text-center">
              <p className="breadcrumbs mb-0">
                <span className="mr-2"><a href="/sportify">Trang Chủ <i className="fa fa-chevron-right"></i></a></span>
                <span className="mr-2"><a href="/sportify/field">Sân <i className="fa fa-chevron-right"></i></a></span>
                <span className="mr-2"><a href={`/sportify/field/detail/${field?.fieldid}`}>Chi Tiết Sân <i className="fa fa-chevron-right"></i></a></span>
                <span>Thanh Toán</span>
              </p>
              <h2 className="mb-0 bread">Thanh Toán</h2>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="ftco-section">
          <div className="container">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-10 ">
                  <h1 style={{ fontWeight: "bold" }} className="mb-4 d-flex justify-content-center">
                    PHIẾU ĐẶT SÂN THỂ THAO
                  </h1>

                  <div className="row mt-5 pt-3 d-flex" style={{ backgroundColor: "white", borderRadius: "15px" }}>
                    <div className="col-md-7 d-flex">
                      <div className="cart-detail cart-total p-3 p-md-4">
                        <div className="form-group">
                          <div>
                            <label>Tên khách hàng:</label> 
                            <span style={{ color: "#1D5D9B", fontWeight: "bold" }}>{user?.firstname}</span>
                            <span style={{ color: "#1D5D9B", fontWeight: "bold", fontSize: "larger" }}>{user?.lastname}</span>
                          </div>
                          <div>
                            <label>Số điện thoại </label> 
                            <span className="info-container">
                              <span className="info-icon">i</span> 
                              <span className="info-content">
                                <p>Số điện thoại để đối chiếu khi đến nhận sân.</p>
                              </span>
                            </span>: 
                            <span style={{ color: "#1D5D9B", fontWeight: "bold" }}>{user?.phone}</span> 
                            <input type="hidden" name="phone" readOnly value={user?.phone || ""} className="form-control" />
                          </div>
                          <div>
                            <label htmlFor="Mail">Email</label> 
                            <span className="info-container">
                              <span className="info-icon">i</span> 
                              <span className="info-content">
                                <p>Email để nhận thông báo thông tin dặt sân, được lấy từ tài khoản của bạn.</p>
                              </span> 
                            </span>: 
                            <span style={{ color: "#1D5D9B", fontWeight: "bold" }}>{user?.email || ''}</span>
                            <input readOnly value={user?.email || ''} type="hidden" className="form-control" />
                          </div>
                          <div>
                            <label>Ghi chú thông tin ( nếu cần ) :</label>
                            <textarea name="note" value={note} onChange={handleNoteChange} className="form-control"></textarea>
                            {error && <span className="text-danger">{error}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 d-flex">
                      <div className="cart-detail cart-total p-3 p-md-4">
                        <div className="">
                          <div className="form-group">
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                              <img src="/user/images/Logo3.png" style={{ width: 40, marginRight: 10 }} alt="" />
                              <h5 style={{ color: "green", paddingTop: 20, fontWeight: "bold" }}>{field?.namefield}</h5>
                              <input type="hidden" name="fieldid" value={field?.fieldid || ""} />
                            </div>
                            <div>
                              <div style={{ paddingLeft: 10 }}>
                                <span>Ngày nhận sân:</span> &nbsp; 
                                <span style={{ color: "black" }}>{dateselect}</span> 
                                <input type="hidden" name="playdate" value={dateselect} />
                              </div>
                              <div style={{ paddingLeft: 10 }}>
                                <span>Giờ chơi:</span> &nbsp; 
                                <span id="nameshift-input" style={{ color: "black" }}>{nameshift}</span> 
                                <input type="hidden" name="shiftid" value={shiftid} />
                              </div>
                            </div>
                            <div className="d-flex">
                              <img 
                                style={{ width: "50%", height: "40%", marginRight: 20 }}
                                src={field?.image ? `/user/images/${field.image}` : "/user/images/noimage.png"}
                                alt="Image" 
                              />
                              <div className="" style={{ marginTop: 10 }}>
                                &nbsp; 
                                <span style={{ fontSize: "larger", fontWeight: "bold", color: "green" }}>
                                  {field?.sporttype?.categoryname}
                                </span>
                                <br />
                                <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/0/01cf1090e2f434a7d63f1cbca912ef44.svg" />
                                &nbsp; <span style={{ color: "green" }}>Wifi miễn phí</span> <br />
                                <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/2/252a55e9e8b214950105d0335e27a25e.svg" />
                                &nbsp; <span style={{ color: "green" }}>Có phục vụ nước uống</span>
                              </div>
                            </div>
                            <div>
                              <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/7/721a32c1f29c2034bf8f5659dc65b73e.svg" />
                              &nbsp; <span>Không áp dụng đổi lịch</span>
                            </div>
                            <div>
                              <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/a/ac4257c709f6621e4c315f641f60202f.svg" />
                              &nbsp; <span>Không hoàn tiền đã cọc</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-5 pt-3 d-flex">
                    <div className="col-md-6 d-flex">
                      <div className="cart-detail cart-total p-3 p-md-4" style={{ backgroundColor: "#F1F6F9", borderRadius: "12px" }}>
                        <h3 className="billing-heading mb-4">Tóm tắt giá</h3>
                        <div className="">
                          <div className="form-group">
                            <div className="d-flex">
                              <label>Giá Tiền</label> 
                              <span style={{ color: "black", fontWeight: "bold", marginLeft: "30px" }}>
                                {pricefield.toLocaleString()}₫
                              </span>
                              <input type="hidden" name="pricefield" value={pricefield} />
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div>
                          <span>Tạm tính :</span> 
                          <span style={{ color: "black" }}>{thanhtien.toLocaleString()}₫</span>
                        </div>
                        <div>
                          <span>Giảm giá :</span> 
                          <span style={{ color: "black" }}>0₫</span>
                        </div>
                        <hr />
                        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
                          <span style={{ color: "red" }}>Thành Tiền:</span> &nbsp; 
                          <span style={{ color: "black", fontWeight: "bold" }}>
                            {thanhtien.toLocaleString()}₫
                          </span> 
                          <input type="hidden" name="thanhtien" value={thanhtien} />
                        </div>
                        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
                          <span style={{ color: "red" }}>Cọc trước 30% 
                            <span className="info-container">
                              <span className="info-icon">i</span>
                              <span className="info-content">
                                <p>Tiền quý khách thanh toán cọc giữ chổ theo quy định</p>
                              </span>
                            </span> &nbsp;
                          </span> 
                          <span style={{ color: "black", fontWeight: "bold" }}>
                            {amount.toLocaleString()}₫
                          </span> 
                          <input type="hidden" id="amountInput" name="amount" value={amount} />
                        </div>
                        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
                          <span style={{ color: "red" }}>Thanh toán khi nhận sân:</span>
                          &nbsp; 
                          <span style={{ color: "black", fontWeight: "bold" }}>
                            {(thanhtien - amount).toLocaleString()}₫
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="cart-detail p-3 p-md-4" style={{ backgroundColor: "#F1F6F9" }}>
                        <h3 className="billing-heading mb-4">Hình thức thanh toán</h3>
                        <div className="form-group">
                          <div className="col-md-12">
                            <div className="radio">
                              <label> 
                                <input type="radio" checked name="optradio" className="mr-2" readOnly />
                                <img style={{ width: "12%", height: "14%" }} src="/user/images/iconVNP.png" alt="VNPay" />VNPay
                              </label>
                            </div>
                          </div>
                        </div>

                        <div style={{ color: "black" }} className="font-italic">
                          Khi nhấn vào nút này bạn công nhận mình đã đọc và đồng ý với các 
                          <a href="/sportify/quydinh" style={{ color: "blue" }}> Điều khoản & Điều kiện </a> và 
                          <a href="/sportify/chinhsach" style={{ color: "blue" }}>Chính sách quyền riêng tư</a> của Sportify.
                          <p>
                            <button type="submit" className="btn btn-primary py-3 px-4 mt-3">Đặt Sân</button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* .col-md-8 */}
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CheckoutDatSan;
