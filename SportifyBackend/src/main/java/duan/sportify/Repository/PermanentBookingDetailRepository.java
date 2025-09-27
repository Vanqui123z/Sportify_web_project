package duan.sportify.Repository;
import duan.sportify.entities.PermanentBookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PermanentBookingDetailRepository extends JpaRepository<PermanentBookingDetail, Integer> {
}