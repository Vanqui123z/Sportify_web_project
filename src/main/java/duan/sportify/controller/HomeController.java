package duan.sportify.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import duan.sportify.dao.BookingDetailDAO;
import duan.sportify.dao.EventDAO;
import duan.sportify.dao.FieldDAO;
import duan.sportify.dao.ProductDAO;
import duan.sportify.service.FootballPredictionService;
import duan.sportify.service.FootballDataService;



@CrossOrigin(origins = "*")
@Controller
@RequestMapping("sportify")
public class HomeController {
	// Tiêm FieldDAO
	@Autowired 
	FieldDAO fieldDAO;
	@Autowired 
	// Tiêm EventDAO
	EventDAO eventDAO;
	// Tiêm BookingDetailDAO
	@Autowired
	BookingDetailDAO bookingDetailDAO;
	@Autowired
	ProductDAO productDAO;
	@Autowired
	FootballPredictionService footballPredictionService;
	@Autowired
	FootballDataService footballDataService;
	@GetMapping("")
	public String view(Model model,  HttpServletRequest request) {
		List<Object[]> eventList = eventDAO.fillEventInMonth();
		model.addAttribute("eventList", eventList);
		List<Object[]> fieldList = bookingDetailDAO.findTopFieldsWithMostBookings();
		model.addAttribute("fieldList", fieldList);
		List<Object[]> topproduct = productDAO.Top4OrderProduct();
		model.addAttribute("topproduct", topproduct);
		return "user/index";
	}

	@GetMapping("live-football")
	public String liveFootball() {
		return "redirect:https://xoilaczzcz.tv/";
	}

	@GetMapping("football-prediction")
	public String footballPrediction(Model model) {
		try {
			System.out.println("🚀 Loading Football Prediction page...");
			
			// Lấy danh sách trận đấu với AI predictions từ Football-Data.org
			List<Map<String, Object>> upcomingMatches = footballPredictionService.getUpcomingMatches();
			model.addAttribute("upcomingMatches", upcomingMatches);
			
			// Test API connection
			Map<String, String> apiStatus = footballDataService.testApiConnection();
			model.addAttribute("apiStatus", apiStatus);
			
			// Thông tin về API và AI được sử dụng
			model.addAttribute("apiInfo", "Tích hợp Football-Data.org API + AI Prediction Engine");
			
			System.out.println("✅ Successfully loaded " + upcomingMatches.size() + " matches with predictions");
			
		} catch (Exception e) {
			System.err.println("❌ Error in footballPrediction controller: " + e.getMessage());
			e.printStackTrace();
			
			// Fallback data nếu có lỗi
			model.addAttribute("upcomingMatches", new ArrayList<>());
			model.addAttribute("apiInfo", "Đang khắc phục lỗi kết nối API...");
			
			Map<String, String> errorStatus = new HashMap<>();
			errorStatus.put("status", "ERROR");
			errorStatus.put("message", "Lỗi: " + e.getMessage());
			model.addAttribute("apiStatus", errorStatus);
		}
		
		return "user/football-prediction";
	}

	@GetMapping("football-test")
	public String footballTest(Model model) {
		try {
			System.out.println("🧪 Football API Test Mode");
			
			// Test API connection
			Map<String, String> apiStatus = footballDataService.testApiConnection();
			model.addAttribute("apiStatus", apiStatus);
			
			// Get real matches
			List<Map<String, Object>> realMatches = footballDataService.getUpcomingMatches();
			model.addAttribute("realMatches", realMatches);
			
			// Get enhanced matches with AI
			List<Map<String, Object>> aiMatches = footballPredictionService.getUpcomingMatches();
			model.addAttribute("aiMatches", aiMatches);
			
			model.addAttribute("message", "🔥 Football-Data.org API + AI Testing 🔥");
			
		} catch (Exception e) {
			System.err.println("❌ Error in football test: " + e.getMessage());
			model.addAttribute("error", "Error: " + e.getMessage());
		}
		
		return "user/football-test";
	}
	
}
