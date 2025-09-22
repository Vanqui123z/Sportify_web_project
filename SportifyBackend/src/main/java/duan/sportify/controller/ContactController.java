package duan.sportify.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import duan.sportify.dao.ContactDAO;
import duan.sportify.entities.Contacts;
import duan.sportify.service.UserService;

@Controller
public class ContactController {
	@Autowired
	ContactDAO contactDAO;
	@Autowired
	UserService userService;
	String userlogin;

	@GetMapping("api/sportify/contact")
	public ResponseEntity<Map<String, Object>> view(Model model, HttpServletRequest request) {
		String sessionUser = (String) request.getSession().getAttribute("username");
		Contacts contacts = new Contacts();
		Map<String, Object> resp = new HashMap<>();
		resp.put("status", "success");
		resp.put("contacts", contacts);
		resp.put("username", sessionUser);
		return new ResponseEntity<>(resp, HttpStatus.OK);
	}

	@ResponseBody
	@PostMapping("api/user/submit-contact")
	public ResponseEntity<Map<String, Object>> processContactForm(Model model, HttpSession session, RedirectAttributes redirectAttributes,
			@RequestParam("contactType") String contactType, @RequestParam String title, HttpServletRequest request,
			@RequestParam String meesagecontact, @Valid Contacts contacts, BindingResult result) {
		Map<String, Object> resp = new HashMap<>();
		String sessionUser = (String) session.getAttribute("username");
		if (sessionUser == null) {
			resp.put("status", "error");
			resp.put("message", "Unauthorized: please login");
			return new ResponseEntity<>(resp, HttpStatus.UNAUTHORIZED);
		}
		if (result.hasErrors()) {
			resp.put("status", "error");
			resp.put("message", "Validation failed");
			return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
		}
		List<String> listcontacted = contactDAO.contactedInDay();
		if (listcontacted != null && listcontacted.contains(sessionUser)) {
			resp.put("status", "error");
			resp.put("message", "Để hạn chế spam. Bạn chỉ có thể gửi phản hồi mới vào ngày tiếp theo.");
			return new ResponseEntity<>(resp, HttpStatus.TOO_MANY_REQUESTS);
		}
		// Lưu thông tin
		contacts.setUsername(sessionUser);
		contacts.setTitle(title);
		contacts.setMeesagecontact(meesagecontact);
		contacts.setCategory(contactType);
		LocalDate localDate = LocalDate.now();
		Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
		contacts.setDatecontact(date);
		contactDAO.save(contacts);
		resp.put("status", "success");
		resp.put("message", "Sportify Cảm ơn bạn đã phản hồi");
		return new ResponseEntity<>(resp, HttpStatus.OK);
	}
}
