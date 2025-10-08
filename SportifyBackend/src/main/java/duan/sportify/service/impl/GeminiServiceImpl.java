package duan.sportify.service.impl;
import duan.sportify.service.AIService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiServiceImpl implements AIService {

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

    @Override
    public String chat(String message) {
        String apiKey = googleApiKey;
        String model = geminiModel;
        if (apiKey == null || apiKey.isEmpty()) {
            return "⚠️ GEMINI_API_KEY chưa được cấu hình.";
        }

        Map<String, Object> payload = Map.of(
            "contents", List.of(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", message))
            ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        RestTemplate restTemplate = new RestTemplate();
        try {
            String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                model, apiKey
            );
            ResponseEntity<Map> res = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(payload, headers), Map.class);
            return extractGeminiText(res.getBody());
        } catch (Exception ex) {
            return "❌ Lỗi gọi Gemini: " + ex.getMessage();
        }
    }

    private String extractGeminiText(Map body) {
        if (body == null) return null;
        var candidates = (List<Map<String, Object>>) body.get("candidates");
        if (candidates == null || candidates.isEmpty()) return null;
        var content = (Map<String, Object>) candidates.get(0).get("content");
        var parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) return null;
        return (String) parts.get(0).get("text");
    }
}
