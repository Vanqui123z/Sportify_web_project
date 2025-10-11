package duan.sportify.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
public class PromptManager {

    private final Map<String, String> promptCache = new HashMap<>();

    @PostConstruct
    public void init() {
        loadPrompt("booking", "prompts/booking_prompt.txt");
        loadPrompt("search", "prompts/search_prompt.txt");
        loadPrompt("default", "prompts/AI_prompt.txt");
    }

    private void loadPrompt(String key, String resourcePath) {
        try {
            ClassPathResource resource = new ClassPathResource(resourcePath);
            byte[] bytes = resource.getInputStream().readAllBytes();
            promptCache.put(key, new String(bytes, StandardCharsets.UTF_8));
        } catch (IOException e) {
            System.err.println("⚠️ Không thể load prompt: " + resourcePath + " → " + e.getMessage());
        }
    }

    public String getPrompt(String key) {
        return promptCache.getOrDefault(key, "");
    }
}
