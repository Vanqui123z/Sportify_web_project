package duan.sportify.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import duan.sportify.Repository.PermanentBookingRepository;
import duan.sportify.entities.PermanentBooking;
import duan.sportify.entities.PermanentBookingDetail;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermanentBookingService {

    private final PermanentBookingRepository permanentBookingRepository;

    @Transactional
    public PermanentBooking createBooking(PermanentBooking booking, List<PermanentBookingDetail> details) {
        // Gắn quan hệ 2 chiều
        details.forEach(d -> d.setPermanentBooking(booking));
        booking.getDetails().addAll(details);

        return permanentBookingRepository.save(booking);
    }

    public List<PermanentBooking> getAllBookings() {
        return permanentBookingRepository.findAll();
    }

    public PermanentBooking getBookingById(Integer id) {
        return permanentBookingRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteBooking(Integer id) {
        permanentBookingRepository.deleteById(id);
    }
}
