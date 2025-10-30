package duan.sportify.repository;

import duan.sportify.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUsernameOrderByTimestampDesc(String username);
    long countByUserUsernameAndReadFalse(String username);
}