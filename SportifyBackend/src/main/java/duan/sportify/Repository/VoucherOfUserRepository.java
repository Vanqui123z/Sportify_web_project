package duan.sportify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import duan.sportify.entities.VoucherOfUser;

public interface VoucherOfUserRepository extends JpaRepository<VoucherOfUser, Long> {
    List<VoucherOfUser> findByUserName(String userName);
}
