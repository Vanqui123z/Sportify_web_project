package duan.sportify.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.chrono.ChronoLocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import duan.sportify.dao.OrderDAO;
import duan.sportify.dao.VoucherDAO;
import duan.sportify.entities.Orderdetails;
import duan.sportify.entities.Orders;
import duan.sportify.entities.Products;
import duan.sportify.entities.Voucher;
import duan.sportify.service.OrderDetailService;
import duan.sportify.service.OrderService;
import duan.sportify.service.UserService;
import duan.sportify.service.VoucherService;

@RestController
@RequestMapping("api/user")
public class OrderController {
	@Autowired
	OrderService orderService;
	@Autowired
	OrderDAO orderDAO;
	@Autowired
	VoucherDAO voucherDAO;
	@Autowired
	VoucherService voucherService;
	@Autowired
	OrderDetailService orderDetailService;
	@Autowired
	UserService userService;

	String userlogin = null;

	

	@GetMapping("/order/checkout")
	public ResponseEntity<?> checkOutCart(HttpServletRequest request) {
		String username = (String) request.getSession().getAttribute("username");
		if (username == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("success", false, "message", "User not logged in"));
		}
		return ResponseEntity.ok(Map.of(
				"success", true,
				"user", userService.findById(username)));
	}

	@GetMapping("/order/historyList")
	public ResponseEntity<?> list(HttpServletRequest request) {
		String username = (String) request.getSession().getAttribute("username");
		if (username == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("success", false, "message", "User not logged in"));
		}
		return ResponseEntity.ok(Map.of(
				"success", true,
				"orders", orderService.findByUsername(username)));
	}

	@GetMapping("/order/historyList/detail/{id}")
	public ResponseEntity<?> detail(@PathVariable("id") Integer id) {
		Orderdetails orderdetails = orderDetailService.findById(id);
		if (orderdetails == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "Order not found"));
		}
		return ResponseEntity.ok(Map.of(
				"success", true,
				"order", orderdetails));
	}

	@GetMapping("/order/detail/cancelOrder/{id}")
	public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
		Orders updateOrder = orderService.findById(id);
		if (updateOrder == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "Order not found"));
		}
		updateOrder.setOrderstatus("Hủy Đặt");
		orderDAO.save(updateOrder);
		return ResponseEntity.ok(Map.of("success", true, "message", "Order canceled"));
	}

	// tìm kiếm voucher
	@PostMapping("/order/cart/voucher")
	public ResponseEntity<?> cartVoucher(@RequestParam String voucherId) {
		if (voucherId == null || voucherId.isBlank()) {
			return ResponseEntity.badRequest()
					.body(Map.of("success", false, "message", "voucherId is required"));
		}

		List<Voucher> voucherList = voucherDAO.findByVoucherId(voucherId);
		int discountPercent = 0;
		String voucherMsg;

		LocalDate currentDate = LocalDate.now();

		Optional<Voucher> validVoucher = voucherList.stream()
				.filter(v -> {
					// Chuyển java.util.Date -> LocalDate
					LocalDate startDate = v.getStartdate().toInstant()
							.atZone(ZoneId.systemDefault())
							.toLocalDate();
					LocalDate endDate = v.getEnddate().toInstant()
							.atZone(ZoneId.systemDefault())
							.toLocalDate();
					return (!startDate.isAfter(currentDate) && !endDate.isBefore(currentDate));
				})
				.findFirst();

		if (validVoucher.isPresent()) {
			discountPercent = validVoucher.get().getDiscountpercent();
			voucherMsg = "Đã áp dụng thành công voucher '" + voucherId + "'. Giảm " + discountPercent + "%";
		} else {
			voucherMsg = voucherList.isEmpty() ? "Không tìm thấy voucher '" + voucherId + "'."
					: "Voucher '" + voucherId + "' đã hết hạn sử dụng";
		}

		Map<String, Object> response = new HashMap<>();
		response.put("voucherList", voucherList);
		response.put("discountPercent", discountPercent);
		response.put("voucherMsg", voucherMsg);

		return ResponseEntity.ok(response);
	}

}
