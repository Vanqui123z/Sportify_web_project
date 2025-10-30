import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NearestFieldFinder = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Tìm sân gần nhất
  const findNearestFields = () => {
    setLoading(true);
    setError(null);
    
    // Sử dụng Geolocation API để lấy vị trí hiện tại của người dùng
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Thành công, chuyển hướng đến API tìm sân gần nhất với tọa độ
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          navigate(`/sportify/field/nearest?latitude=${lat}&longitude=${lng}`);
        },
        (error) => {
          // Xử lý lỗi
          console.error("Lỗi lấy vị trí:", error);
          setError("Không thể xác định vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
          setLoading(false);
        }
      );
    } else {
      setError("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng thử trình duyệt khác.");
      setLoading(false);
    }
  };

  return (
    <div className={`nearest-field-finder ${className || ''}`}>
      <button 
        onClick={findNearestFields} 
        disabled={loading}
        className="find-nearest-btn"
      >
        {loading ? "Đang tìm..." : "Tìm sân gần nhất"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NearestFieldFinder;