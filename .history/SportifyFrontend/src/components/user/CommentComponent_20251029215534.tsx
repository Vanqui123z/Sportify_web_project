import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/Comment.css';
import getImageUrl from '../../helper/getImageUrl';

interface Review {
  reviewId: number;
  productId?: number;
  fieldId?: number;
  username: string;
  customerName: string;
  rating: number;
  comment: string;
  images: string;
  sellerReplyContent: string | null;
  sellerReplyAdminUsername: string | null;
  sellerReplyAdminName: string | null;
  sellerReplyDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingStats {
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
  reviewsWithComments: number;
  averageRating: number;
  reviewsWithImages: number;
}

interface CommentProps {
  productId?: number;
  fieldId?: number;
  type: string; // "product" or "field"
}

const Comment = ({ productId, fieldId, type }: CommentProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [hasUserReview, setHasUserReview] = useState<boolean>(false);

  // Review form states
  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewImages, setNewReviewImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const username = localStorage.getItem('username') || undefined;
  console.log('CommentComponent props:', { productId, fieldId, type, username });
  const entityId = type === 'product' ? productId : fieldId;

  // Fetch reviews for the product or field
  useEffect(() => {
    if (entityId) {
      fetchReviews();
      if (username) {
        fetchUserReview();
      }
    }
  }, [entityId, type, username]);

  // Fetch reviews with filters when filter changes
  useEffect(() => {
    if (entityId && (activeFilter || activeRating !== null)) {
      fetchFilteredReviews();
    }
  }, [activeFilter, activeRating, entityId, type]);

  const fetchReviews = async () => {
    if (!entityId) return;
    
    try {
      // Use the proper parameter name based on type
      const idParam = type === 'product' ? `productId=${entityId}` : `fieldId=${entityId}`;
      const response = await axios.get(`http://localhost:8081/api/user/reviews?${idParam}&type=${type}`, { withCredentials: true });
      
      if (response.data.success) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchUserReview = async () => {
    if (!username || !entityId) return;

    try {
      // Use the proper parameter name based on type
      const idParam = type === 'product' ? `productId=${entityId}` : `fieldId=${entityId}`;
      const response = await axios.get(
        `http://localhost:8081/api/user/reviews/user/${username}/entity?${idParam}&type=${type}`, { withCredentials: true }
      );

      if (response.data.success) {
        setHasUserReview(response.data.hasReview);
        if (response.data.hasReview && response.data.review) {
          setUserReview(response.data.review);
          
          // Pre-fill form with existing review data
          setNewReviewRating(response.data.review.rating);
          setNewReviewComment(response.data.review.comment || '');
          
          // Load existing images
          if (response.data.review.images) {
            try {
              const imageUrls = JSON.parse(response.data.review.images);
              if (Array.isArray(imageUrls)) {
                // Just store the URLs for display, don't convert to File objects
                setImagePreviewUrls(imageUrls.map(url => getImageUrl(url)));
              }
            } catch (e) {
              console.error("Error parsing image URLs:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const fetchFilteredReviews = async () => {
    if (!entityId) return;
    
    try {
      let url;
      const idParam = type === 'product' ? `productId=${entityId}` : `fieldId=${entityId}`;
      
      if (activeRating !== null) {
        // Use the rating endpoint
        url = `http://localhost:8081/api/user/reviews/rating/${activeRating}?${idParam}&type=${type}`, { withCredentials: true };
      } else if (activeFilter !== 'all') {
        // Map internal filter names to API filter names
        const apiFilter = activeFilter === 'withComments' ? 'with_comments' : 
                          activeFilter === 'withImages' ? 'with_images' : 'all';
                          
        // Use the filtered endpoint for other filters
        url = `http://localhost:8081/api/user/reviews/filtered?${idParam}&type=${type}&filter=${apiFilter}`, { withCredentials: true };
      } else {
        // Default: get all reviews
        url = `http://localhost:8081/api/user/reviews?${idParam}&type=${type}`;
      }

      const response = await axios.get(url, { withCredentials: true });

      if (response.data.success) {
        setReviews(response.data.reviews);
        // Update stats if available in the response
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else if (Array.isArray(response.data)) {
        // Handle direct array response from rating endpoint
        setReviews(response.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching filtered reviews:", error);
      setReviews([]);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleRatingFilterClick = (rating: number | null) => {
    setActiveRating(rating);
    // Reset the other filter when selecting a rating
    setActiveFilter('all');
  };

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !entityId || !newReviewRating) {
      console.log('Missing username, entityId, or rating', { username, entityId, newReviewRating });

      alert('Vui lòng đánh giá số sao cho sản phẩm');
      return;
    }

    try {
      const formData = new FormData();
      // Add the appropriate ID field based on the type
      if (type === 'product' && productId) {
        formData.append('productId', productId.toString());
      } else if (type === 'field' && fieldId) {
        formData.append('fieldId', fieldId.toString());
      } else {
        alert('Thiếu thông tin ID sản phẩm hoặc sân');
        return;
      }
      
      formData.append('type', type);
      formData.append('customerName', username);
      formData.append('rating', newReviewRating.toString());
      formData.append('comment', newReviewComment);

      // Add images if any
      newReviewImages.forEach(image => {
        formData.append('images', image);
      });

      let response;
      
      // For new reviews
      if (!hasUserReview) {
        response = await axios.post(
          `http://localhost:8081/api/user/reviews/create`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          setUserReview(response.data.review);
          setHasUserReview(true);
          fetchReviews(); // Refresh reviews
          alert('Đánh giá của bạn đã được gửi thành công!');
          resetForm(); // Move after the alert for better user experience
        }
      }
      // For updating existing reviews
      else if (userReview) {
        response = await axios.put(
          `http://localhost:8081/api/user/reviews/${userReview.reviewId}?type=${type}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          setUserReview(response.data.review);
          fetchReviews(); // Refresh reviews
          alert('Đánh giá của bạn đã được cập nhật thành công!');
          resetForm(); // Move after the alert for better user experience
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      // Updated to match API documentation - delete using reviewId and type
      const response = await axios.delete(
        `http://localhost:8081/api/user/reviews/${userReview.reviewId}?type=${type}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserReview(null);
        setHasUserReview(false);
        fetchReviews(); // Refresh reviews
        alert('Đánh giá của bạn đã được xóa thành công!');
        resetForm(); // Ensure form is reset after deletion
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setNewReviewImages(prev => [...prev, ...newFiles]);

    // Create preview URLs
    const newImageUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newImageUrls]);
  };

  const removeImage = (index: number) => {
    setNewReviewImages(prev => prev.filter((_, i) => i !== index));

    // Also remove the preview URL and revoke it to free memory
    const urlToRemove = imagePreviewUrls[index];
    URL.revokeObjectURL(urlToRemove);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    // Reset rating and comment
    setNewReviewRating(0);
    setNewReviewComment('');
    
    // Reset images state
    setNewReviewImages([]);
    
    // Clear image preview URLs and revoke object URLs to prevent memory leaks
    imagePreviewUrls.forEach(url => {
      // Only revoke URLs that are object URLs (not API URLs)
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setImagePreviewUrls([]);
    
    // Reset the file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to parse image URLs from the string format in the API
  const parseImageUrls = (imagesString: string): string[] => {
    try {
      return JSON.parse(imagesString) || [];
    } catch (error) {
      return [];
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="comment-container">
      {/* SECTION 1: RATING SUMMARY */}
      <div className="rating-summary">
        <div className="rating-average">
          <div className="average-score">{stats?.averageRating.toFixed(1) || '0.0'}</div>
          <div className="average-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`star ${stats && star <= Math.round(stats.averageRating) ? 'active' : ''}`}>
                ★
              </span>
            ))}
          </div>
          <div className="total-reviews">{stats?.totalReviews || 0} đánh giá</div>
        </div>

        <div className="rating-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' && activeRating === null ? 'active' : ''}`}
            onClick={() => {
              handleFilterClick('all');
              handleRatingFilterClick(null);
            }}
          >
            Tất cả
          </button>

          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`filter-btn ${activeRating === rating ? 'active' : ''}`}
              onClick={() => {
                handleRatingFilterClick(rating);
                handleFilterClick('all');
              }}
            >
              {rating} Sao ({stats?.ratingDistribution[rating] || 0})
            </button>
          ))}

          <button
            className={`filter-btn ${activeFilter === 'withComments' ? 'active' : ''}`}
            onClick={() => {
              handleFilterClick('withComments');
              handleRatingFilterClick(null);
            }}
          >
            Có Bình luận ({stats?.reviewsWithComments || 0})
          </button>

          <button
            className={`filter-btn ${activeFilter === 'withImages' ? 'active' : ''}`}
            onClick={() => {
              handleFilterClick('withImages');
              handleRatingFilterClick(null);
            }}
          >
            Có Hình ảnh ({stats?.reviewsWithImages || 0})
          </button>
        </div>
      </div>

      {/* SECTION 3: REVIEW FORM (if user is logged in and hasn't reviewed yet) */}
      {username && (
        <div className="review-form-container">
          <h3>{hasUserReview ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá'}</h3>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-selector">
              <p>Đánh giá của bạn:</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= newReviewRating ? 'active' : ''}`}
                    onClick={() => setNewReviewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-textarea">
              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                rows={4}
              ></textarea>
            </div>

            <div className="image-upload">
              <div className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                <i className="upload-icon">📷</i>
                <span>Thêm ảnh</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {imagePreviewUrls.length > 0 && (
                <div className="image-previews">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={url} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-review-btn">
                {hasUserReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
              </button>

              {hasUserReview && (
                <button
                  type="button"
                  className="delete-review-btn"
                  onClick={handleDeleteReview}
                >
                  Xóa đánh giá
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: REVIEWS LIST */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            {activeFilter !== 'all' || activeRating !== null ? 
              `Không tìm thấy đánh giá nào ${activeRating ? `với ${activeRating} sao` : ''} ${activeFilter !== 'all' ? (activeFilter === 'withComments' ? 'có bình luận' : 'có hình ảnh') : ''}` 
              : 'Chưa có đánh giá nào cho sản phẩm này'}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">
                  <div className="avatar-placeholder">👤</div>
                </div>

                <div className="reviewer-info">
                  <div className="reviewer-name">{review.customerName}</div>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= review.rating ? 'active' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="review-date">{formatDate(review.createdAt || review.updatedAt)}</div>
                </div>
              </div>

              <div className="review-content">
                <div className="review-comment">{review.comment}</div>

                {review.images && (
                  <div className="review-images">
                    {parseImageUrls(review.images).map((imageUrl, index) => (
                      <div key={index} className="review-image">
                        <img src={getImageUrl(imageUrl)} alt={`Review image ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {review.sellerReplyContent && (
                <div className="seller-reply">
                  <div className="seller-reply-header">
                    <strong>Phản hồi của Shop:</strong>
                    {review.sellerReplyAdminName && <span> {review.sellerReplyAdminName}</span>}
                    {review.sellerReplyDate && <span className="reply-date"> - {formatDate(review.sellerReplyDate)}</span>}
                  </div>
                  <div className="seller-reply-content">{review.sellerReplyContent}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
