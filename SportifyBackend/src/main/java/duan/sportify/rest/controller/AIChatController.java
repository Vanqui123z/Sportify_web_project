package duan.sportify.rest.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import duan.sportify.service.impl.BookingServiceImpl;
import duan.sportify.utils.AIServiceFactory;
import duan.sportify.utils.PromptManager;
import duan.sportify.DTO.AIRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/sportify/rest/ai")
public class AIChatController {
    @Autowired
    BookingServiceImpl bookingServiceImpl;
    @Autowired
    AIServiceFactory aiServiceFactory;
    @Autowired
    PromptManager promptManager;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody Map<String, Object> body,
            @RequestParam(defaultValue = "openAI") String provider) {

        String message = body != null ? (String) body.get("message") : null;
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing 'message'"));
        }

        String prompt = """
                    You are SportyBot — an intelligent AI assistant that helps users search for and book sports fields through natural conversation in Vietnamese.
                ## MỤC TIÊU:
                Phân tích và hiểu người dùng đang yêu cầu thông tin gì( tìm kiếm sân, tìm kiếm khung giờ trống,  )

                                              """
                .formatted(message);
        ;

        var aiService = aiServiceFactory.getService(provider);
        String reply = aiService.chat(prompt);

        return ResponseEntity.ok(Map.of(
                "provider", provider,
                "reply", reply));
    }

    // API phân tích
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyze(@RequestBody Map<String, String> req,
            @RequestParam(defaultValue = "gemini") String provider) {


        String message = req.get("message");

        // Gửi message sang Gemini hoặc GPT (tùy bạn đang dùng)
        // String prompt = promptManager.getPrompt("booking").formatted(message);
        String prompt = """
                Bạn là trợ lý AI của hệ thống đặt sân bóng Sportify.

                🎯 Nhiệm vụ:
                Phân tích tin nhắn người dùng và xác định **ý định hành động (action)**.
                

                Bạn CHỈ được trả về **một đoạn JSON hợp lệ**, không thêm bất kỳ ký tự, giải thích hay ví dụ nào khác.( không tự ý bịa thông tin , không có thì để null)
                Nếu không hiểu yêu cầu hoặc không đủ dữ liệu → chỉ trả về:
                {"action": "UNKNOWN"}

                ---

                ## 🔧 ĐỊNH NGHĨA ACTION

                ### 1️⃣ FILTER_FIELDS
                Dùng khi người dùng tìm sân theo điều kiện (giá, loại sân, vị trí, quận, v.v.).

                Cấu trúc JSON:
                {
                  "action": "FILTER_FIELDS",
                  "filters": [
                    {"field": "price" | "type" | "district", "operator": "<" | ">" | "=", "value": any}
                  ]
                }

                ---

                ### 2️⃣ CHECK_FIELD_AVAILABILITY
                Dùng khi người dùng hỏi về thời gian trống hoặc muốn xem sân còn trống hay không.

                Cấu trúc JSON:
                {
                  "action": "CHECK_FIELD_AVAILABILITY",
                  "params": {
                    "fieldName": string | null,
                    "date": string (yyyy-MM-dd),
                    "time": string (HH:mm) | null
                  }
                }

                ---

                ### 3️⃣ BOOK_FIELD
                Dùng khi người dùng muốn **đặt sân** vào một thời điểm cụ thể.

                Cấu trúc JSON:
                {
                  "action": "BOOK_FIELD",
                  "params": {
                    "fieldName": string,
                    "date": string (yyyy-MM-dd),
                    "time": string (HH:mm)
                  }
                }

                ---

                ### 4️⃣ UNKNOWN
                Nếu yêu cầu không thuộc 3 nhóm trên hoặc không hiểu → chỉ trả về:
                {"action": "UNKNOWN"}

                ---

                ## ⚙️ QUY TẮC XỬ LÝ
                - KHÔNG thêm chữ, tiêu đề, markdown, hay ví dụ.
                - KHÔNG viết cụm “Phản hồi JSON mẫu”.
                - KHÔNG giải thích kết quả.
                - Chỉ trả về JSON duy nhất.
                - Nếu người dùng nói “tối nay”, “tối mai”, “ngày kia” → tự hiểu theo thời gian hiện tại.
                - Nếu không rõ sân nào → để `"fieldName": null`.
                - Nếu không có giờ cụ thể → để `"time": null`.

                ---

                """

                .formatted(message);

        var aiService = aiServiceFactory.getService(provider);
        String reply = aiService.chat(prompt);

        return ResponseEntity.ok(Map.of(
                "provider", provider,
                "reply", reply));
    }

    // API hành động
    @PostMapping("/execute")
    public ResponseEntity<?> execute(@RequestBody AIRequest req) {
        String intent = req.getIntent();
        Map<String, Object> params = req.getParams();

        switch (intent) {
            case "create_booking":
                return ResponseEntity.ok("Tao booking với params: " + params);
            case "cancel_booking":
                return ResponseEntity.ok("Huỷ booking với params: " + params);
            case "search_fields":
                return ResponseEntity.ok("Search sân với params: " + params);
            default:
                return ResponseEntity.ok(Map.of("message", "Tôi chưa hiểu yêu cầu này."));
        }
    }

}
