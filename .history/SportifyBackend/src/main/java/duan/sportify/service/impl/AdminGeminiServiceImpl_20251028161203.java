package duan.sportify.service.impl;

import duan.sportify.entities.Products;
import duan.sportify.entities.Field;
import duan.sportify.entities.Eventweb;
import duan.sportify.entities.Users;
import duan.sportify.service.AIService;
import duan.sportify.service.ProductService;
import duan.sportify.service.FieldService;
import duan.sportify.service.EventService;
import duan.sportify.service.UserService;
import duan.sportify.service.CategoryService;
import duan.sportify.service.ShiftService;
import duan.sportify.entities.Categories;
import duan.sportify.entities.Shifts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AdminGeminiServiceImpl - Sử dụng Google Generative AI (Gemini) cho Admin
 * Gọi Gemini API bằng REST với context từ database (sản phẩm, sân, tài khoản, sự kiện, đặt sân, doanh thu...)
 */
@Service
public class AdminGeminiServiceImpl implements AIService {

    @Value("${gemini.api.key:AIzaSyCMzeffGly3YyAHiiBhcdppK8F1Hs-1KmA}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-2.0-flash-exp}")
    private String geminiModel;

    @Autowired
    private ProductService productService;
    
    @Autowired
    private FieldService fieldService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private ShiftService shiftService;

    @Override
    public Object data() {
        return null;
    }

