package duan.sportify.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import duan.sportify.DTO.booking.FieldManagerDetailDTO;
import duan.sportify.dao.BookingDetailDAO;
import duan.sportify.dao.FieldDAO;
import duan.sportify.entities.Field;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FieldManagerService {
    @Autowired
    private final BookingDetailDAO bookingRepo;
    private BookingDetailDAO permanentRepo;
    @Autowired
    private FieldDAO fieldDAO;

    // private BookingDetailDAO permanentRepo;

    // // Helper method to convert java.util.Date to LocalDate
    // private LocalDate convertToLocalDate(Date dateToConvert) {
    // return dateToConvert.toInstant()
    // .atZone(ZoneId.systemDefault())
    // .toLocalDate();
    // }

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
     * @param date          Format: yyyy-MM-dd or dd/MM/yyyy
     * @param ownerUsername Filter by field owner username (optional)
     * @return List of field usage details including all fields (even those with
     *         zero bookings)
     */
    public List<FieldManagerDetailDTO> getActiveFieldsByDate(String date, String ownerUsername) {
        String formattedDate = formatDateString(date);
        System.out.println("Formatted Date: " + formattedDate);
        List<Object[]> activeFields = bookingRepo.findActiveFieldsByDate(formattedDate);

        // If ownerUsername is provided, get only fields owned by that user
        List<Integer> ownerFieldIds = new ArrayList<>();
        if (ownerUsername != null && !ownerUsername.isEmpty()) {
            List<Field> ownerFields = fieldDAO.findByOwnerUsername(ownerUsername);
            for (Field field : ownerFields) {
                ownerFieldIds.add(field.getFieldid());
            }
        }

        List<FieldManagerDetailDTO> result = new ArrayList<>();
        for (Object[] field : activeFields) {
            try {
                Integer fieldId = (Integer) field[0];

                // Filter by owner if ownerUsername is provided
                if (ownerUsername != null && !ownerUsername.isEmpty() && !ownerFieldIds.contains(fieldId)) {
                    continue;
                }

                String fieldName = (String) field[1];
                String fieldImage = (String) field[2];
                Long oneTimeBookings = ((Number) field[3]).longValue();
                Long permanentBookings = ((Number) field[4]).longValue();
                Long totalBookings = ((Number) field[5]).longValue();
                if (totalBookings > 0) {
                    result.add(new FieldManagerDetailDTO(fieldId, fieldName, fieldImage, oneTimeBookings,
                            permanentBookings,
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
     * @param yearMonth     Format: yyyy-MM or MM/yyyy
     * @param ownerUsername Filter by field owner username (optional)
     * @return List of field usage details including all fields (even those with
     *         zero bookings)
     */
    public List<FieldManagerDetailDTO> getActiveFieldsByMonth(String yearMonth, String ownerUsername) {
        // Convert MM/yyyy to yyyy-MM if needed
        String formattedYearMonth = yearMonth;
        if (yearMonth.contains("/")) {
            String[] parts = yearMonth.split("/");
            if (parts.length == 2) {
                formattedYearMonth = parts[1] + "-" + (parts[0].length() == 1 ? "0" + parts[0] : parts[0]);
            }
        }

        List<Object[]> activeFields = bookingRepo.findActiveFieldsByMonth(formattedYearMonth);

        // If ownerUsername is provided, get only fields owned by that user
        List<Integer> ownerFieldIds = new ArrayList<>();
        if (ownerUsername != null && !ownerUsername.isEmpty()) {
            List<Field> ownerFields = fieldDAO.findByOwnerUsername(ownerUsername);
            for (Field field : ownerFields) {
                ownerFieldIds.add(field.getFieldid());
            }
        }

        List<FieldManagerDetailDTO> result = new ArrayList<>();
        for (Object[] field : activeFields) {
            Integer fieldId = (Integer) field[0];

            // Filter by owner if ownerUsername is provided
            if (ownerUsername != null && !ownerUsername.isEmpty() && !ownerFieldIds.contains(fieldId)) {
                continue;
            }

            String fieldName = (String) field[1];
            String fieldImage = (String) field[2];
            Long oneTimeBookings = ((Number) field[3]).longValue();
            Long permanentBookings = ((Number) field[4]).longValue();
            Long totalBookings = ((Number) field[5]).longValue();

            if (totalBookings > 0) {
                result.add(
                        new FieldManagerDetailDTO(fieldId, fieldName, fieldImage, oneTimeBookings, permanentBookings,
                                totalBookings));
            }
        }
        return result;
    }
}
