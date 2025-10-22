package duan.sportify.rest.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import duan.sportify.DTO.booking.FieldManagerDTO;
import duan.sportify.DTO.booking.FieldManagerDetailDTO;
import duan.sportify.service.FieldManagerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/field-usage")
@RequiredArgsConstructor
public class FieldManagerController {
    
    private final FieldManagerService fieldUsageService;
    
    @GetMapping("/by-day")
    public ResponseEntity<List<FieldManagerDTO>> getUsageByDay() {
        return ResponseEntity.ok(fieldUsageService.getUsageByDay());
    }
    
    @GetMapping("/by-month")
    public ResponseEntity<List<FieldManagerDTO>> getUsageByMonth() {
        return ResponseEntity.ok(fieldUsageService.getUsageByMonth());
    }
    
    @GetMapping("/daily-total")
    public ResponseEntity<Long> getTotalUsageByDay() {
        return ResponseEntity.ok(fieldUsageService.getTotalUsageByDay());
    }
    
    @GetMapping("/monthly-total")
    public ResponseEntity<Long> getTotalUsageByMonth() {
        return ResponseEntity.ok(fieldUsageService.getTotalUsageByMonth());
    }
    
    @GetMapping("/detail/by-date")
    public ResponseEntity<List<FieldManagerDetailDTO>> getDetailedUsageByDate(
            @RequestParam String date) {  // Format: yyyy-MM-dd or dd/MM/yyyy
        return ResponseEntity.ok(fieldUsageService.getDetailedUsageByDate(date));
    }
    
    @GetMapping("/detail/by-month")
    public ResponseEntity<List<FieldManagerDetailDTO>> getDetailedUsageByMonth(
            @RequestParam String yearMonth) {  // Format: yyyy-MM or MM/yyyy
        return ResponseEntity.ok(fieldUsageService.getDetailedUsageByMonth(yearMonth));
    }
}
