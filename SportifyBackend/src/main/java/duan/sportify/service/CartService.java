package duan.sportify.service;

import duan.sportify.entities.Cart;

public interface CartService {
    Cart getActiveCart(String username);
    Cart addToCart(String username, Integer productId, int quantity);
    Cart viewCart(String username);
    void removeFromCart(String username, Integer productId);
    void removeAllFromCart(String username);
}
