import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NearestFieldFinderProps {
  className?: string;
}

const NearestFieldFinder = ({ className }: NearestFieldFinderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  // Kiểm tra quyền truy cập vị trí khi component được render
  useEffect(() => {
    // Kiểm tra xem trình duyệt có hỗ trợ Geolocation không
    if ("geolocation" in navigator) {
      // Kiểm tra trạng thái quyền vị trí
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' as PermissionName })
          .then((permissionStatus) => {
            setIsLocationEnabled(permissionStatus.state === 'granted');
            
            // Lắng nghe các thay đổi về trạng thái quyền
            permissionStatus.onchange = () => {
              setIsLocationEnabled(permissionStatus.state === 'granted');
            };
          })
          .catch(() => {
            // Nếu không thể kiểm tra quyền, giả định là có thể truy cập
            setIsLocationEnabled(true);
          });
      }
    } else {
      setIsLocationEnabled(false);
    }
  }, []);
  
  // Tìm sân gần nhất
  const findNearestFields = async () => {
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
        async (position) => {
          clearTimeout(timeoutId);
          // Thành công, lấy được tọa độ
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Log thông tin tọa độ để debug
          console.log('Đã lấy được tọa độ:', lat, lng);
          
          // Gọi API tìm kiếm sân gần nhất
          try {
            // Đảm bảo chúng ta đang ở trạng thái loading
            setLoading(true);
            
            // Gọi API tìm kiếm sân gần nhất
            const response = await fetch(`/api/sportify/field/nearest?latitude=${lat}&longitude=${lng}`);
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
            
            // Phân tích dữ liệu JSON
            const data = await response.json();
            console.log('Kết quả API:', data);
            
            // Kiểm tra dữ liệu trả về
            if (data && data.fieldList && data.fieldList.length > 0) {
              console.log(`Tìm thấy ${data.fieldList.length} sân gần nhất`);
              // Chuyển hướng đến trang hiển thị sân với tọa độ đã lấy
              navigate(`/sportify/field?latitude=${lat}&longitude=${lng}`);
            } else {
              // Không tìm thấy sân nào gần vị trí hiện tại
              setError("Không tìm thấy sân gần vị trí của bạn. Vui lòng thử lại sau hoặc kiểm tra dữ liệu tọa độ trong database.");
              setLoading(false);
            }
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
      
      {isLocationEnabled === false && !error && (
        <div className="location-warning">
          Vui lòng bật quyền truy cập vị trí trên trình duyệt để sử dụng tính năng này.
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default NearestFieldFinder;