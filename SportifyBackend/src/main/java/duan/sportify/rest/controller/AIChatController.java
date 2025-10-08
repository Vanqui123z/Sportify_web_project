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
import duan.sportify.DTO.AIRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/sportify/rest/ai")
public class AIChatController {
    @Autowired
    BookingServiceImpl bookingServiceImpl;
    @Autowired
    AIServiceFactory aiServiceFactory;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody Map<String, Object> body,
            @RequestParam(defaultValue = "openAI") String provider) {

        String message = body != null ? (String) body.get("message") : null;
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing 'message'"));
        }

        String prompt = """
                Bạn là hệ thống hiểu ngôn ngữ tự nhiên cho web đặt sân bóng.
                Hãy trả lời ngắn gọn, dễ hiểu, không bịa đặt.
                              """.formatted(message);
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
        String prompt = """
                                     Bạn là hệ thống hiểu ngôn ngữ tự nhiên cho ứng dụng đặt sân bóng.

🎯 Nhiệm vụ:
- Phân tích câu nói của người dùng (bằng tiếng Việt).
- Trả về **chính xác 1 JSON hợp lệ**, không kèm mô tả hoặc giải thích.
- Nếu thiếu thông tin cần thiết, hãy liệt kê rõ trong trường "note".

Cấu trúc JSON bắt buộc:
{
  "intent": "create_booking | search_fields | other",
  "params": {
    "location": "",    // địa điểm (quận, khu vực, ...)
    "field_type": "",  // loại sân (mini5, mini7, futsal, ...)
    "date": "",        // ngày (YYYY-MM-DD)
    "shift": ""        // giờ hoặc ca (HH:MM)
  },
  "note": "Nếu thiếu thông tin nào, ghi rõ tên các trường cần bổ sung (bằng tiếng Việt)."
}

📘 Quy tắc xác định:
- Nếu người dùng nói về **đặt sân** → intent = "create_booking".
- Nếu người dùng nói về **tìm sân** → intent = "search_fields".
- Nếu không rõ hành động → intent = "other".

⚠️ Lưu ý:
- Không được tự đoán hoặc gán giá trị mặc định.
- Nếu người dùng không nói thông tin nào → để trống "" và ghi rõ các trường thiếu trong "note".
- Luôn trả về JSON đúng định dạng.
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
