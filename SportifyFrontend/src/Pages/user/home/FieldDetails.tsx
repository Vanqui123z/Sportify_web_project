import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface SportType {
    sporttypeid: string;
    categoryname: string;
}

export interface Field {
    fieldid: number;
    sporttypeid?: string;
    namefield: string;
    descriptionfield?: string;
    price?: number;
    image?: string;
    address?: string;
    status?: boolean;
    sporttype?: SportType;
}

interface Shift {
    shiftid: number;
    nameshift: string;
}

const currency = (value?: number) => {
    if (value == null) return "";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const DetailFields: React.FC = () => {
    const { idField } = useParams<{ idField?: string }>();
    const [mainField, setMainField] = useState<Field | null>(null);
    const [relatedFields, setRelatedFields] = useState<Field[]>([]);
    const [shiftsNull, setShiftsNull] = useState<Shift[]>([]);
    const [date, setDate] = useState<string>("");
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [minDate, setMinDate] = useState<string>("");
    const [maxDate, setMaxDate] = useState<string>("");
    const [selectedShift, setSelectedShift] = useState<string>("");
    const selectRef = useRef<HTMLSelectElement | null>(null);

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        setMinDate(`${yyyy}-${mm}-${dd}`);
        setMaxDate(`${yyyy}-12-31`);
    }, []);

    useEffect(() => {
        if (!idField) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/sportify/field/detail/${idField}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                // Expecting data.fieldListByIdSporttype: Field[]
                const arr: Field[] = Array.isArray(data) ? data : (data.fieldListByIdSporttype || data.fields || []);
                if (!arr || arr.length === 0) return;
                const idNum = Number(idField);
                const found = arr.find((f) => Number(f.fieldid) === idNum) || arr[0];
                const others = arr.filter((f) => Number(f.fieldid) !== Number(found.fieldid));
                setMainField(found);
                setRelatedFields(others);
                // If API returned shifts in another key, we could set them here. Keep empty otherwise.
                if ((data as any).shiftsNull) {
                    setShiftsNull((data as any).shiftsNull);
                }
            } catch (err) {
                console.error("Failed to fetch field detail:", err);
            }
        };
        fetchData();
    }, [idField]);

    useEffect(() => {
        if (date) {
            const d = new Date(date);
            setFormattedDate(d.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" }));
        }
    }, [date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;
        // You may fetch available shifts for the selected date here and setShiftsNull
    };

    const handleDateBooking = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mainField) return;

    try {
        const response = await fetch(
            `http://localhost:8081/api/sportify/field/detail/check?fieldid=${mainField.fieldid}&dateInput=${date}`, 
            { method: 'POST' }
        );

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();
        console.log("Server response:", data);

        const shiftsNull = data.shiftsNull;
        setShiftsNull(shiftsNull); // Cập nhật shiftsNull với dữ liệu từ server

        if (shiftsNull.length === 0) {
            alert("Rất tiếc! Không còn ca trống nào trong ngày này.");
            return;
        }
        console.log("Available shifts:", shiftsNull);

    } catch (err) {
        console.error("Error fetching shifts:", err);
    }
};

   
    if (!mainField) {
        return (
            <div className="container py-5">
                <div className="text-center">Đang tải thông tin sân...</div>
            </div>
        );
    }

    return (
        <div>




            {/* Hero */}
            <section className="hero-wrap" style={{ backgroundImage: `url('/user/images/backgroundField.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="overlay" style={{ backgroundColor: 'rgba(0,0,0,0.45)', padding: '80px 0' }}>
                    <div className="container text-center text-white">
                        <p className="mb-1"> <a href="/sportify" className="text-white">Trang Chủ</a> <span className="mx-2">/</span> <a href="/sportify/field" className="text-white">Sân</a> <span className="mx-2">/</span> Chi tiết sân</p>
                        <h2 className="display-5">Chi Tiết Sân</h2>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <img src={mainField?.image ? `/user/images/${mainField.image}` : "/user/images/noimage.png"} className="card-img-top img-fluid" alt={mainField?.namefield} />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-success h-100">
                                <div className="card-body">
                                    <h3 className="card-title">{mainField?.namefield}</h3>
                                    <p className="text-muted mb-1"><i className="fa fa-map-marker mr-2 text-danger"></i>{mainField?.address}</p>
                                    <p className="h5 text-danger font-weight-bold">{currency(mainField?.price)} <small className="text-muted">/ Giờ</small></p>

                                    <div className="mt-4">
                                        <label className="d-block mb-2">Chọn ngày nhận sân
                                            <span className="ml-2 info-container">
                                                <span className="info-icon">i</span>
                                                <span className="info-content"><small>Chọn ngày để tìm kiếm giờ trống của sân này</small></span>
                                            </span>
                                        </label>

                                        <form onSubmit={handleSubmit} className="form-row align-items-center">
                                            <input type="hidden" value={mainField?.fieldid} name="fieldid" />

                                            <div className="col-sm-8 mb-2">
                                                <input id="dateInput" name="dateInput" required className="form-control" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={minDate} max={maxDate} />
                                            </div>

                                            <div className="col-sm-4 mb-2">
                                                <button className="btn btn-success btn-block" onClick={handleDateBooking} type="submit">Tìm kiếm</button>
                                            </div>
                                        </form>

                                        {date && (
                                            <div className="mt-3">
                                                <p className="mb-2">Các giờ trống bạn có thể đặt của ngày <strong className="text-primary">{formattedDate}</strong></p>
                                                <div className="form-group">
                                                    <select
                                                        className="form-control"
                                                        ref={selectRef}
                                                        defaultValue={shiftsNull.length ? shiftsNull[0].nameshift : ""}
                                                        onChange={e => {
                                                            setSelectedShift(e.target.value);
                                                            console.log("Selected shift:", e.target.value );
                                                        }}
                                                    >
                                                        {shiftsNull.length === 0 && <option value="">Không có ca trống</option>}
                                                        {shiftsNull.map((s, idx) => (
                                                            <option key={idx} value={s.shiftid}>{s.nameshift}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="text-left">
                                                         {/* Add logic to get selected shift and date */}
                                                    <a
                                                        className="btn btn-success"
                                                        href={
                                                            `/sportify/field/booking/${mainField?.fieldid}` +
                                                            `?shiftid=${selectedShift}&dateselect=${date}`
                                                        }
                                                       
                                                    >
                                                        Đặt sân ngay
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-5">
                            <div className="row">
                                <div className="col-lg-6">
                                    <h5>Mô tả chi tiết:</h5>
                                    <div style={{ whiteSpace: 'pre-line', textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: mainField?.descriptionfield || '' }} />
                                </div>

                                <div className="col-lg-6">
                                    <h5 className="mb-4">Các sân liên quan đến môn <span className="text-info">{mainField?.sporttype?.categoryname || ''}</span></h5>
                                    <div className="row">
                                        {relatedFields.map((f) => (
                                            <div key={f.fieldid} className="col-md-12 mb-3">
                                                <div className="card h-100">
                                                    <div className="row no-gutters">
                                                        <div className="col-4">
                                                            <img src={f.image ? `/user/images/${f.image}` : "/user/images/noimage.png"} className="img-fluid" alt={f.namefield} />
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="card-body">
                                                                <h6 className="card-title mb-1"><a href={`/sportify/field/detail/${f.fieldid}`}>{f.namefield}</a></h6>
                                                                <p className="card-text small text-truncate">{f.descriptionfield ? (f.descriptionfield.length > 100 ? f.descriptionfield.substring(0, 100) + '...' : f.descriptionfield) : ''}</p>
                                                                <a href={`/sportify/field/detail/${f.fieldid}`} className="btn btn-link p-0">Xem chi tiết</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer className="bg-dark text-light py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">Sportify - Giải Pháp Sân Thể Thao</div>
                        <div className="col-md-6 text-md-right">&copy; {new Date().getFullYear()} Team Developer Sportify</div>
                    </div>
                </div>
            </footer>

            <style>{`
        .info-content { display: none; background-color: #FAF0E4; color: #606C5D; font-weight: bold; padding: 5px; border: 1px solid #ccc; position: absolute; top: 20px; left: 0; z-index: 1; border-radius: 5px; }
        .info-icon { display: inline-block; width: 15px; height: 15px; background-color: #F2BE22; color: white; text-align: center; line-height: 15px; border-radius: 50%; cursor: pointer; position: relative; }
        .info-container:hover .info-content { display: block; }
      `}</style>

        </div>
    );
};

export default DetailFields;