const CACHE_DURATION_MS = 4 * 60 * 1000; // 4 phút

export async function getProductsByCategory(category) {
  const cacheKey = `products_${category}`;
  const apiUrl = process.env.REACT_APP_API_URL;

  // 1. Kiểm tra cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, expiry } = JSON.parse(cached);
    const now = Date.now();

    if (now < expiry) {
      return data; // Dữ liệu còn hạn, dùng lại
    } else {
      localStorage.removeItem(cacheKey); // Hết hạn, xoá
    }
  }

  // 2. Gọi API thật
  try {
    const response = await fetch(`${apiUrl}/api/products/`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    // 3. Lưu cache mới với thời hạn
    const expiry = Date.now() + CACHE_DURATION_MS;
    localStorage.setItem(cacheKey, JSON.stringify({ data:data, expiry }));

    return data;
  } catch (error) {
    console.error("API error:", error);
    return []; // fallback nếu có lỗi
  }
}