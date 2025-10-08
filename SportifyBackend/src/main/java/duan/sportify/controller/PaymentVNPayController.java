package duan.sportify.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
import duan.sportify.DTO.PermanentPaymentRequest;
import duan.sportify.config.VNPayConfig;
import duan.sportify.config.appConfig;
import duan.sportify.entities.Bookingdetails;
import duan.sportify.entities.Bookings;
import duan.sportify.entities.Orders;
import duan.sportify.entities.PaymentMethod;
import duan.sportify.entities.Users;
import duan.sportify.service.BookingDetailService;
import duan.sportify.service.BookingService;
import duan.sportify.service.UserService;
import duan.sportify.service.VNPayService;
import duan.sportify.service.OrderService;
import duan.sportify.service.PaymentMethodService;

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
	duan.sportify.service.PaymentMethodService paymentMethodService;

	@Autowired
	appConfig appConfig;

	@Autowired
	private BookingService bookingService;

	@Autowired
	private VNPayService vnPayService;

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
	public ResponseEntity<?> createPayment(@RequestBody PermanentPaymentRequest body, HttpServletRequest request)
			throws Exception {
		ipAddress = getIpAddress().get("ip");
		String username = (String) request.getSession().getAttribute("username");
		if (body.getShifts() != null && !body.getShifts().isEmpty()) {
			bookingService.createBookingPermanent(
					username,
					body.getAmount(),
					body.getPhone(),
					body.getNote(),
					body.getShifts(),
					body.getFieldid(),
					body.getPricefield(),
					body.getStartDate(),
					body.getEndDate());

		} else {
			bookingService.createBooking(
					username,
					body.getAmount(),
					body.getPhone(),
					body.getNote(),
					body.getShiftId(),
					body.getFieldid(),
					body.getPlaydate(),
					body.getPricefield());
		}
		System.out.println("ip address: " + ipAddress);
		if (body.getCardId() == null || body.getCardId().isEmpty()) {
			// chuyển sang trang thanh toán
			String paymentUrl = vnPayService.generatePaymentUrl(body.getAmount().toString(), ipAddress);
			return ResponseEntity.ok(new PaymentResDTO("Ok", "Successfully", paymentUrl));
		} else {

			Long cardId = Long.parseLong(body.getCardId());
			String token = paymentMethodService.getPaymentMethod(cardId).getToken();
			System.out.println("body: " + token);
			// chuyển sang trang thanh toán
			String paymentUrl = vnPayService.generatePaymentUrlByToken(body.getAmount().toString(), ipAddress,
					username, token);
			return ResponseEntity.ok(new PaymentResDTO("Ok", "Successfully", paymentUrl));
		}
	}

	// cart
	@PostMapping("api/user/cart/payment")
	public ResponseEntity<PaymentResDTO> createCartPayment(
			@RequestParam("cartid") int cartid,
			@RequestParam("totalPrice") Double totalPrice,
			@RequestParam("phone") String phone,
			HttpServletRequest request) throws Throwable {
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
		vnp_Params.put("vnp_Command", "pay_and_create");
		vnp_Params.put("vnp_store_token", "1");
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
				hashData.append(fieldName).append('=')
						.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
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
		System.out.println("VNPAY RETURN: " + request.getQueryString());
		// user
		String txnRef = request.getParameter("vnp_TxnRef");
		txnRef = txnRef != null ? txnRef : request.getParameter("vnp_txn_ref");
		Map<String, String> fields = new HashMap<>();
		for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
			String fieldName = params.nextElement();
			String fieldValue = request.getParameter(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				fields.put(fieldName, fieldValue);
			}
		}

		String transactionStatus;
		double amountInVND = 0;
		try {
			amountInVND = Double.parseDouble(
					fields.getOrDefault("vnp_Amount", fields.getOrDefault("vnp_amount", "0"))) / 100.0;
		} catch (NumberFormatException e) {
			System.err.println("Invalid vnp_Amount");
		}

		String redirectUrl = appConfig.getFrontendUrl();

		if (txnRef != null && txnRef.startsWith("FIELD_")) {
			// Xử lý đơn sân
			if ("00".equals(request.getParameter("vnp_TransactionStatus"))
					|| "00".equals(request.getParameter("vnp_transaction_status"))) {
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

	@PostMapping("api/user/generate-token")
	public ResponseEntity<?> generateToken(
			HttpServletRequest request,
			@RequestParam String username,
			@RequestParam String cardType,
			@RequestParam String bankCode) {

		String ipAddress = getIpAddress().get("ip");
		try {
			String tokenUrl = vnPayService.generateTokenUrl(ipAddress, username, cardType, bankCode);
			return ResponseEntity.ok(Collections.singletonMap("url", tokenUrl));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating token");
		}
	}

	// xử lí dữ liệu token
	@GetMapping("api/user/token-payment")
	public RedirectView tokenPayment(HttpServletRequest request) {
		String vnp_Token = request.getParameter("vnp_token");
		String vnp_AppUserId = request.getParameter("vnp_app_user_id");
		String vnp_TxnRef = request.getParameter("vnp_txn_ref");
		String vnp_CardNumber = request.getParameter("vnp_card_number");
		String vnp_CardType = request.getParameter("vnp_card_type");
		String vnp_BankCode = request.getParameter("vnp_bank_code");
		String vnp_TransactionStatus = request.getParameter("vnp_transaction_status");
		String vnp_PayDate = request.getParameter("vnp_pay_date");

		PaymentMethod paymentMethod = new PaymentMethod();
		paymentMethod.setToken(vnp_Token);
		paymentMethod.setUsername(vnp_AppUserId);
		paymentMethod.setCardNumber(vnp_CardNumber);
		paymentMethod.setCardType(vnp_CardType);
		paymentMethod.setBankCode(vnp_BankCode);
		paymentMethod.setCreatedAt(
				LocalDate.parse(vnp_PayDate.substring(0, 8), DateTimeFormatter.ofPattern("yyyyMMdd")));

		paymentMethodService.addPaymentMethod(paymentMethod);
		String status = null;
		if (vnp_TransactionStatus.equals("00")) {
			status = "success";

		} else {
			status = "fail";
		}
		String redirectUrl = appConfig.getFrontendUrl() + "/payment-methods?" + "&status=" + status + "&vnp_TxnRef="
				+ vnp_TxnRef + "&vnp_CardType=" + vnp_CardType + "&vnp_BankCode=" + vnp_BankCode + "&vnp_CardNumber="
				+ vnp_CardNumber;
		System.out.println("redirectUrl: " + redirectUrl);
		return new RedirectView(redirectUrl);
	}

}