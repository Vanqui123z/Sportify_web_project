package duan.sportify.rest.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import duan.sportify.utils.GoogleCalanderEvent;

@RestController
@RequestMapping("api/forecast")
public class GoogleCalendarController {

    @Autowired
    private GoogleCalanderEvent googleCalanderEvent ;

   

    @GetMapping("/vietnam")
    public String getHolidays() {
        return googleCalanderEvent.getVietnamHolidays();
    }
}
