import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NearestFieldFinderProps {
  className?: string;
}

const NearestFieldFinder = ({ className }: NearestFieldFinderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Tìm sân gần nhất
  const findNearestFields = () => {
    setLoading(true);
    setError(null);
    
    // Sử dụng Geolocation API để lấy vị trí hiện tại của người dùng
    if ("geolocation" in navigator) {
      // Thêm timeout để đảm bảo không bị treo vô hạn
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError("Quá thời gian chờ định vị. Vui lòng thử lại.");
      }, 10000); // 10 giây timeout
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          // Thành công, lấy được tọa độ
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Log thông tin tọa độ để debug
          console.log('Đã lấy được tọa độ:', lat, lng);
          
          // Thử truy cập API trực tiếp thay vì chuyển hướng đến trang riêng biệt
          try {
            setLoading(true);
            const response = await fetch(`/api/sportify/field/nearest?latitude=${lat}&longitude=${lng}`);
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
            // Sau khi gọi API thành công, sẽ chuyển hướng đến trang danh sách sân
            navigate(`/sportify/field?latitude=${lat}&longitude=${lng}`);
          } catch (error: any) {
            console.error('Lỗi gọi API sân gần nhất:', error);
            setError(`Không thể tìm sân gần nhất: ${error?.message || 'Lỗi không xác định'}`);
            setLoading(false);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          // Xử lý lỗi chi tiết hơn
          console.error("Lỗi lấy vị trí:", error);
          let errorMsg = "Không thể xác định vị trí của bạn.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += " Vui lòng cho phép quyền truy cập vị trí trong trình duyệt.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += " Thông tin vị trí không khả dụng.";
              break;
            case error.TIMEOUT:
              errorMsg += " Quá thời gian yêu cầu vị trí.";
              break;
            default:
              errorMsg += " Lỗi không xác định.";
          }
          
          setError(errorMsg);
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, // Độ chính xác cao
          timeout: 8000,           // 8 giây timeout
          maximumAge: 0            // Không sử dụng cache
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