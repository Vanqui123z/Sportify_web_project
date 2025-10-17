package duan.sportify.service.impl;

import java.util.List;
import java.util.Optional;
import java.text.DecimalFormat;

import org.springframework.beans.factory.annotation.Autowired;
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
	
    @Override
    public List<FieldWithDistanceDTO> findNearestFields(Double userLat, Double userLng, String sporttypeId,
        Integer limit, Double maxDistanceKm) {
        // Đảm bảo tọa độ hợp lệ trước khi tìm kiếm
        if (userLat < 8 || userLat > 23 || userLng < 102 || userLng > 109) {
            System.out.println("CẢNH BÁO: Tọa độ nằm ngoài khu vực Việt Nam: " + userLat + ", " + userLng);
            System.out.println("Đang điều chỉnh tọa độ về khu vực TP.HCM...");
            // Nếu tọa độ không nằm trong vùng Việt Nam, sử dụng tọa độ trung tâm TP.HCM
            userLat = 10.7769;
            userLng = 106.7;
        }

        double effectiveMaxDistance = (maxDistanceKm != null && maxDistanceKm > 0) ? maxDistanceKm : 50.0;
        List<Object[]> results = fieldDAO.findNearestFields(userLat, userLng, sporttypeId, effectiveMaxDistance);
        List<FieldWithDistanceDTO> fieldWithDistances = new java.util.ArrayList<>();

        DecimalFormat df = new DecimalFormat("#.##");
        int count = 0;

        System.out.println("Tìm sân gần nhất - Tọa độ: " + userLat + ", " + userLng + " - SportType: " + sporttypeId
            + ", maxDistanceKm: " + effectiveMaxDistance);
        System.out.println("Số kết quả trả về từ DAO: " + (results != null ? results.size() : 0));
        
        if (results == null || results.isEmpty()) {
            System.out.println("Không tìm thấy sân nào gần vị trí này!");
            return fieldWithDistances;
        }
        
        int effectiveLimit = (limit != null && limit > 0) ? limit : 10;
        for (Object[] result : results) {
            if (count >= effectiveLimit) {
                break;
            }
            
            Field field = null;
            Double distance = null;
            
            // Tìm đối tượng Field và giá trị khoảng cách trong mảng result
            for (int i = 0; i < result.length; i++) {
                if (result[i] instanceof Field) {
                    field = (Field) result[i];
                } else if (result[i] instanceof Number) {
                    distance = ((Number) result[i]).doubleValue();
                }
            }
            
            if (field != null && distance != null) {
                System.out.println("Sân ID: " + field.getFieldid() + 
                                  ", Tên: " + field.getNamefield() + 
                                  ", Tọa độ: [" + field.getLatitude() + ", " + field.getLongitude() + "]" +
                                  ", Khoảng cách: " + distance + " km");
                
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
        
        System.out.println("Số sân thỏa mãn: " + fieldWithDistances.size());
        return fieldWithDistances;
    }
}
