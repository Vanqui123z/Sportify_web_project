package duan.sportify.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin("*")
@RestController
@RequestMapping("/sportify/rest/ai")
public class AIChatController {

    @Value("${ai.provider:openai}")
    private String aiProvider; // openai | gemini

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String openAiModel;

    @Value("${google.api.key:}")
    private String googleApiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String geminiModel;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        String message = body == null ? null : (String) body.get("message");
        if (message == null || message.trim().isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Missing 'message' in request body");
            return ResponseEntity.badRequest().body(err);
        }

        if ("gemini".equalsIgnoreCase(aiProvider)) {
            return handleGemini(message);
        } else {
            return handleOpenAI(message);
        }
    }

    @SuppressWarnings("unchecked")
    private Object extractFirstMessageContent(Map body) {
        if (body == null) return null;
        Object choicesObj = body.get("choices");
        if (!(choicesObj instanceof List)) return null;
        List choices = (List) choicesObj;
        if (choices.isEmpty()) return null;
        Object first = choices.get(0);
        if (!(first instanceof Map)) return null;
        Map firstMap = (Map) first;
        Object msgObj = firstMap.get("message");
        if (!(msgObj instanceof Map)) return null;
        Map msg = (Map) msgObj;
        return msg.get("content");
    }

    private ResponseEntity<Map<String, Object>> handleOpenAI(String message) {
        String apiKey = openAiApiKey;
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("OPENAI_API_KEY");
        }
        if (apiKey == null || apiKey.isEmpty()) {
            Map<String, Object> ok = new HashMap<>();
            ok.put("reply", "Xin chào! Tính năng AI chưa được cấu hình OPENAI_API_KEY. Hãy thêm khóa API để nhận câu trả lời thông minh. (Cấu hình tạm thời đang bật chế độ trả lời mặc định.)");
            return ResponseEntity.ok(ok);
        }

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("model", openAiModel);
        requestPayload.put("temperature", 0.7);

        Map<String, String> sys = new HashMap<>();
        sys.put("role", "system");
        sys.put("content", "You are a helpful assistant for the Sportify website. Answer briefly and helpfully.");

        Map<String, String> usr = new HashMap<>();
        usr.put("role", "user");
        usr.put("content", message);

        requestPayload.put("messages", List.of(sys, usr));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> res = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                entity,
                Map.class
            );
            Object reply = extractFirstMessageContent(res.getBody());
            Map<String, Object> ok = new HashMap<>();
            ok.put("reply", reply);
            return ResponseEntity.ok(ok);
        } catch (Exception ex) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", ex.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private ResponseEntity<Map<String, Object>> handleGemini(String message) {
        String apiKey = googleApiKey;
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }
        if (apiKey == null || apiKey.isEmpty()) {
            Map<String, Object> ok = new HashMap<>();
            ok.put("reply", "Xin chào! Tính năng AI (Gemini) chưa được cấu hình GEMINI_API_KEY. Hãy thêm khóa API để nhận câu trả lời thông minh. (Cấu hình tạm thời đang bật chế độ trả lời mặc định.)");
            return ResponseEntity.ok(ok);
        }

        Map<String, Object> content = new HashMap<>();
        content.put("role", "user");
        content.put("parts", List.of(Map.of("text", message)));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        String url = String.format(
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
            geminiModel,
            apiKey
        );

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<Map> res = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Object reply = extractGeminiText(res.getBody());
            Map<String, Object> ok = new HashMap<>();
            ok.put("reply", reply);
            return ResponseEntity.ok(ok);
        } catch (Exception ex) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", ex.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }

    @SuppressWarnings({"rawtypes"})
    private Object extractGeminiText(Map body) {
        if (body == null) return null;
        Object candidatesObj = body.get("candidates");
        if (!(candidatesObj instanceof List)) return null;
        List candidates = (List) candidatesObj;
        if (candidates.isEmpty()) return null;
        Object first = candidates.get(0);
        if (!(first instanceof Map)) return null;
        Map firstMap = (Map) first;
        Object contentObj = firstMap.get("content");
        if (!(contentObj instanceof Map)) return null;
        Map content = (Map) contentObj;
        Object partsObj = content.get("parts");
        if (!(partsObj instanceof List)) return null;
        List parts = (List) partsObj;
        if (parts.isEmpty()) return null;
        Object part0 = parts.get(0);
        if (!(part0 instanceof Map)) return null;
        Map p0 = (Map) part0;
        return p0.get("text");
    }
}
