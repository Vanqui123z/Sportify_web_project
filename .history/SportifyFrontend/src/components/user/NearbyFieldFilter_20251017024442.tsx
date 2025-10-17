import React, { useState, useEffect } from 'react';
import '../../styles/NearbyFieldFilter.css';
import type { Field, Location } from '../../Types/field.types';

interface NearbyFieldFilterProps {
  fields: Field[];
  onFilterChange: (filteredFields: Field[]) => void;
}

const NearbyFieldFilter: React.FC<NearbyFieldFilterProps> = ({ fields, onFilterChange }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(10); // Default 10km

  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Không thể xác định vị trí của bạn. Vui lòng cho phép quyền truy cập vị trí.");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      setIsLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number | null, lon2: number | null): number => {
    if (lat2 === null || lon2 === null) return 9999; // Trả về một giá trị lớn nếu không có tọa độ
    
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(2));
  };

  // Filter and sort fields by distance when user location changes
  useEffect(() => {
    if (userLocation && fields && fields.length > 0) {
      const fieldsWithDistance = fields.map((field) => {
        // Use the field's coordinates from the database if available,
        // otherwise use the location object we created
        const fieldLat = field.latitude || (field.location ? field.location.latitude : null);
        const fieldLng = field.longitude || (field.location ? field.location.longitude : null);
        
        // Calculate distance if field has location data
        const distance = fieldLat && fieldLng
          ? calculateDistance(userLocation.latitude, userLocation.longitude, fieldLat, fieldLng)
          : null;
        
        return { ...field, distance };
      });

      // Filter by max distance and sort by proximity
      const filteredFields = fieldsWithDistance
        .filter((field) => field.distance !== null && field.distance <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      onFilterChange(filteredFields);
    }
  }, [userLocation, fields, maxDistance, onFilterChange]);

  // Handle distance change
  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxDistance(parseInt(e.target.value, 10));
  };

  return (
    <div className="nearby-field-filter">
      <h3>Tìm sân gần bạn</h3>
      
      <div className="filter-controls">
        <button 
          className="location-btn"
          onClick={getUserLocation} 
          disabled={isLoading}
        >
          {isLoading ? 'Đang tìm...' : 'Xác định vị trí của tôi'}
        </button>
        
        <div className="distance-selector">
          <label htmlFor="distance">Khoảng cách:</label>
          <select 
            id="distance" 
            value={maxDistance} 
            onChange={handleDistanceChange}
            disabled={!userLocation}
          >
            <option value="2">2 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {userLocation && (
        <div className="location-info">
          <p>Vị trí của bạn: {userLocation.latitude?.toFixed(6)}, {userLocation.longitude?.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default NearbyFieldFilter;