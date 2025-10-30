package duan.sportify.Repository;

import duan.sportify.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUsernameOrderByTimestampDesc(String username);
    long countByUsernameAndReadFalse(String username);

    @Transactional
    @Modifying
    long deleteByUsername(String username);
}