    @Override
    public String chat(String message) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "⚠️ Gemini API key chưa được cấu hình.";
        }

        try {
            // Lấy dữ liệu từ tất cả các service
            List<Products> products = productService.findAll();
            List<Field> fields = fieldService.findAll();
            List<Eventweb> events = eventService.findAll();
            List<Users> users = userService.findAll();
            List<Category> categories = categoryService.findAll();
            List<Shift> shifts = shiftService.findAll();
            
            // Xây dựng context HTML cho tất cả
            String productHTML = buildProductHTML(products, categories);
            String fieldHTML = buildFieldHTML(fields);
            String eventHTML = buildEventHTML(events);
            String userHTML = buildUserHTML(users);
            String shiftHTML = buildShiftHTML(shifts);
            String categoryHTML = buildCategoryHTML(categories);
            String bookingHTML = "<h3>📋 Quản Lý Đặt Sân</h3><p>Xem danh sách các đơn đặt sân, trạng thái booking, hủy hoặc chỉnh sửa đặt sân. Theo dõi doanh thu từ các đơn đặt.</p>";
            String revenueHTML = "<h3>💰 Doanh Thu</h3><p>Theo dõi tổng doanh thu, doanh thu theo tháng, theo sản phẩm và theo sân. Xem chi tiết các giao dịch thành công.</p>";

            // Xây dựng prompt với tất cả context
            String prompt = buildAdminPrompt(message, productHTML, fieldHTML, eventHTML, userHTML, shiftHTML, categoryHTML, bookingHTML, revenueHTML);

            System.out.println("🔵 Gọi Gemini API (Admin) với câu hỏi: " + message);
            System.out.println("📦 Dữ liệu: " + products.size() + " sản phẩm, " + 
                             fields.size() + " sân, " + events.size() + " sự kiện, " +
                             users.size() + " người dùng, " + categories.size() + " danh mục");

            // Retry logic - thử lại 3 lần nếu lỗi
            int maxRetries = 3;
            int retryCount = 0;
            Exception lastException = null;
            
            while (retryCount < maxRetries) {
                try {
                    String response = callGeminiAPI(prompt);
                    if (response != null) {
                        System.out.println("✅ Response nhận được từ Gemini (Admin)");
                        return response;
                    }
                } catch (Exception ex) {
                    lastException = ex;
                    retryCount++;
                    System.out.println("⏳ Lần thử lại " + retryCount + "/" + maxRetries + ": " + ex.getMessage());
                    
                    if (retryCount < maxRetries) {
                        // Chờ 1 giây trước khi thử lại
                        Thread.sleep(1000);
                    }
                }
            }
            
            // Nếu tất cả lần thử đều fail
            if (lastException != null) {
                System.out.println("❌ Lỗi sau " + maxRetries + " lần thử: " + lastException.getMessage());
                return "😅 Xin lỗi, AI Gemini đang quá tải. Vui lòng thử lại sau vài giây!";
            }
            
            return "❌ Không nhận được phản hồi từ Gemini";
        } catch (Exception ex) {
            System.out.println("❌ Exception: " + ex.getClass().getName() + " - " + ex.getMessage());
            ex.printStackTrace();
            return "😅 Có lỗi xảy ra: " + ex.getMessage();
        }
    }

    /**
     * Gọi Gemini API với retry logic
     */
    private String callGeminiAPI(String prompt) throws Exception {
        Map<String, Object> payload = Map.of(
            "contents", List.of(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", prompt))
            ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        RestTemplate restTemplate = new RestTemplate();
        String url = String.format(
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
            geminiModel, geminiApiKey
        );

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> res = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) 
            restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(payload, headers), Map.class);

        System.out.println("📥 Response Status: " + res.getStatusCode());

        String result = extractGeminiText(res.getBody());
        return result;
    }

    /**
     * Xây dựng danh sách sản phẩm dưới dạng HTML
     */
    private String buildProductHTML(List<Products> products, List<Category> categories) {
        if (products == null || products.isEmpty()) return "Chưa có sản phẩm nào.";
        
        return "<h3>📦 Quản Lý Sản Phẩm</h3>" + products.stream()
            .limit(20)
            .map(product -> {
                String categoryName = categories.stream()
                    .filter(c -> c.getCategoryid() == product.getCategoryid())
                    .map(Category::getCategoryname)
                    .findFirst()
                    .orElse("Không xác định");
                
                return String.format(
                    "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                    "<strong>%s</strong> - %s VND<br>" +
                    "Danh mục: %s | Số lượng: %d<br>" +
                    "%s" +
                    "</div>",
                    product.getProductname(),
                    product.getPrice().toLocaleString("en_US"),
                    categoryName,
                    product.getStock(),
                    product.getDescription() != null ? product.getDescription() : ""
                );
            })
            .collect(Collectors.joining());
    }

    /**
     * Xây dựng danh sách sân dưới dạng HTML
     */
    private String buildFieldHTML(List<Field> fields) {
        if (fields == null || fields.isEmpty()) return "Chưa có sân nào.";
        
        return "<h3>⚽ Quản Lý Sân Thể Thao</h3>" + fields.stream()
            .limit(20)
            .map(field -> String.format(
                "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                "<strong>%s</strong> - %s VND/giờ<br>" +
                "Địa chỉ: %s<br>" +
                "Trạng thái: %s" +
                "</div>",
                field.getNamefield(),
                field.getPrice().toLocaleString("en_US"),
                field.getAddress(),
                field.isStatus() ? "Hoạt động ✅" : "Đã tắt ❌"
            ))
            .collect(Collectors.joining());
    }

    /**
     * Xây dựng danh sách sự kiện dưới dạng HTML
     */
    private String buildEventHTML(List<Eventweb> events) {
        if (events == null || events.isEmpty()) return "Chưa có sự kiện nào.";
        
        return "<h3>📅 Quản Lý Sự Kiện</h3>" + events.stream()
            .limit(20)
            .map(event -> String.format(
                "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                "<strong>%s</strong><br>" +
                "Mô tả: %s<br>" +
                "Trạng thái: %s" +
                "</div>",
                event.getEventname(),
                event.getDescription() != null ? event.getDescription() : "N/A",
                "Hoạt động ✅"
            ))
            .collect(Collectors.joining());
    }

    /**
     * Xây dựng danh sách người dùng dưới dạng HTML
     */
    private String buildUserHTML(List<Users> users) {
        if (users == null || users.isEmpty()) return "Chưa có người dùng nào.";
        
        long totalUsers = users.size();
        long activeUsers = users.stream().filter(u -> u.isStatus()).count();
        
        return "<h3>👥 Quản Lý Tài Khoản</h3>" +
            String.format(
                "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                "<strong>Tổng người dùng:</strong> %d<br>" +
                "<strong>Người dùng hoạt động:</strong> %d<br>" +
                "<strong>Người dùng không hoạt động:</strong> %d" +
                "</div>",
                totalUsers, activeUsers, totalUsers - activeUsers
            ) +
            users.stream()
                .limit(20)
                .map(user -> String.format(
                    "<div style=\"border: 1px solid #ddd; padding: 8px; margin: 3px 0; background: #fff;\">" +
                    "<strong>%s</strong> (%s)<br>" +
                    "Email: %s | Trạng thái: %s" +
                    "</div>",
                    user.getUsername(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getEmail(),
                    user.isStatus() ? "✅" : "❌"
                ))
                .collect(Collectors.joining());
    }

    /**
     * Xây dựng danh sách ca sân dưới dạng HTML
     */
    private String buildShiftHTML(List<Shift> shifts) {
        if (shifts == null || shifts.isEmpty()) return "Chưa có ca nào.";
        
        return "<h3>🕐 Quản Lý Ca Sân</h3>" + shifts.stream()
            .limit(20)
            .map(shift -> String.format(
                "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                "<strong>%s</strong><br>" +
                "Thời gian: %s - %s" +
                "</div>",
                shift.getNameshift(),
                shift.getTimeStart(),
                shift.getTimeEnd()
            ))
            .collect(Collectors.joining());
    }

    /**
     * Xây dựng danh sách danh mục dưới dạng HTML
     */
    private String buildCategoryHTML(List<Category> categories) {
        if (categories == null || categories.isEmpty()) return "Chưa có danh mục nào.";
        
        return "<h3>📂 Quản Lý Danh Mục</h3>" + categories.stream()
            .limit(20)
            .map(category -> String.format(
                "<div style=\"border: 1px solid #e0e0e0; padding: 10px; margin: 5px 0; border-radius: 4px; background: #f5f5f5;\">" +
                "<strong>%s</strong>" +
                "</div>",
                category.getCategoryname()
            ))
            .collect(Collectors.joining());
    }

    /**
     * Xây dựng prompt cho admin
     */
    private String buildAdminPrompt(String userMessage, String productHTML, String fieldHTML, 
                                   String eventHTML, String userHTML, String shiftHTML,
                                   String categoryHTML, String bookingHTML, String revenueHTML) {
        return "Bạn là một trợ lý AI thông minh cho hệ thống quản lý Sportify dành cho Admin.\n" +
               "Bạn sẽ trợ giúp admin quản lý:\n" +
               "- Sản phẩm (xem, thêm, xóa, cập nhật)\n" +
               "- Sân thể thao (xem, thêm, xóa, cập nhật)\n" +
               "- Tài khoản người dùng (quản lý, khóa, mở khóa)\n" +
               "- Sự kiện / Đội (tạo, sửa, xóa)\n" +
               "- Đơn đặt sân (xem chi tiết, hủy, xác nhận)\n" +
               "- Danh mục (quản lý)\n" +
               "- Doanh thu (xem thống kê, báo cáo)\n" +
               "- Ca sân (quản lý giờ mở cửa)\n\n" +
               "DỮ LIỆU HIỆN TẠI HỆ THỐNG:\n" +
               productHTML + "\n\n" +
               fieldHTML + "\n\n" +
               eventHTML + "\n\n" +
               userHTML + "\n\n" +
               shiftHTML + "\n\n" +
               categoryHTML + "\n\n" +
               bookingHTML + "\n\n" +
               revenueHTML + "\n\n" +
               "YÊU CẦU CỦA ADMIN:\n" + userMessage + "\n\n" +
               "Hãy trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp.\n" +
               "Nếu là HTML, hãy format đẹp mắt để hiển thị tốt trên web.\n" +
               "Cung cấp thông tin hữu ích, đề xuất và hướng dẫn chi tiết cho admin.";
    }

    /**
     * Trích xuất text từ response của Gemini API
     */
    private String extractGeminiText(Map<String, Object> responseBody) {
        try {
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<?> candidates = (List<?>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                    if (content != null) {
                        List<?> parts = (List<?>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map<?, ?> part = (Map<?, ?>) parts.get(0);
                            Object text = part.get("text");
                            return text != null ? text.toString() : "";
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error extracting text from Gemini response: " + e.getMessage());
        }
        return "";
    }
}
