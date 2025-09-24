import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import getImageUrl from "../../../utils/getImageUrl";

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
    const [loading, setLoading] = useState<boolean>(true);
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
        if (!idField) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8081/api/sportify/field/detail/${idField}`);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                // Expecting data.fieldListByIdSporttype: Field[]
                const arr: Field[] = Array.isArray(data) ? data : (data.fieldListByIdSporttype || data.fields || []);
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
            {/* Hero Section */}
            <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: "url('/user/images/backgroundField.jpg')" }} data-stellar-background-ratio="0.5">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text align-items-end justify-content-center">
                        <div className="col-md-9  mb-5 text-center">
                            <p className="breadcrumbs mb-0">
                                <span className="mr-2">
                                    <a href="/sportify">Trang Chủ <i className="fa fa-chevron-right"></i></a>
                                </span>
                                <span>
                                    <a href="/sportify/field">Sân<i className="fa fa-chevron-right"></i></a>
                                </span>
                                <span>Chi tiết sân</span>
                            </p>
                            <h2 className="mb-0 bread">Chi Tiết Sân</h2>
                        </div>
                    </div>
                </div>
            </section>

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

                                {date && (
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
                                            defaultValue={shiftsNull.length ? shiftsNull[0]?.shiftid : ""}
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

                            {date && (
                                <div className="align-self-end mb-5">
                                    <a 
                                        className="booking-link" 
                                        href={`/sportify/field/booking/${mainField?.fieldid}?shiftid=${selectedShift}&dateselect=${date}`}
                                    >
                                        <button className="col-4 pt-3 pb-3 btn btn-success" style={{ fontSize: '17px', fontWeight: 'bold' }}>
                                            Đặt sân ngay
                                        </button>
                                    </a>
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

          
            {/* Loader */}
            {loading && (
                <div id="" className="show fullscreen">
                    <svg className="circular" width="48px" height="48px">
                        <circle className="path-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="4" stroke="#eeeeee" />
                        <circle className="path" cx="24" cy="24" r="22" fill="none" strokeWidth="4" strokeMiterlimit="10" stroke="#F96D00" />
                    </svg>
                </div>
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