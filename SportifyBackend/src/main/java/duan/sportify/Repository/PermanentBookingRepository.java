package duan.sportify.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import duan.sportify.entities.PermanentBooking;

@Repository
public interface PermanentBookingRepository extends JpaRepository<PermanentBooking, Integer> {
   // List<> findByShiftidIn(List<Integer> shiftIds);
}
