package duan.sportify.rest.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import duan.sportify.GlobalExceptionHandler;
import duan.sportify.dao.FieldDAO;

import duan.sportify.entities.Field;
import duan.sportify.entities.Sporttype;
import duan.sportify.utils.ErrorResponse;
import duan.sportify.service.UploadService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("rest/fields/")
public class FieldRestController {
	@Autowired
	MessageSource messagesource;
	@Autowired
	FieldDAO fieldDAO;

	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	UploadService uploadService;

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
		return GlobalExceptionHandler.handleValidationException(ex);
	}

	@GetMapping("getAll")
	public ResponseEntity<List<Field>> getAll(Model model) {
		return ResponseEntity.ok(fieldDAO.findAll());
	}

	@GetMapping("getAllActive")
	public ResponseEntity<List<Field>> getAllActive(Model model) {
		return ResponseEntity.ok(fieldDAO.findAllActive());
	}

	@GetMapping("get/{id}")
	public ResponseEntity<Field> getOne(@PathVariable("id") Integer id) {
		if (!fieldDAO.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(fieldDAO.findById(id).get());
	}

	@PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> create(
		@RequestParam("sporttypeid") String sporttypeid,
		@ModelAttribute Field field,
		@RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

		// ánh xạ sporttype từ id
		 field.setSporttype(entityManager.getReference(Sporttype.class, sporttypeid));

		if (field.getFieldid() != null && fieldDAO.existsById(field.getFieldid())) {
			return ResponseEntity.badRequest().body("Field đã tồn tại");
		}
		// Upload avatar nếu có
		if (imageFile != null && !imageFile.isEmpty()) {
			try {
				// Upload ảnh lên Cloudinary
				String imageUrl = uploadService.uploadImage(imageFile, "field_images");
				System.out.println("Uploaded image URL: " + imageUrl);
				field.setImage(imageUrl);
			} catch (Exception e) {
				return ResponseEntity.status(500).body("Upload avatar thất bại: " + e.getMessage());
			}
		}
		Field savedField = fieldDAO.save(field);
		// Trả về entity vừa lưu
    	return ResponseEntity.ok(savedField);
	}

	@PutMapping("update/{id}")
	public ResponseEntity<Field> update(@PathVariable("id") Integer id, @Valid @RequestBody Field field) {
		if (!fieldDAO.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		fieldDAO.save(field);
		return ResponseEntity.ok(field);
	}

	@DeleteMapping("delete/{id}")
	public ResponseEntity<Map<String, Object>> delete(@PathVariable("id") Integer id) {
		if (!fieldDAO.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		fieldDAO.deleteBookingDetailsByFieldId(id);
		fieldDAO.deleteById(id);
		return ResponseEntity.ok(Map.of(
				"success", true,
				"message", "Field deleted successfully"));
	}

	// search team in admin
	@GetMapping("search")
	public ResponseEntity<List<Field>> search(
			@RequestParam("namefield") Optional<String> namefield,
			@RequestParam("sporttypeid") Optional<String> sporttypeid,
			@RequestParam("status") Optional<Integer> status) {
		return ResponseEntity.ok(fieldDAO.searchFieldAdmin(namefield, sporttypeid, status));
	}
}
