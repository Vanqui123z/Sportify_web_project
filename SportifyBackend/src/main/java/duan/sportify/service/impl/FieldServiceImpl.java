package duan.sportify.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
