package duan.sportify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import duan.sportify.entities.VoucherOfUser;
import java.time.LocalDate;

public interface VoucherOfUserRepository extends JpaRepository<VoucherOfUser, Long> {
    List<VoucherOfUser> findByUsername(String username);
    List<VoucherOfUser> findByUsernameAndEndDateGreaterThanEqual(String username, LocalDate currentDate);
}
