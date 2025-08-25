import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsByCategory } from "@/api/products";

export default function useProductsPage() {
const sortOptions = [
  { label: "None", value: "" },
  { label: "Giá: Thấp đến Cao", value: "asc" },
  { label: "Giá: Cao đến Thấp", value: "desc" }
];

const [categories, setCategories] = useState([]);
const [subCategoryMap, setSubCategoryMap] = useState({});
useEffect(() => {
  const apiUrl = process.env.REACT_APP_API_URL;
  fetch(`${apiUrl}/api/header/productMenu`)
    .then(response => response.json())
    .then(data => {
      // Set categories
      const uniqueTitles = Array.from(new Set(data.map(item => item.title)));
      const categoriesFromData = ["All", ...uniqueTitles];
      // Set subCategories
      const subCategoryMap_fromData = {
        All: ["None"],
      };

      uniqueTitles.forEach(title => {
        const subNames = data
          .filter(item => item.title === title)
          .map(item => item.name);

        // Loại bỏ trùng lặp và thêm "None"
        const uniqueSubNames = ["None", ...Array.from(new Set(subNames))];

        subCategoryMap_fromData[title] = uniqueSubNames;
      });

      // Cập nhật state
      setCategories(categoriesFromData);
      setSubCategoryMap(subCategoryMap_fromData);
      console.log(subCategoryMap_fromData);
      console.log(categoriesFromData);
    })
    .catch(error => {
      console.error('Error fetching productMenu:', error);
    });
}, []);

    const PRODUCTS_PER_PAGE = 15;
    const [searchParams, setSearchParams] = useSearchParams();

  // State bộ lọc
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [subCategory, setSubCategory] = useState("None");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  // State data & UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Đọc giá trị từ URL khi load trang lần đầu
  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    const type = searchParams.get("type") || "None";
    const sort = searchParams.get("sort") || "";
    const sch = searchParams.get("search") || "";

    setSelectedCategory(cat);
    setSubCategory(type);
    setSortOrder(sort);
    setSearch(sch);
  }, []); // chỉ chạy khi mount

  // 🔹 Hàm cập nhật URL gọn gàng (ẩn filter mặc định)
  const updateURL = (filters) => {
    const params = {};

    if (filters.category && filters.category !== "All") {
      params.category = filters.category;
    }
    if (filters.type && filters.type !== "None") {
      params.type = filters.type;
    }
    if (filters.sort) {
      params.sort = filters.sort;
    }
    if (filters.search) {
      params.search = filters.search;
    }

    setSearchParams(params);
  };
useEffect(() => {
  if (categories.length > 0 && !selectedCategory) {
    setSelectedCategory("All");
  }
}, [categories]);
  // 🔹 Fetch products khi filter thay đổi
  useEffect(() => {
    async function fetchProducts() {
      if (!selectedCategory) return; // <- đợi đến khi category có giá trị
      setLoading(true);

      // Gọi API theo category
      const data = await getProductsByCategory(selectedCategory);
      // Lọc theo search
      let filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );

      // Lọc theo category
      if (selectedCategory !== "All") {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }

      // Lọc theo type
      if (subCategory !== "None") {
        filtered = filtered.filter(item => item.subCategory === subCategory);
      }

      // Sắp xếp
      if (sortOrder === "asc") filtered.sort((a, b) => a.price - b.price);
      if (sortOrder === "desc") filtered.sort((a, b) => b.price - a.price);

      setProducts(filtered);
      setCurrentPage(1);
      setLoading(false);
    }
    
    fetchProducts();

    // Mỗi lần filter thay đổi → update URL
    updateURL({
      category: selectedCategory,
      type: subCategory,
      sort: sortOrder,
      search
    });
  }, [selectedCategory, subCategory, sortOrder, search]);

  // ✅ Gắn minPrice vào mỗi sản phẩm
const productsWithMinPrice = products.map(product => {
  const prices = product.productstocks.map(stock => stock.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return {
    ...product,
    minPrice
  };
});

// ✅ Lọc ra sản phẩm còn hàng (có ít nhất 1 productstock) và tìm sản phẩm có giá thấp nhất
const featured = productsWithMinPrice
  .filter(p => p.minPrice !== null)
  .reduce(
    (min, curr) => (curr.minPrice < min.minPrice ? curr : min),
    { minPrice: Infinity }
  );
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // 🔹 Xử lý thêm vào giỏ
  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "guest";

    if (!token || role === "guest") {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      guestCart.push({ ...product, quantity: 1 });
      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      alert("Added to guest cart.");
    } else {
      console.log("API call: Add to cart", product);
      alert("Added to cart (logged-in user)");
    }
  };
  // Reset filters handler
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSubCategory("None");
    setSortOrder("");
    setSearch("");
  };
  return {
    categories,
    sortOptions,
    selectedCategory,
    setSelectedCategory,
    subCategory,
    setSubCategory,
    sortOrder,
    setSortOrder,
    search,
    setSearch,
    subCategoryMap,
    featured,
    loading,
    paginatedProducts,
    handleAddToCart,
    totalPages,
    currentPage,
    setCurrentPage,
    handleResetFilters,
  };
}