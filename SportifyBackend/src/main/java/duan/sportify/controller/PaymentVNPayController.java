package duan.sportify.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.http.HttpServletRequest;

import org.hibernate.mapping.ForeignKey;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;

import duan.sportify.DTO.PaymentResDTO;
import duan.sportify.config.VNPayConfig;
import duan.sportify.config.appConfig;
import duan.sportify.entities.Bookingdetails;
import duan.sportify.entities.Bookings;
import duan.sportify.entities.Orders;
import duan.sportify.entities.Users;
import duan.sportify.service.BookingDetailService;
import duan.sportify.service.BookingService;
import duan.sportify.service.UserService;
import duan.sportify.service.OrderService;

@Controller
@RequestMapping("/")
public class PaymentVNPayController {
	private RestTemplate restTemplate = new RestTemplate();
	String ipAddress = null; // Ip máy
	String paymentUrl; // Url trả về
	@Autowired
	UserService userservice;
	@Autowired
	BookingService bookingservice;
	@Autowired
	BookingDetailService bookingdetailservice;
	@Autowired
	OrderService ordersService;
	@Autowired
	duan.sportify.service.CartService cartService; // Thêm dòng này

	@Autowired
	appConfig appConfig;

	// Lấy IP người dùng từ Json API trả về
	public void ApiController(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	public static String getIpAddressFromJsonString(String jsonString) {
		try {
			JSONParser parser = new JSONParser();
			JSONObject jsonObject = (JSONObject) parser.parse(jsonString);
			return (String) jsonObject.get("ip");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Lấy IP máy người dùng thông qua API
	@GetMapping("api/sportify/getIp")
	@ResponseBody
	public Map<String, String> getIpAddress() {
		String apiUrl = "https://api.ipify.org?format=json";

		ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
		Map<String, String> result = new HashMap<>();
		if (response.getStatusCode().is2xxSuccessful()) {
			String responseData = response.getBody();
			ipAddress = getIpAddressFromJsonString(responseData);
			result.put("ip", ipAddress);
		} else {
			result.put("error", "Không thể lấy dữ liệu từ API.");
		}
		return result; // ✅ JSON: {"ip": "183.81.18.77"}
	}

	// Các đối tượng cần thiết để trả về trạng thái thanh toán
	Map<String, String> vnp_Params = new HashMap<>();
	String userlogin = null;
	String phone = null;
	Users userOn = null;
	int bookingidNew = 0;
	Bookings savebooking;
	Bookingdetails savebookingdetail;

	Orders saveOrder;

	// Gọi API VNPay cung cấp
	@PostMapping("api/user/getIp/create")
	public ResponseEntity<PaymentResDTO> createPayment(
			@RequestParam("amount") String inputMoney,
			HttpServletRequest request,
			@RequestParam("thanhtien") Double bookingprice,
			@RequestParam("phone") String phone,
			@RequestParam("note") String note,
			@RequestParam("shiftid") int shiftid,
			@RequestParam("fieldid") int fieldid,
			@RequestParam("playdate") String playdateSt,
			@RequestParam("pricefield") Double priceField) throws Throwable {

		Bookings newbooking = new Bookings();
		Bookingdetails newbookingdetail = new Bookingdetails();

		bookingidNew = bookingservice.countBooking();

		userlogin = (String) request.getSession().getAttribute("username");
		Date currentDate = new Date();
		String bookingstatus = "Đã Cọc";
		String pattern = "yyyy-MM-dd"; // Mẫu định dạng của chuỗi ngày tháng
		SimpleDateFormat sdfDate = new SimpleDateFormat(pattern);
		Date playdate = sdfDate.parse(playdateSt);

		newbooking.setUsername(userlogin);
		newbooking.setBookingdate(currentDate);
		newbooking.setBookingprice(bookingprice);
		newbooking.setPhone(phone);
		newbooking.setNote(note);
		newbooking.setBookingstatus(bookingstatus);

		newbookingdetail.setBookingid(bookingidNew + 1);
		newbookingdetail.setShiftid(shiftid);
		newbookingdetail.setPlaydate(playdate);
		newbookingdetail.setFieldid(fieldid);
		newbookingdetail.setPrice(priceField);
		savebooking = newbooking;
		savebookingdetail = newbookingdetail;
		getIpAddress();

		int amount = (int) Double.parseDouble(inputMoney) * 100;

		// Thêm prefix FIELD_ cho mã giao dịch sân
		String vnp_TxnRef = "FIELD_" + VNPayConfig.getRandomNumber(8);

		vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
		vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command);
		vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(amount)); // tiền hóa đơn
		vnp_Params.put("vnp_CurrCode", "VND");
		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
		vnp_Params.put("vnp_Locale", "vn");
		vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_Returnurl); // Đường dẫn trả về trạng thái thanh toán
		vnp_Params.put("vnp_IpAddr", ipAddress); // IP máy người dùng
		vnp_Params.put("vnp_OrderType", "250000");

		Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
		String vnp_CreateDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

		cld.add(Calendar.MINUTE, 15);
		String vnp_ExpireDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

		List<String> fieldNames = new ArrayList<String>(vnp_Params.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();
		Iterator<String> itr = fieldNames.iterator();
		while (itr.hasNext()) {
			String fieldName = (String) itr.next();
			String fieldValue = (String) vnp_Params.get(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				// Build hash data
				hashData.append(fieldName);
				hashData.append('=');
				hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				// Build query
				query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
				query.append('=');
				query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				if (itr.hasNext()) {
					query.append('&');
					hashData.append('&');
				}
			}
		}
		String queryUrl = query.toString();
		String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
		queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
		paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

		PaymentResDTO paymentResDTO = new PaymentResDTO();
		paymentResDTO.setStatus("Ok");
		paymentResDTO.setMessage("Successfully");
		paymentResDTO.setURL(paymentUrl);
		// return ResponseEntity.status(HttpStatus.OK).body(paymentResDTO);
		return ResponseEntity.ok(paymentResDTO);
	}

	// cart
	@PostMapping("api/user/cart/payment")
	public ResponseEntity<PaymentResDTO> createCartPayment(
			@RequestParam("cartid") int cartid,
			@RequestParam("totalPrice") Double totalPrice,
			@RequestParam("phone") String phone,
			HttpServletRequest request
	) throws Throwable {
		// Lấy thông tin user
		String userlogin = (String) request.getSession().getAttribute("username");
		Users user = userservice.findByUsername(userlogin);
		Date currentDate = new Date();

		// Tạo đơn hàng (Orders)
		Orders newOrder = new Orders();
		newOrder.setUsername(userlogin);
		newOrder.setCreatedate(currentDate);
		newOrder.setTotalprice(totalPrice);
		newOrder.setNote("Thanh toán giỏ hàng #" + cartid);
		newOrder.setOrderstatus("Đã Thanh Toán");
		newOrder.setPaymentstatus(false);
		newOrder.setAddress(user != null ? user.getAddress() : "");

		// Lưu đơn hàng vào DB và giữ lại để cập nhật sau khi thanh toán thành công
		saveOrder = ordersService.create(newOrder);
		System.out.println("Username: " + saveOrder.getUsername());
		// Lấy IP
		getIpAddress();

		// Chuẩn bị thông tin thanh toán VNPay
		int amount = (int) (totalPrice * 100);

		// Thêm prefix CART_ cho mã giao dịch giỏ hàng
		String vnp_TxnRef = "CART_" + VNPayConfig.getRandomNumber(8);

		vnp_Params.put("vnp_Version", VNPayConfig.vnp_Version);
		vnp_Params.put("vnp_Command", VNPayConfig.vnp_Command);
		vnp_Params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(amount));
		vnp_Params.put("vnp_CurrCode", "VND");
		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", "Thanh toán giỏ hàng #" + cartid);
		vnp_Params.put("vnp_Locale", "vn");
		vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_Returnurl);
		vnp_Params.put("vnp_IpAddr", ipAddress);
		vnp_Params.put("vnp_OrderType", "billpayment");

		Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
		String vnp_CreateDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

