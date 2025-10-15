Lấy tất cả đánh giá của một sản phẩm
GET http://localhost:8081/api/reviews/product/{productId}
{"reviews":[{"reviewId":5,"productId":1,"username":"user01","customerName":"user01","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":"2025-10-15T09:30:38","updatedAt":"2025-10-15T09:30:38"},{"reviewId":1,"productId":1,"username":"nhanvien","customerName":"nhanvien","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":null,"updatedAt":"2025-10-15T09:26:04"}],"stats":{"totalReviews":2,"ratingDistribution":{"1":0,"2":0,"3":0,"4":0,"5":2},"reviewsWithComments":2,"averageRating":5.0,"reviewsWithImages":2},"success":true}

Lấy đánh giá có lọc
GET http://localhost:8081/api/reviews/product/{productId}/filtered?filter=all&rating=5
{"reviews":[{"reviewId":5,"productId":1,"username":"user01","customerName":"user01","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":"2025-10-15T09:30:38","updatedAt":"2025-10-15T09:30:38"},{"reviewId":1,"productId":1,"username":"nhanvien","customerName":"nhanvien","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":null,"updatedAt":"2025-10-15T09:26:04"}],"rating":5,"filter":"all","success":true,"stats":{"totalReviews":2,"ratingDistribution":{"1":0,"2":0,"3":0,"4":0,"5":2},"reviewsWithComments":2,"averageRating":5.0,"reviewsWithImages":2}}

Tạo đánh giá mới 
POST http://localhost:8081/api/reviews/product/{productId}
{"message":"Đánh giá đã được lưu thành công!","reviewId":6,"success":true,"review":{"reviewId":6,"productId":2,"username":"user01","customerName":"user01","rating":3,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":"2025-10-15T09:31:04","updatedAt":"2025-10-15T09:36:50.7345372"}}

Cập nhật đánh giá
PUT http://localhost:8081/api/reviews/{reviewId}
{"message":"Đánh giá đã được cập nhật!","success":true,"review":{"reviewId":1,"productId":1,"username":"nhanvien","customerName":"nhanvien","rating":4,"comment":"Đã cập nhật đánh giá!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":null,"updatedAt":"2025-10-15T09:45:38.7959412"}}

Xóa đánh giá (soft delete)
DELETE http://localhost:8081/api/reviews/{reviewId}
{"success":true,"message":"Đánh giá đã được xóa!"}



Lấy đánh giá cụ thể của user cho sản phẩm
GET http://localhost:8081/api/reviews/product/{productId}/user/{username}
{"success":true,"review":{"reviewId":5,"productId":1,"username":"user01","customerName":"user01","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":"2025-10-15T09:30:38","updatedAt":"2025-10-15T09:30:38"},"hasReview":true}


admin 
Xóa đánh giá của user cho sản phẩm cụ thể
DELETE http://localhost:8081/api/reviews/product/{productId}/user/{username}
{"success":true,"message":"Đánh giá đã được xóa thành công!"}

Lấy tất cả đánh giá của một người dùng
GET http://localhost:8081/api/reviews/user/{username}
{"success":true,"reviews":[{"reviewId":5,"productId":1,"username":"user01","customerName":"user01","rating":5,"comment":"Sản phẩm rất tốt!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":null,"sellerReplyAdminUsername":null,"sellerReplyAdminName":null,"sellerReplyDate":null,"status":"active","createdAt":"2025-10-15T09:30:38","updatedAt":"2025-10-15T09:30:38"}]}


Phản hồi của người bán cho đánh giá
POST http://localhost:8081/api/reviews/review/{reviewId}/reply
{"success":true,"message":"Phản hồi đã được gửi thành công!","reply":{"reviewId":1,"productId":1,"username":"nhanvien","customerName":"nhanvien","rating":4,"comment":"Đã cập nhật đánh giá!","images":"[\"https://img.com/1.jpg\",\"https://img.com/2.jpg\"]","sellerReplyContent":"Cảm ơn bạn đã đánh giá!","sellerReplyAdminUsername":"admin1","sellerReplyAdminName":"Admin One","sellerReplyDate":"2025-10-15T09:50:08.783066","status":"active","createdAt":null,"updatedAt":"2025-10-15T09:50:08.7850752"}}