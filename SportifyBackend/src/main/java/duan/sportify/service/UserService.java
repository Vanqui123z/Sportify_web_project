package duan.sportify.service;

import java.util.List;

import org.apache.tomcat.jni.User;

import duan.sportify.entities.Authorized;
import duan.sportify.entities.Users;


@SuppressWarnings("unused")
public interface UserService {
	List<Users> findAll();

	Users create(Users users);

	Users update(Users users);

	void deleteByUsername(String username);
	
	Users findById(String id);

	Users findByUsername(String username);

	
	
}
