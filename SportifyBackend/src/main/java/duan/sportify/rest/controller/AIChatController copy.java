package duan.sportify.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import duan.sportify.service.EventService;
import duan.sportify.service.FieldService;
import duan.sportify.service.ProductService;
import duan.sportify.service.SportTypeService;
import duan.sportify.service.UserService;
import duan.sportify.service.impl.BookingServiceImpl;
import duan.sportify.utils.PromptManager;
import duan.sportify.utils.AI.AIServiceFactory;
import duan.sportify.utils.AI.AIActionHandler;
import duan.sportify.utils.AI.ChatContextManager;
import duan.sportify.DTO.AIRequest;
import duan.sportify.DTO.FieldRequestAI;
import duan.sportify.entities.Eventweb;
import duan.sportify.entities.Field;
import duan.sportify.entities.Users;

@CrossOrigin("*")
@RestController
@RequestMapping("/sportify/rest/ai")
public class AIChatController {

  @Autowired
  EventService eventWebService;
  @Autowired
  FieldService fieldService;
  @Autowired
  BookingServiceImpl bookingServiceImpl;
  @Autowired
  AIServiceFactory aiServiceFactory;
  @Autowired
  PromptManager promptManager;
  @Autowired
  AIActionHandler AIActionHandler;
   @Autowired
  ChatContextManager contextManager;

  @PostMapping("/chat")
  public ResponseEntity<Map<String, Object>> chat(
      @RequestBody Map<String, Object> body,
        HttpServletRequest request,
      @RequestParam(defaultValue = "Gemnini") String provider) {

    String message = body != null ? (String) body.get("message") : null;
    if (message == null || message.trim().isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Missing 'message'"));
    }
// Lấy userId từ session (hoặc từ request body nếu đã chứa)
    String userId = (String) request.getSession().getAttribute("username");
    if (userId == null && body.containsKey("userId")) {
      userId = (String) body.get("userId");
    }
    if (userId == null) {
      // Nếu không có userId, dùng sessionId làm userId tạm thời
      userId = request.getSession().getId();
    }

    // Lấy context của user
    ChatContextManager.UserChatContext userContext = contextManager.getOrCreateContext(userId);
    
    // Thêm tin nhắn người dùng vào lịch sử
    userContext.addUserMessage(message);

    String prompt = """
            You are SportyBot — an intelligent AI assistant that helps users search for and book sports fields through natural conversation in Vietnamese.
        ## MỤC TIÊU:
        Phân tích và hiểu người dùng đang yêu cầu thông tin gì( tìm kiếm sân, tìm kiếm khung giờ trống,  )
        
        ## LỊCH SỬ CUỘC TRÒ CHUYỆN:
        %s
        
        ## TIN NHẮN MỚI NHẤT:
        %s
        """
        .formatted(formatConversationHistory(userContext), message);

    var aiService = aiServiceFactory.getService(provider);
    String reply = aiService.chat(prompt);

     // Thêm câu trả lời vào lịch sử
    userContext.addSystemMessage(reply);

    return ResponseEntity.ok(Map.of(
        "provider", provider,
        "reply", reply,
           "userId", userId));
  }

  // API phân tích
  // 🔹 Biến toàn cục tạm giữ state
  private static Map<String, Object> lastState = new HashMap<>();

