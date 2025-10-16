package duan.sportify.controller;

import duan.sportify.entities.Users;
import duan.sportify.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> createNotification(
            HttpServletRequest request,
            @RequestParam String message,
            @RequestParam String type) {

        // Lấy thông tin username từ session
        String username = (String) request.getSession().getAttribute("username");
        if (username == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not logged in"
            ));
        }

        // Có thể lưu thông báo vào database nếu cần, hoặc xử lý thêm logic ở đây
        // Ví dụ: notificationService.create(username, message, type);
        
        // Trả về thành công
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification created successfully");
        return ResponseEntity.ok(response);
    }
}