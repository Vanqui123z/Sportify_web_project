export async function getCartQuantity(): Promise<number> {
  try {
    const res = await fetch("http://localhost:8081/api/user/cart/view", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success && data.cart && Array.isArray(data.cart.items)) {
      return data.cart.items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0
      );
    }
    return 0;
  } catch {
    return 0;
  }
}
