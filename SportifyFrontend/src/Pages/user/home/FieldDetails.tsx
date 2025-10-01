import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getImageUrl from "../../../helper/getImageUrl";
import HeroSection from "../../../components/user/Hero"; // Thêm import
import { fetchFieldDetail } from '../../../service/user/home/fieldApi';
import { PosthandlePermanentBookingData } from '../../../service/user/home/fieldApi';

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
    const [shiftsNull, setShiftsNull] = useState<Shift[] | null>(null);
    const [date, setDate] = useState<string>("");
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [minDate, setMinDate] = useState<string>("");
    const [maxDate, setMaxDate] = useState<string>("");
    const [selectedShift, setSelectedShift] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const navigator = useNavigate();
    // State cho modal đặt sân cố định
    const [showFixedBooking, setShowFixedBooking] = useState(false);
    const [fixedStartDate, setFixedStartDate] = useState("");
    const [fixedEndDate, setFixedEndDate] = useState("");
    const [fixedWeekdays, setFixedWeekdays] = useState<string[]>([]); // ['2', '4', ...]
    const [fixedShifts, setFixedShifts] = useState<{ [key: string]: string }>({}); // { '2': '1', '4': '2' }

    const weekdays = [
        { value: "2", label: "Thứ 2" },
        { value: "3", label: "Thứ 3" },
        { value: "4", label: "Thứ 4" },
        { value: "5", label: "Thứ 5" },
        { value: "6", label: "Thứ 6" },
        { value: "7", label: "Thứ 7" },
        { value: "CN", label: "Chủ nhật" },
    ];

    // Xử lý chọn ngày trong tuần
    const handleWeekdayChange = (weekday: string) => {
        setFixedWeekdays(prev =>
            prev.includes(weekday)
                ? prev.filter(d => d !== weekday)
                : [...prev, weekday]
        );
    };

    // Xử lý chọn ca cho từng ngày
    const handleShiftChange = (weekday: string, shiftid: string) => {
        setFixedShifts(prev => ({ ...prev, [weekday]: shiftid }));
    };



    // Đặt sân cố định (submit)
    const handlePermanentBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Chuyển đổi weekday về số (CN là 8, các thứ còn lại giữ nguyên)
        const weekdayToNumber = (w: string) => w === "CN" ? 8 : Number(w);

        // Tạo mảng details
        const details = fixedWeekdays.map((w, idx) => ({
            dayOfWeek: weekdayToNumber(w),
            shiftId: Number(fixedShifts[w])
        }));

        const payload = {
            fieldId: mainField?.fieldid,
            startDate: fixedStartDate,
            endDate: fixedEndDate,
            active: 1,
            details
        };

        console.log("Payload for permanent booking:", payload);
        await PosthandlePermanentBookingData(mainField?.fieldid, payload);
        navigator(`/sportify/field/booking/${idField}?parmanent=true`);
        setShowFixedBooking(false);
    };


