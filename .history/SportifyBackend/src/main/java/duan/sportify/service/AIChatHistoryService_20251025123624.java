package duan.sportify.service;

import duan.sportify.entities.AIChatHistory;
import duan.sportify.repositories.AIChatHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AIChatHistoryService {
    
    @Autowired
    private AIChatHistoryRepository repository;
    
    /**
     * Lưu chat message vào database
     */
    public AIChatHistory saveMessage(String userId, String message, String response, String role, String messageData) {
        AIChatHistory history = new AIChatHistory(userId, message, response, role, messageData);
        return repository.save(history);
    }
    
    /**
     * Lấy toàn bộ lịch sử chat của user
     */
    public List<AIChatHistory> getChatHistory(String userId) {
        return repository.findByUserIdOrderByCreatedAtAsc(userId);
    }
    
    /**
     * Xóa toàn bộ lịch sử chat của user
     */
    public void deleteUserChatHistory(String userId) {
        repository.deleteByUserId(userId);
    }
    
    /**
     * Xóa một message cụ thể
     */
    public void deleteMessage(Long messageId) {
        repository.deleteById(messageId);
    }
    
    /**
     * Cập nhật message
     */
    public AIChatHistory updateMessage(Long messageId, String message, String response) {
        return repository.findById(messageId).map(history -> {
            history.setMessage(message);
            history.setResponse(response);
            history.setUpdatedAt(LocalDateTime.now());
            return repository.save(history);
        }).orElse(null);
    }
}
