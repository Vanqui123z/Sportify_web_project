package duan.sportify.service.impl;

import java.util.List;
import java.util.Optional;
import java.text.DecimalFormat;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import duan.sportify.DTO.FieldWithDistanceDTO;
import duan.sportify.dao.FavoriteFieldDAO;
import duan.sportify.dao.FieldDAO;
import duan.sportify.dao.UserDAO;
import duan.sportify.entities.FavoriteField;
import duan.sportify.entities.Field;
import duan.sportify.entities.Shifts;
import duan.sportify.entities.Users;
import duan.sportify.service.FieldService;

@SuppressWarnings("unused")
@Service
public class FieldServiceImpl implements FieldService {
	@Autowired
	FieldDAO fieldDAO;
	@Autowired
	duan.sportify.service.UserService userService;

	@Override
	public List<Field> findAll() {
		// TODO Auto-generated method stub
		return fieldDAO.findAll();
	}

	@Override
	public Field findById(Integer id) {
		// TODO Auto-generated method stub
		return fieldDAO.findById(id).get();
	}

	@Override
	public List<Field> findBySporttypeId(String cid) {
		// TODO Auto-generated method stub
		return fieldDAO.findBySporttypeId(cid);
	}

	@Override
	public Field create(Field fields) {
		// TODO Auto-generated method stub
		return fieldDAO.save(fields);
	}

	@Override
	public Field update(Field fields) {
		// TODO Auto-generated method stub
		return fieldDAO.save(fields);
	}

	@Override
	public List<Field> findSearch(String dateInput, String categorySelect, Integer shiftSelect) {
		// TODO Auto-generated method stub
		return fieldDAO.findSearch(dateInput, categorySelect, shiftSelect);
	}

	@Override
	public List<Field> findFieldById(Integer id) {
		// TODO Auto-generated method stub
		return fieldDAO.findFieldById(id);
	}

	@Override
	public String findNameSporttypeById(Integer id) {
		// TODO Auto-generated method stub
		return fieldDAO.findNameSporttypeById(id);
	}

	@Override
	public String findIdSporttypeById(Integer id) {
		// TODO Auto-generated method stub
		return fieldDAO.findIdSporttypeById(id);
	}

	@Override
	public List<Field> findBySporttypeIdlimit3(String cid) {
		// TODO Auto-generated method stub
		return fieldDAO.findBySporttypeIdlimit3(cid);
	}

	@Override
	public void deleteBookingDetailsByFieldId(Integer fieldId) {
		// TODO Auto-generated method stub
		fieldDAO.deleteBookingDetailsByFieldId(fieldId);
	}

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		fieldDAO.deleteById(id);
	}

	
    @Autowired
    private FavoriteFieldDAO favoriteFieldDAO;

    @Autowired
    private UserDAO userDAO;

    @Override
    public void addFavoriteField(String username, Integer fieldId) {
        Users user = userDAO.findByUsername(username);
        Field field = fieldDAO.findById(fieldId)
                              .orElseThrow(() -> new RuntimeException("Field not found"));

        FavoriteField favorite = new FavoriteField();
        favorite.setUsername(user);
        favorite.setField(field);

        favoriteFieldDAO.save(favorite); // ✅ đúng kiểu FavoriteField
    }

    @Override
    public void removeFavoriteField(String username, Integer fieldId) {
        favoriteFieldDAO.removeFavoriteField(username, fieldId);
    }

    @Override
    public List<FavoriteField> findFavoriteByUsername(String username) {
        return favoriteFieldDAO.findFavoriteByUsername(username);
    }
	@Override
	public boolean checkFavoriteField( String username, Integer fieldId) {
		// TODO Auto-generated method stub
		return favoriteFieldDAO.checkFavoriteField( username, fieldId);
	}
	@Override
	public Optional<Field> findFieldByName(String name) {
		// TODO Auto-generated method stub
		return fieldDAO.findFieldByName(name);
	}
	
	/**
     * Cập nhật dữ liệu tọa độ mẫu cho các sân chưa có tọa độ
     */
    @Modifying
    @Transactional
    private void updateSampleCoordinates() {
        try {
            System.out.println("DEBUG: Đang thêm tọa độ mẫu cho các sân...");
            
            List<Field> fields = fieldDAO.findAll();
            int updatedCount = 0;
            
            // Tọa độ trung tâm TP.HCM
            double baseLatitude = 10.8231;
            double baseLongitude = 106.6297;
            
            for (Field field : fields) {
                if (field.getLatitude() == null || field.getLongitude() == null) {
                    // Tạo tọa độ ngẫu nhiên quanh trung tâm TP.HCM trong bán kính 10km
                    double lat = baseLatitude + (Math.random() - 0.5) * 0.1;
                    double lng = baseLongitude + (Math.random() - 0.5) * 0.1;
                    
                    field.setLatitude(lat);
                    field.setLongitude(lng);
                    fieldDAO.save(field);
                    updatedCount++;
                }
            }
            
            System.out.println("DEBUG: Đã cập nhật " + updatedCount + " sân với tọa độ mẫu");
        } catch (Exception e) {
            System.err.println("ERROR: Lỗi khi cập nhật tọa độ mẫu: " + e.getMessage());
        }
    }
	
	@Override
	public List<FieldWithDistanceDTO> findNearestFields(Double userLat, Double userLng, String sporttypeId, Integer limit) {
        // Tìm các sân gần nhất
        List<Object[]> results = fieldDAO.findNearestFields(userLat, userLng, sporttypeId);
        List<FieldWithDistanceDTO> fieldWithDistances = new java.util.ArrayList<>();
        
        DecimalFormat df = new DecimalFormat("#.##");
        int count = 0;
        
        if (results.isEmpty()) {
            System.out.println("DEBUG: Không tìm thấy sân nào với tọa độ!");
            // Nếu không có sân nào có tọa độ, thêm dữ liệu tọa độ mẫu
            updateSampleCoordinates();
            // Thử tìm lại
            results = fieldDAO.findNearestFields(userLat, userLng, sporttypeId);
        }
        
        for (Object[] result : results) {
            if (count >= limit) {
                break;
            }
            
            Field field = null;
            Double distance = null;
            
            // Lấy giá trị field từ kết quả (thường là phần tử đầu tiên)
            if (result.length > 0 && result[0] instanceof Field) {
                field = (Field) result[0];
            }
            
            // Lấy giá trị khoảng cách (thường là phần tử cuối cùng)
            if (result.length > 1 && result[result.length - 1] instanceof Number) {
                distance = ((Number) result[result.length - 1]).doubleValue();
            } else {
                // Nếu không tìm thấy khoảng cách, thử tìm qua tất cả các phần tử
                for (int i = 0; i < result.length; i++) {
                    if (result[i] instanceof Number && !(result[i] instanceof Integer)) {
                        distance = ((Number) result[i]).doubleValue();
                        break;
                    }
                }
            }
            
            if (field != null && distance != null) {
                FieldWithDistanceDTO dto = new FieldWithDistanceDTO();
                dto.setField(field);
                dto.setDistance(distance);
                
                // Format khoảng cách
                String formattedDistance;
                if (distance < 1) {
                    // Nếu dưới 1km, hiển thị bằng mét
                    formattedDistance = df.format(distance * 1000) + " m";
                } else {
                    formattedDistance = df.format(distance) + " km";
                }
                dto.setFormattedDistance(formattedDistance);
                
                fieldWithDistances.add(dto);
                count++;
            }
        }
        
        return fieldWithDistances;
    }
}
