package duan.sportify.Repository;
import duan.sportify.entities.PermanentBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermanentBookingRepository extends JpaRepository<PermanentBooking, Integer> {
}
