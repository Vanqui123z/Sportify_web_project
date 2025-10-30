import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NearestFieldFinderProps {
  className?: string;
  categorySelect?: string; // Thêm prop để truyền loại sân được chọn
}

const NearestFieldFinder = ({ className, categorySelect = 'tatca' }: NearestFieldFinderProps) => {
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
        
        // Chuyển hướng với tọa độ và loại sân
        navigate(`/sportify/field?latitude=${lat}&longitude=${lng}&categorySelect=${categorySelect}`);
        setLoading(false);
      },
      (error) => {
        console.error('Lỗi định vị:', error);
        setError("Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí trong trình duyệt.");
        setLoading(false);
      }
    );
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