		cld.add(Calendar.MINUTE, 15);
		String vnp_ExpireDate = formatter.format(cld.getTime());
		vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

		List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();
		Iterator<String> itr = fieldNames.iterator();
		while (itr.hasNext()) {
			String fieldName = itr.next();
			String fieldValue = vnp_Params.get(fieldName);
			if (fieldValue != null && fieldValue.length() > 0) {
				hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
					 .append('=')
					 .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
				if (itr.hasNext()) {
					query.append('&');
					hashData.append('&');
				}
			}
		}
		String queryUrl = query.toString();
		String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
		queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
		paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

		PaymentResDTO paymentResDTO = new PaymentResDTO();
		paymentResDTO.setStatus("Ok");
		paymentResDTO.setMessage("Successfully");
		paymentResDTO.setURL(paymentUrl);

		return ResponseEntity.ok(paymentResDTO);
	}

	// Xử lý kết quả thanh toán duy nhất một endpoint
	@GetMapping("api/user/payment/checkoutResult")
	public RedirectView paymentCheckoutResult(HttpServletRequest request) {
		String txnRef = request.getParameter("vnp_TxnRef");
		Map<String, String> fields = new HashMap<>();
		for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
			String fieldName = params.nextElement();
			String fieldValue = request.getParameter(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				fields.put(fieldName, fieldValue);
			}
		}
		String transactionStatus;
		double amountInVND = fields.containsKey("vnp_Amount")
				? Double.parseDouble(fields.get("vnp_Amount")) / 100
				: 0;

		String redirectUrl = appConfig.getFrontendUrl();

		if (txnRef != null && txnRef.startsWith("FIELD_")) {
			// Xử lý đơn sân
			if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
				transactionStatus = "success";
				try {
					if (savebooking != null) {
						bookingservice.create(savebooking);
					}
					if (savebookingdetail != null) {
						bookingdetailservice.create(savebookingdetail);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				transactionStatus = "fail";
			}
			redirectUrl += "/payment-result?field=true&orderId=" + txnRef
					+ "&status=" + transactionStatus
					+ "&amount=" + amountInVND;
		} else if (txnRef != null && txnRef.startsWith("CART_")) {
			// Xử lý giỏ hàng
			if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
				transactionStatus = "success";
				if (saveOrder != null) {
					saveOrder.setOrderstatus("Đã Thanh Toán");
					saveOrder.setPaymentstatus(true);
					ordersService.update(saveOrder);
					String username = saveOrder.getUsername();
					if (username != null && !username.isEmpty()) {
						cartService.removeAllFromCart(username);
					}
				}
			} else {
				transactionStatus = "fail";
			}
			redirectUrl += "/payment-result?cart=true&orderId=" + txnRef
					+ "&status=" + transactionStatus
					+ "&amount=" + amountInVND;
		} else {
			// fallback nếu không xác định được loại đơn
			redirectUrl += "/payment-result?orderId=" + (txnRef != null ? txnRef : "")
					+ "&status=fail"
					+ "&amount=" + amountInVND;
		}
		return new RedirectView(redirectUrl);
	}

}