   
package duan.sportify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import duan.sportify.service.CartService;
import duan.sportify.entities.Cart;
import duan.sportify.entities.CartItem;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private duan.sportify.service.UserService userService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(HttpServletRequest request,
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "1") int quantity) {
        String username = (String) request.getSession().getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User not logged in"));
        }

        Cart cart = cartService.addToCart(username, productId, quantity);

        // ép ra JSON gọn
        return ResponseEntity.ok(Map.of(
                "success", true, "cart", cart));
    }

    @GetMapping("/view")
    public ResponseEntity<?> viewCart(HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("username");

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User not logged in"));
        }
        Cart cart = cartService.viewCart(username);
        for (CartItem item : cart.getItems()) {
            item.setProductName(item.getProduct().getProductname());
            item.setImage(item.getProduct().getImage());
        }
        return ResponseEntity.ok(Map.of("success", true, "cart", cart));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(HttpServletRequest request,
                                            @PathVariable Integer productId) {
        String username = (String) request.getSession().getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User not logged in"));
        }
        cartService.removeFromCart(username, productId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product removed from cart"));
    }

    @DeleteMapping("/remove-all")
    public ResponseEntity<?> removeAllFromCart(HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User not logged in"));
        }
        cartService.removeAllFromCart(username);
        return ResponseEntity.ok(Map.of("success", true, "message", "All products removed from cart"));
    }
     @GetMapping("/checkout")
    public ResponseEntity<?> checkoutCart(HttpServletRequest request,
                                         @RequestParam(required = false) String items) {
        String username = (String) request.getSession().getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "User not logged in"));
        }
        // Lấy thông tin user
        duan.sportify.entities.Users profile = userService.findById(username);
        // Lấy giỏ hàng
        Cart cart = cartService.viewCart(username);
        
        // Lọc items nếu có tham số items
        java.util.List<CartItem> filteredItems = new java.util.ArrayList<>();
        if (items != null && !items.trim().isEmpty()) {
            // Parse danh sách item IDs
            String[] itemIds = items.split(",");
            java.util.Set<Integer> itemIdSet = new java.util.HashSet<>();
            for (String id : itemIds) {
                try {
                    itemIdSet.add(Integer.parseInt(id.trim()));
                } catch (NumberFormatException e) {
                    // Bỏ qua ID không hợp lệ
                }
            }
            
            // Lọc các items theo ID
            for (CartItem item : cart.getItems()) {
                if (itemIdSet.contains(item.getCartItemId())) {
                    item.setProductName(item.getProduct().getProductname());
                    item.setImage(item.getProduct().getImage());
                    filteredItems.add(item);
                }
            }
        } else {
            // Nếu không có tham số items, trả về toàn bộ giỏ hàng
            for (CartItem item : cart.getItems()) {
                item.setProductName(item.getProduct().getProductname());
                item.setImage(item.getProduct().getImage());
                filteredItems.add(item);
            }
        }
        
        // Trả về JSON
        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", profile,
            "cartid", cart.getCartid(),
            "items", filteredItems
        ));
    }
}
