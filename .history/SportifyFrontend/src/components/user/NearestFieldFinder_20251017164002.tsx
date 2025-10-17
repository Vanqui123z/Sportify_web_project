import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NearestFieldFinderProps {
  className?: string;
}

const NearestFieldFinder = ({ className }: NearestFieldFinderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Tìm sân gần nhất - Phiên bản đơn giản
  const findNearestFields = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('Đã lấy được tọa độ:', lat, lng);
        
        // Chuyển hướng với tọa độ
        navigate(`/sportify/field?latitude=${lat}&longitude=${lng}`);
        setLoading(false);
      },
      (error) => {
        console.error('Lỗi định vị:', error);
        setError("Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí trong trình duyệt.");
        setLoading(false);
      }
    );

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