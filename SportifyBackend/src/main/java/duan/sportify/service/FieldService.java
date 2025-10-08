package duan.sportify.service;

import java.util.List;

import org.springframework.data.repository.query.Param;

import com.fasterxml.jackson.databind.node.BooleanNode;

import duan.sportify.entities.FavoriteField;
import duan.sportify.entities.Field;
import duan.sportify.entities.Shifts;
import duan.sportify.entities.Users;





@SuppressWarnings("unused")
public interface FieldService {
	List<Field> findAll();

	List<Field> findBySporttypeId(String cid);
	Field create(Field fields);

	Field update(Field fields);

	// void delete(Integer id);
	
	Field findById(Integer id);

	
	List<Field> findSearch(String dateInput, String categorySelect, Integer shiftSelect);
	
	List<Field> findFieldById(Integer id);
	
	List<Field> findBySporttypeIdlimit3(String cid);
	String findNameSporttypeById(Integer id);
	
	String findIdSporttypeById(Integer id);

	void deleteBookingDetailsByFieldId(Integer fieldId);
    void deleteById(Integer id);

	//favorite
	 void addFavoriteField(String username, Integer fieldId) ;
     void removeFavoriteField(String username, Integer fieldId) ;
     List<FavoriteField> findFavoriteByUsername(String username) ;
	    boolean checkFavoriteField(String username,  Integer fieldId);



}
