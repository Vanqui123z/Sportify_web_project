package duan.sportify.utils.AI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import duan.sportify.service.AIService;
import duan.sportify.service.impl.GeminiServiceImpl;
import duan.sportify.service.impl.OpenAIServiceImpl;
import duan.sportify.service.impl.VertexAIServiceImpl;

@Component
public class AIServiceFactory {
    @Autowired
    private OpenAIServiceImpl openAIService;
    @Autowired
    private GeminiServiceImpl geminiService;
    @Autowired
    private VertexAIServiceImpl vertexAIService;

    public AIService getService(String provider) {
        if ("gemini".equalsIgnoreCase(provider)) {
            return geminiService;
        } else if ("vertex".equalsIgnoreCase(provider) || "vertexai".equalsIgnoreCase(provider)) {
            return vertexAIService;
        }
        return openAIService;
    }
}
