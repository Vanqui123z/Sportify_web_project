import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NearestFieldFinderProps {
  className?: string;
}

const NearestFieldFinder = ({ className }: NearestFieldFinderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Đang xác định vị trí của bạn...");
  const navigate = useNavigate();
  
  // Tìm sân gần nhất
  const findNearestFields = () => {
    setLoading(true);
    setError(null);
    setLoadingMessage("Đang xác định vị trí của bạn...");
    
    // Sử dụng Geolocation API để lấy vị trí hiện tại của người dùng
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Thành công, lấy được tọa độ
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setLoadingMessage("Đang tìm sân gần nhất, vui lòng chờ...");
          
          // Thêm timeout để người dùng thấy được thông báo chờ
          setTimeout(() => {
            navigate(`/sportify/field/nearest?latitude=${lat}&longitude=${lng}`);
          }, 500);
        },
        (error) => {
          // Xử lý lỗi
          console.error("Lỗi lấy vị trí:", error);
          
          let errorMsg = "Không thể xác định vị trí của bạn.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += " Bạn đã từ chối quyền truy cập vị trí.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += " Không lấy được thông tin vị trí.";
              break;
            case error.TIMEOUT:
              errorMsg += " Đã hết thời gian chờ.";
              break;
          }
          
          setError(errorMsg);
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
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