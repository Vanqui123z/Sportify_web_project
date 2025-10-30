package duan.sportify.rest.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import duan.sportify.DTO.booking.FieldManagerDetailDTO;
import duan.sportify.service.FieldManagerService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/field-usage")
@RequiredArgsConstructor
public class FieldManagerController {
    
    private final FieldManagerService fieldUsageService;
    
    
    @GetMapping("/active-fields/by-date")
    public ResponseEntity<List<FieldManagerDetailDTO>> getActiveFieldsByDate(
            @RequestParam String date) {  // Format: yyyy-MM-dd or dd/MM/yyyy
        return ResponseEntity.ok(fieldUsageService.getActiveFieldsByDate(date));
    }
    
    @GetMapping("/active-fields/by-month")
    public ResponseEntity<List<FieldManagerDetailDTO>> getActiveFieldsByMonth(
            @RequestParam String yearMonth) {  // Format: yyyy-MM or MM/yyyy
        return ResponseEntity.ok(fieldUsageService.getActiveFieldsByMonth(yearMonth));
    }
}
