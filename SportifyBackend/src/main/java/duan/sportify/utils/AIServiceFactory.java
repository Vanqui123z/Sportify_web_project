package duan.sportify.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import duan.sportify.service.AIService;
import duan.sportify.service.impl.GeminiServiceImpl;
import duan.sportify.service.impl.OpenAIServiceImpl;

@Component
public class AIServiceFactory {
    @Autowired
    private OpenAIServiceImpl openAIService;
    @Autowired
    private GeminiServiceImpl geminiService;

    public AIService getService(String provider) {
        if ("gemini".equalsIgnoreCase(provider)) {
            return geminiService;
        }
        return openAIService;
    }
}
