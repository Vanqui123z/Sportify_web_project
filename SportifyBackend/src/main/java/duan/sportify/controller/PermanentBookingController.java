package duan.sportify.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import duan.sportify.DTO.PermanentBookingRequest;
import duan.sportify.entities.PermanentBooking;
import duan.sportify.entities.PermanentBookingDetail;
import duan.sportify.service.PermanentBookingService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/permanent-booking")
@RequiredArgsConstructor
public class PermanentBookingController {

    private final PermanentBookingService permanentBookingService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody PermanentBookingRequest request) {
        PermanentBooking booking = PermanentBooking.builder()
                .fieldId(request.getFieldId())
                .username(request.getUsername())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(1)
                .build();

        
        List<PermanentBookingDetail> details = request.getDetails().stream()
                .map(d -> PermanentBookingDetail.builder()
                        .dayOfWeek(d.getDayOfWeek())
                        .shiftId(d.getShiftId())
                        .build())
                .collect(Collectors.toList());

        PermanentBooking saved = permanentBookingService.createBooking(booking, details);

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(permanentBookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        PermanentBooking booking = permanentBookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        permanentBookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}
