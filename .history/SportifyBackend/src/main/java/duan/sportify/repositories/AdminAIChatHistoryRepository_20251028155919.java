package duan.sportify.repositories;

import duan.sportify.entities.AdminAIChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAIChatHistoryRepository extends JpaRepository<AdminAIChatHistory, Long> {
    List<AdminAIChatHistory> findByAdminIdOrderByCreatedAtAsc(String adminId);
    List<AdminAIChatHistory> findByAdminId(String adminId);
}
