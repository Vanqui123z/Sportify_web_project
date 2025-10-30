package duan.sportify.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import duan.sportify.DTO.booking.FieldManagerDetailDTO;
import duan.sportify.dao.BookingDetailDAO;
import duan.sportify.entities.PermanentBooking;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FieldManagerService {

    private final BookingDetailDAO bookingRepo;
    @Autowired
    private BookingDetailDAO permanentRepo;

    // Helper method to convert java.util.Date to LocalDate
    private LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    // Helper method to convert string date to proper format
    private String formatDateString(String date) {
        // Assuming input is in format "yyyy-MM-dd" or "dd/MM/yyyy"
        if (date.contains("/")) {
            String[] parts = date.split("/");
            if (parts.length == 3) {
                return parts[2] + "-" + (parts[1].length() == 1 ? "0" + parts[1] : parts[1]) + "-" +
                        (parts[0].length() == 1 ? "0" + parts[0] : parts[0]);
            }
        }
        return date; // Return as is if already in correct format
    }

    /**
     * Get all fields that are active on a specific date with their booking counts
     * 
     * @param date Format: yyyy-MM-dd or dd/MM/yyyy
     * @return List of field usage details including all fields (even those with
     *         zero bookings)
     */
    public List<FieldManagerDetailDTO> getActiveFieldsByDate(String date) {
        String formattedDate = formatDateString(date);
        System.out.println("Formatted Date: " + formattedDate);
        List<Object[]> activeFields = bookingRepo.findActiveFieldsByDate(formattedDate);

        List<FieldManagerDetailDTO> result = new ArrayList<>();
        for (Object[] field : activeFields) {
            try {
                Integer fieldId = (Integer) field[0];
                String fieldName = (String) field[1];
                String fieldImage = (String) field[2];
                Long oneTimeBookings = ((Number) field[3]).longValue();
                Long permanentBookings = ((Number) field[4]).longValue();
                Long totalBookings = ((Number) field[5]).longValue();
                if (totalBookings > 0) {
                    result.add(new FieldManagerDetailDTO(fieldId, fieldName, fieldImage, oneTimeBookings, permanentBookings,
                            totalBookings));
                }
            } catch (Exception e) {
                System.out.println("Error processing field: " + Arrays.toString(field));
                e.printStackTrace();
            }
        }
        return result;
    }

    /**
     * Get all fields that are active during a specific month with their booking
     * counts
     * 
     * @param yearMonth Format: yyyy-MM or MM/yyyy
     * @return List of field usage details including all fields (even those with
     *         zero bookings)
     */
    public List<FieldManagerDetailDTO> getActiveFieldsByMonth(String yearMonth) {
        // Convert MM/yyyy to yyyy-MM if needed
        String formattedYearMonth = yearMonth;
        if (yearMonth.contains("/")) {
            String[] parts = yearMonth.split("/");
            if (parts.length == 2) {
                formattedYearMonth = parts[1] + "-" + (parts[0].length() == 1 ? "0" + parts[0] : parts[0]);
            }
        }

        List<Object[]> activeFields = bookingRepo.findActiveFieldsByMonth(formattedYearMonth);

        List<FieldManagerDetailDTO> result = new ArrayList<>();
        for (Object[] field : activeFields) {
            Integer fieldId = (Integer) field[0];
            String fieldName = (String) field[1];
            String fieldImage = (String) field[2];
            Long oneTimeBookings = ((Number) field[3]).longValue();
            Long permanentBookings = ((Number) field[4]).longValue();
            Long totalBookings = ((Number) field[5]).longValue();

            if (totalBookings > 0) {
                result.add(
                    new FieldManagerDetailDTO(fieldId, fieldName, fieldImage, oneTimeBookings, permanentBookings, totalBookings));
                }
        }
        return result;
    }
}
