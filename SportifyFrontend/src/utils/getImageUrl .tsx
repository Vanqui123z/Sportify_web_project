const  getImageUrl = (image: string | null) => {
  if (!image) return "/user/images/default.png";

  if (image.startsWith("v") || image.includes("/")) {
    // ảnh từ Cloudinary
    return `${import.meta.env.VITE_CLOUDINARY_BASE_URL}/${image}`;
  }

  // ảnh local
  return `/user/images/${image}`;
};

export default getImageUrl;