  @PostMapping("/analyze")
  public ResponseEntity<Map<String, Object>> analyze(@RequestBody Map<String, String> req, HttpServletRequest request) {
    String message = req.get("message");
    String provider = req.getOrDefault("provider", "gemini");

    // Lấy userId từ session hoặc request
    String userId = (String) request.getSession().getAttribute("username");
    if (userId == null && req.containsKey("userId")) {
        userId = req.get("userId");
    }
    if (userId == null) {
        // Nếu không có userId, dùng sessionId làm userId tạm thời
        userId = request.getSession().getId();
    }
    
    // Lấy context của user
    ChatContextManager.UserChatContext userContext = contextManager.getOrCreateContext(userId);
    
    // Thêm tin nhắn mới vào context
    userContext.addUserMessage(message);
    
    // Lấy thông tin hiện tại từ context
    String currentAction = userContext.getCurrentAction();
    Map<String, Object> currentParams = userContext.getCurrentParams();
    
    // 🔹 Prompt mô tả nhiệm vụ
    String systemPrompt = """
         Bạn là trợ lý AI của hệ thống đặt sân Sportify.

        🎯 Nhiệm vụ:
        Phân tích tin nhắn người dùng và xác định hành động (action) phù hợp.
        Chỉ trả về **JSON hợp lệ**, không giải thích thêm gì.

        ---

        🔹 DANH SÁCH HÀNH ĐỘNG HỖ TRỢ:

        1️⃣ FILTER_FIELDS – khi người dùng tìm sân theo điều kiện:
        {
          "action": "FILTER_FIELDS",
          "filters": [
            {"field": "price" | "type" | "district" | "time_range" | "limit", "operator": "<" | ">" | "=" | "between" | "min" | "max", "value": any}
          ],
          missing: [ "field_missing_1", "field_missing_2" ] | []
        }
        Mapping ví dụ:
        - tìm sân "gần", "gần nhất" → {"field": "district", "operator": "=", "value": "gần nhất"}
        - "rẻ", "rẻ nhất", "bình dân" → {"field": "price", "operator": "min"}
        - "đắt", "cao nhất", "vip" → {"field": "price", "operator": "max"}
        - "dưới 500k" → {"field": "price", "operator": "<", "value": 500000}
        - "trên 300k" → {"field": "price", "operator": ">", "value": 300000}
        - "từ 200 đến 400" → {"field": "price", "operator": "between", "value": [200000,400000]}
        - "quận 7", "gần Q7" → {"field": "district", "operator": "=", "value": "Quận 7"}
        - "sân 5" → {"field": "type", "operator": "=", "value": "5"}
        - "sáng nay", "ca sáng" → {"field": "time_range", "operator": "=", "value": "06:00-10:00"}
        - "tối nay", "ca tối" → {"field": "time_range", "operator": "=", "value": "18:00-22:00"}
        - "top 10"→ {"field": "limit", "operator": "=", "value": 10}
           - "5 sân rẻ nhất" → [{"field": "limit", "operator": "=", "value": 5}, {"field": "price", "operator": "min"}]
        - "10 sân đắt nhất" → [{"field": "limit", "operator": "=", "value": 10}, {"field": "price", "operator": "max"}]

        2️⃣ CHECK_FIELD_AVAILABILITY – khi người dùng hỏi sân còn trống:
        {
          "action": "CHECK_FIELD_AVAILABILITY",
          "params": {"fieldName": string, "date": "yyyy-MM-dd", "time": "HH:mm" | null, "endTime": "HH:mm" | null},
          "missing": ["param_missing_1", "param_missing_2"] | []
        }

        3️⃣ BOOK_FIELD – khi người dùng muốn đặt sân:
        {
          "action": "BOOK_FIELD",
          "params": {"fieldName": string, "date": "yyyy-MM-dd", "time": "HH:mm"},
          "missing": ["param_missing_1", "param_missing_2"] | []
        }

        ---

        ⚙️ QUY TẮC CHUNG:

        1. **Luôn hỏi thêm nếu thiếu param**, không bao giờ để null.
           - Nếu thiếu param, trả về JSON dạng:
           {
             "action": "<action_dự_kiến>",
             "params": {param1: value , param2: value},
             "missing": ["param_missing_1", "param_missing_2"],
             "question": "Hỏi thông tin param còn thiếu?"
           }
             và hãy luôn nhớ ,  yêu cầu người dùng bổ sung thông tin bị thiếu
             và giữ nguyên action cũ., param cũ
        2. **Khi người dùng trả lời bổ sung**, merge thông tin mới vào JSON trước đó:
           - Nếu tất cả param đầy đủ → trả về JSON hoàn chỉnh, loại bỏ `missing`.
           - Nếu vẫn còn param thiếu → giữ nguyên `action` và cập nhật `missing`.
           - giữ nguyên action cũ, param cũ

        3. **Mapping ngôn ngữ tự nhiên → JSON**:
           - "hôm nay", "tối nay", "sáng nay" → tự động map theo ngày hiện tại.
           - Câu hỏi liên quan giá → filter "price".
           - Câu hỏi gần quận → filter "district".
           - Giới hạn số lượng → thêm filter {"field": "limit", "operator": "=", "value": 10}.
           - Chỉ trả về đúng định dạng JSON, không thêm giải thích.

        4. **Ví dụ luồng stateful**:

        -Người dùng: "Tôi muốn đặt sân tối nay"
        -AI trả về:

        {
          "action": "BOOK_FIELD",
          "params": {
            "fieldName": null,
            "date": "2025-10-13",
            "time": "18:00"
          },
          "missing": ["fieldName"],
          "question": "Bạn muốn đặt sân nào vào tối nay?"
        }


        -Người dùng: "Sân A"
        -AI trả về (merge hoàn chỉnh):

        {
          "action": "BOOK_FIELD",
          "params": {
            "fieldName": "Sân A",
            "date": "2025-10-13",
            "time": "18:00"
          },
          "missing": []
        }

        ---

        💡 Lưu ý:
        - đây chỉ là ví dụ , không lấy thực tế
        - Luôn ưu tiên hỏi thêm nếu thiếu thông tin.
        - Luôn giữ **action cũ** khi bổ sung param.
        - Chỉ trả về JSON, không thêm bất kỳ giải thích nào.
        - Nếu không hiểu → trả về {"action": "UNKNOWN"}.
        """;
    String fullPrompt = systemPrompt;
    
    // Thêm context của user vào prompt - ĐÂY LÀ PHẦN QUAN TRỌNG
    if (currentAction != null) {
        fullPrompt += "\n\nHành động đang thực hiện: " + currentAction;
        try {
            fullPrompt += "\nThông tin đã có: " + new ObjectMapper().writeValueAsString(currentParams);
        } catch (JsonProcessingException e) {
            fullPrompt += "\nThông tin đã có: [Lỗi khi chuyển đổi thông tin]";
        }
    }
    
    // Thêm lịch sử trò chuyện rút gọn
    fullPrompt += "\n\nLịch sử trò chuyện:\n" + formatConversationHistory(userContext);
    fullPrompt += "\nNgười dùng: " + message;

    // Gọi AI
    var aiService = AIServiceFactory.getService(provider);
    String reply = aiService.chat(fullPrompt);

    // Làm sạch markdown
    String raw = reply.trim();
    if (raw.startsWith("```")) {
        int start = raw.indexOf("\n") + 1;
        int end = raw.lastIndexOf("```");
        raw = raw.substring(start, end).trim();
    }
    
    // Parse JSON
    Map<String, Object> aiResponse = new HashMap<>();
    try {
        ObjectMapper mapper = new ObjectMapper();
        aiResponse = mapper.readValue(raw, new TypeReference<Map<String, Object>>() {});
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "AI trả về JSON không hợp lệ",
            "raw_reply", reply));
    }

    // Cập nhật context với thông tin mới
    String action = (String) aiResponse.get("action");
    
    // NẾU LÀ TIN NHẮN TRẢ LỜI CHO TIN NHẮN TRƯỚC
    if (action != null && currentAction != null) {
        // Nếu action mới khác với action cũ và không phải là hành động không rõ
        if (!action.equals(currentAction) && !action.equals("UNKNOWN")) {
            // Xóa thông tin cũ và thiết lập action mới
            userContext.clearParams();
            userContext.setCurrentAction(action);
        } else {
            // Giữ action cũ nếu đang trong luồng hội thoại
            action = currentAction;
            aiResponse.put("action", action);
        }
    } else if (action != null) {
        // Nếu là action mới
        userContext.setCurrentAction(action);
    }
    
    // Cập nhật params từ response mới
    if (aiResponse.containsKey("params")) {
        try {
            Map<String, Object> params = (Map<String, Object>) aiResponse.get("params");
            for (Map.Entry<String, Object> entry : params.entrySet()) {
                if (entry.getValue() != null && !entry.getValue().toString().isEmpty()) {
                    userContext.addParam(entry.getKey(), entry.getValue());
                }
            }
            
            // Cập nhật lại params trong aiResponse với đầy đủ thông tin từ context
            aiResponse.put("params", userContext.getCurrentParams());
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật params: " + e.getMessage());
        }
    }
    
    // Xử lý nếu không còn thông tin thiếu
    List<?> missing = (List<?>) aiResponse.getOrDefault("missing", List.of());
    if (missing.isEmpty() && action != null) {
        // Lấy params hiện tại từ context để đảm bảo đầy đủ
        Map<String, Object> fullParams = userContext.getCurrentParams();
        
        // Đặt lại params đầy đủ vào response
        if (aiResponse.containsKey("params")) {
            aiResponse.put("params", fullParams);
        }
        
        // Xử lý hành động với tham số đầy đủ
        Object result = AIActionHandler.handle(aiResponse);
        
        // Sau khi xử lý xong, reset context action và params
        userContext.clearParams();
        userContext.setCurrentAction(null);
        
        // Thêm vào lịch sử
        userContext.addSystemMessage(result.toString());
        
        return ResponseEntity.ok(Map.of("reply", result));
    }

    // Thêm câu trả lời vào lịch sử
    userContext.addSystemMessage(aiResponse.toString());

    Object handle = AIActionHandler.handle(aiResponse);
    return ResponseEntity.ok(Map.of("reply", handle));
  }


    /**
   * Phương thức để định dạng lịch sử hội thoại từ context người dùng
   * @param context Context chứa lịch sử hội thoại
   * @return Chuỗi định dạng chứa lịch sử hội thoại
   */
  private String formatConversationHistory(ChatContextManager.UserChatContext context) {
    List<Map<String, String>> history = context.getConversationHistory();
    if (history == null || history.isEmpty()) {
      return "Đây là cuộc trò chuyện đầu tiên.";
    }
    
    StringBuilder formatted = new StringBuilder();
    // Giới hạn số lượng tin nhắn để tránh prompt quá dài
    int maxMessages = Math.min(10, history.size());
    int startIndex = Math.max(0, history.size() - maxMessages);
    
    for (int i = startIndex; i < history.size(); i++) {
      Map<String, String> message = history.get(i);
      String role = message.get("role");
      String content = message.get("content");
      
      if ("user".equals(role)) {
        formatted.append("User: ").append(content).append("\n\n");
      } else if ("system".equals(role)) {
        formatted.append("Bot: ").append(content).append("\n\n");
      }
    }
    return formatted.toString();
  }

}