//      "permanentId": 5,
//   "fieldId": 1,
//   "username": "adminsportify",
//   "startDate": "2025-10-01",
//   "endDate": "2025-12-31",
//   "active": 1,
//   "details": [
//     { "detailId": 10, "dayOfWeek": 1, "shiftId": 1 },
//     { "detailId": 11, "dayOfWeek": 3, "shiftId": 2 },
//     { "detailId": 12, "dayOfWeek": 6, "shiftId": 3 }
//   ]

    useEffect(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        setMinDate(`${yyyy}-${mm}-${dd}`);
        setMaxDate(`${yyyy}-12-31`);
    }, []);

    useEffect(() => {
        if (!idField) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchFieldDetail(idField);
                if (!data) throw new Error('Failed to fetch field detail');
                const arr: Field[] = Array.isArray(data.fieldListByIdSporttype) ? data.fieldListByIdSporttype : (data.fields || []);
                if (!arr || arr.length === 0) {
                    setLoading(false);
                    return;
                }
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
            } finally {
                setLoading(false);
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
    useEffect(() => {
        if (shiftsNull && shiftsNull.length > 0) {
            setSelectedShift(String(shiftsNull[0].shiftid));
        }
    }, [shiftsNull]);



    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">Đang tải thông tin sân...</div>
            </div>
        );
    }

    if (!mainField) {
        return (
            <div className="container py-5">
                <div className="text-center">Không tìm thấy thông tin sân.</div>
            </div>
        );
    }

    return (
        <div>
            <HeroSection
                backgroundImage="/user/images/backgroundField.jpg"
                title="Chi Tiết Sân"
                breadcrumbs={[
                    { label: "Trang Chủ", href: "/sportify" },
                    { label: "Sân", href: "/sportify/field" },
                    { label: "Chi tiết sân" }
                ]}
            />

            {/* Main Content */}
            <section className="">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-5 ">
                            <img
                                className="block-20 block-19 img"
                                src={mainField?.image ? getImageUrl(mainField.image) : "/user/images/noimage.png"}
                                alt="Image"
                            />
                        </div>

                        <div className="col-lg-6 pl-md-5  border border-success rounded" style={{ height: 'auto' }}>
                            <h3 className="mt-4">{mainField?.namefield}</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                            <b className="font-italic">{mainField?.address}</b>
                            <p></p>
                            <span className="text-danger font-weight-bold">{currency(mainField?.price)}</span> / <span className="font-weight-bold">Giờ</span>

                            <div className="border border-secondary rounded col-11 mb-4 mt-3">
                                <span className="ml-3 mt-4 mb-1">
                                    Chọn ngày nhận sân
                                    <span className="info-container">
                                        <span className="info-icon">i</span>
                                        <span className="info-content">
                                            <small>Chọn ngày để tìm kiếm giờ trống của sân này</small>
                                        </span>
                                    </span>
                                </span>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mb-2 d-flex justify-content-center col-12"
                                >
                                    <input type="hidden" value={mainField?.fieldid} name="fieldid" />
                                    <input
                                        style={{ border: '2px solid gray', fontWeight: 'lighter' }}
                                        id="dateInput"
                                        name="dateInput"
                                        required
                                        className="form-control mr-1 col-9"
                                        type="date"
                                        placeholder="Search"
                                        aria-label="Search"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={minDate}
                                        max={maxDate}
                                    />

                                    <button
                                        style={{ border: '2px solid #28a745' }}
                                        className="btn btn-success col-3"
                                        type="submit"
                                        onClick={handleDateBooking}
                                    >
                                        Tìm kiếm
                                    </button>
                                </form>

                                {shiftsNull && (
                                    <div className="col-12">
                                        <span className="ml-1 mt-3 mb-1">
                                            Các giờ trống bạn có thể đặt của ngày <b className="font-weight-bold text-primary">{formattedDate}</b>
                                        </span>
                                        <select
                                            style={{ border: '2px solid gray', fontWeight: 'lighter' }}
                                            name="nameshift"
                                            className="form-control custom-select mb-3 col-12"
                                            id="inputGroupSelect01"
                                            ref={selectRef}
                                            value={selectedShift}
                                            onChange={e => {
                                                setSelectedShift(e.target.value);
                                                console.log("Selected shift:", e.target.value);
                                            }}
                                        >
                                            {shiftsNull.length === 0 && <option value="">Không có ca trống</option>}
                                            {shiftsNull.map((s, idx) => (
                                                <option key={idx} value={s.shiftid}>{s.nameshift}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {shiftsNull && (
                                <div className="align-self-end mb-5">
                                    <a
                                        className="booking-link"
                                        href={`/sportify/field/booking/${mainField?.fieldid}?shiftid=${selectedShift}&dateselect=${date}`}
                                    >
                                        <button className="col-4 pt-3 pb-3 btn btn-success" style={{ fontSize: '17px', fontWeight: 'bold' }}>
                                            Đặt sân ngay
                                        </button>
                                    </a>

                                    <button className="ml-5 col-4 pt-3 pb-3 btn btn-secondary" style={{ fontSize: '17px', fontWeight: 'bold' }} onClick={() => setShowFixedBooking(true)}>
                                        Đặt sân cố định
                                    </button>

                                </div>
                            )}
                        </div>

                        <div className="col-12 d-flex">
                            <div className="col-6">
                                <br />
                                <h5 className="font-weight-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
                                    Mô tả chi tiết:
                                </h5>
                                <div
                                    style={{
                                        whiteSpace: 'pre-line',
                                        wordWrap: 'break-word',
                                        fontFamily: '14/ 18px Arial, sans-serif',
                                        textAlign: 'justify',
                                        fontSize: '16px',
                                        lineHeight: '1.5'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: mainField?.descriptionfield || '' }}
                                />

                                <div className="row mt-4">
                                    <div className="input-group col-md-6 d-flex mb-3"></div>
                                    <div className="w-100"></div>
                                    <div className="col-md-12"></div>
                                </div>
                            </div>

                            {/* Related Fields */}
                            <div className="ml-5 mt-5 col-6">
                                <h4 className="col-12 mb-5">
                                    Các sân liên quan đến môn <span className="font-weight-bold text-info">{mainField?.sporttype?.categoryname}</span>
                                </h4>
                                {relatedFields.map((f) => (
                                    <div key={f.fieldid} className="col-12 d-flex align-items-stretch ">
                                        <div className="blog-entry d-flex">
                                            <img
                                                className="block-20 img"
                                                src={f.image ? getImageUrl(f.image) : "/user/images/noimage.png"}
                                                alt="Image"
                                            />

                                            <div className="text p-4 bg-light">
                                                <h3 className="heading mb-3">
                                                    <a href={`/sportify/field/detail/${f.fieldid}`}>{f.namefield}</a>
                                                </h3>
                                                <p
                                                    className="truncate-text"
                                                    style={{ maxWidth: '200px' }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: f.descriptionfield && f.descriptionfield.length > 200
                                                            ? f.descriptionfield.substring(0, 105) + '...'
                                                            : f.descriptionfield || ''
                                                    }}
                                                />
                                                <a href={`/sportify/field/detail/${f.fieldid}`} className="btn-custom">
                                                    xem chi tiết <span className="fa fa-long-arrow-right"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal đặt sân cố định */}
            {showFixedBooking && shiftsNull ? (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: 30, borderRadius: 10, minWidth: 350, maxWidth: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                        <h4 className="mb-3">Đặt sân cố định theo tuần</h4>
                        <form onSubmit={handlePermanentBookingSubmit}>
                            <div className="form-group mb-2">
                                <label>Ngày bắt đầu:</label>
                                <input type="date" className="form-control" required value={fixedStartDate} min={minDate} max={maxDate} onChange={e => setFixedStartDate(e.target.value)} />
                            </div>
                            <div className="form-group mb-2">
                                <label>Ngày kết thúc:</label>
                                <input type="date" className="form-control" required value={fixedEndDate} min={fixedStartDate || minDate} max={maxDate} onChange={e => setFixedEndDate(e.target.value)} />
                            </div>
                            <div className="form-group mb-2">
                                <label>Chọn các ngày trong tuần:</label>
                                <div className="d-flex flex-wrap">
                                    {weekdays.map(w => (
                                        <div key={w.value} className="mr-2 mb-1">
                                            <input type="checkbox" id={`weekday-${w.value}`} checked={fixedWeekdays.includes(w.value)} onChange={() => handleWeekdayChange(w.value)} />
                                            <label htmlFor={`weekday-${w.value}`} className="ml-1">{w.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {fixedWeekdays.length > 0 ? (
                                <div className="form-group mb-2">
                                    <label>Chọn ca cho từng ngày:</label>
                                    {fixedWeekdays.map(w => (
                                        <div key={w} className="mb-1">
                                            <span className="mr-2">{weekdays.find(x => x.value === w)?.label}:</span>
                                            <select className="form-control d-inline-block w-auto" value={fixedShifts[w] || ""} onChange={e => handleShiftChange(w, e.target.value)} required>
                                                <option value="">Chọn ca</option>
                                                {shiftsNull.map(s => (
                                                    <option key={s.shiftid} value={s.shiftid}>{s.nameshift}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="form-group mb-2">Chọn ca cho từng ngày lỗi  </div>
                            )}
                            <div className="d-flex justify-content-end mt-3">
                                <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowFixedBooking(false)}>Hủy</button>
                                <button type="submit" className="btn btn-success">Đặt sân</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div>Lỗi booking</div>
            )}

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
        </div>
    );
};

export default DetailFields;