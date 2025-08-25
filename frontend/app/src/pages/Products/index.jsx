// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Grid,
//   CircularProgress,
//   InputLabel,
//   FormControl,
//   Alert
// } from "@mui/material";
// import { getProductsByCategory } from "@/api/products";
// import ProductCard from "@/components/ProductCard";

// const categories = ["All", "Shirt", "Pants", "Shoes", "Accessories"];
// const sortOptions = [
//   { label: "Price: Low to High", value: "asc" },
//   { label: "Price: High to Low", value: "desc" }
// ];

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [sortOrder, setSortOrder] = useState("");

//   useEffect(() => {
//     async function fetchProducts() {
//       setLoading(true);
//       const data = await getProductsByCategory(selectedCategory);
//       let filtered = data.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//       if (sortOrder === "asc") filtered.sort((a, b) => a.price - b.price);
//       if (sortOrder === "desc") filtered.sort((a, b) => b.price - a.price);
//       setProducts(filtered);
//       setLoading(false);
//     }
//     fetchProducts();
//   }, [selectedCategory, search, sortOrder]);

//   const featured = products.length > 0 ? products[0] : null;

//   return (
//     <Box p={4}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🛍 Browse Products
//       </Typography>

//       <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
//         <TextField
//           label="Search Product"
//           variant="outlined"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <FormControl variant="outlined" sx={{ minWidth: 160 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             label="Category"
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>
//                 {cat}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl variant="outlined" sx={{ minWidth: 160 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             label="Sort"
//           >
//             {sortOptions.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {featured && (
//         <Alert severity="warning" sx={{ mb: 3 }}>
//           <strong>Featured:</strong> {featured.name} — only ${featured.price}
//         </Alert>
//       )}

//       {loading ? (
//         <Box textAlign="center" py={6}>
//           <CircularProgress color="primary" />
//         </Box>
//       ) : (
//         <Grid container spacing={3}>
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                 <ProductCard product={product} />
//               </Grid>
//             ))
//           ) : (
//             <Typography color="textSecondary">No products found.</Typography>
//           )}
//         </Grid>
//       )}
//     </Box>
//   );
// }

//Code phase 2

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Grid,
//   CircularProgress,
//   InputLabel,
//   FormControl,
//   Alert,
//   Pagination
// } from "@mui/material";
// import ProductCard from "@/components/ProductCard";
// import { getProductsByCategory } from "@/api/products";

// const categories = ["All", "Shirt", "Pants", "Shoes", "Accessories"];
// const sortOptions = [
//    { label: "None", value: "" },
//   { label: "Price: Low to High", value: "asc" },
//   { label: "Price: High to Low", value: "desc" }
// ];


// export default function ProductsPage() {
//   //Add more subcategories
// const [subCategory, setSubCategory] = useState("None");
// const subCategoryMap = {
//   All: ["None"],
//   Shirt: ["None", "Áo thun", "Áo polo", "Áo sơ mi"],
//   Pants: ["None", "Quần jean", "Quần short", "Quần tây"],
//   Shoes: ["None", "Sneakers", "Sandal", "Boots"],
//   Accessories: ["None", "Mũ", "Túi", "Thắt lưng"]
// };

//   const PRODUCTS_PER_PAGE = 16;

//   const [searchParams, setSearchParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [sortOrder, setSortOrder] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleAddToCart = (product) => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role") || "guest";

//     if (!token || role === "guest") {
//       const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
//       guestCart.push({ ...product, quantity: 1 });
//       localStorage.setItem("guest_cart", JSON.stringify(guestCart));
//       alert("Added to guest cart.");
//     } else {
//       console.log("API call: Add to cart", product);
//       alert("Added to cart (logged-in user)");
//     }
//   };
// useEffect(() => {
//   setSubCategory("None");
// }, [selectedCategory]);
//   useEffect(() => {
//     async function fetchProducts() {
//       setLoading(true);
//       const data = await getProductsByCategory(selectedCategory);

//       let filtered = data.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );

//       // Nếu chọn subCategory khác "None", thì lọc thêm:
//       if (subCategory !== "None") {
//         filtered = filtered.filter(
//           (item) => item.subCategory === subCategory
//         );
//       }
      
//       if (sortOrder === "asc") {
//         filtered.sort((a, b) => a.price - b.price);
//       } else if (sortOrder === "desc") {
//         filtered.sort((a, b) => b.price - a.price);
//       }

//       setProducts(filtered);
//       setCurrentPage(1); // Reset về trang 1 khi filter
//       setLoading(false);
//     }

//     fetchProducts();
//   }, [selectedCategory, search, sortOrder, subCategory]);

//   const featured = [...products].sort((a, b) => a.price - b.price)[0];

//   const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
//   const paginatedProducts = products.slice(
//     (currentPage - 1) * PRODUCTS_PER_PAGE,
//     currentPage * PRODUCTS_PER_PAGE
//   );

//   useEffect(() => {
//   const category = searchParams.get("category") || "All";
//   const type = searchParams.get("type") || "None";
//   const sort = searchParams.get("sort") || "";
//   const search = searchParams.get("search") || "";

//   setSelectedCategory(category);
//   setSubCategory(type);
//   setSortOrder(sort);
//   setSearch(search);
// }, [searchParams]);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (selectedCategory !== "All") params.set("category", selectedCategory);
//     if (subCategory !== "None") params.set("type", subCategory);
//     if (sortOrder) params.set("sort", sortOrder);
//     if (search) params.set("search", search);
//     setSearchParams(params);
//   }, [selectedCategory, subCategory, sortOrder, search, setSearchParams]);

//   const handleCategoryChange = (newCategory) => {
//   setSelectedCategory(newCategory);
//   setSearchParams({
//     category: newCategory,
//     type: subCategory,
//     sort: sortOrder,
//     search: search
//   });
// };
// const handleSearchChange = (value) => {
//   setSearch(value);
//   setSearchParams({
//     category: selectedCategory,
//     type: subCategory,
//     sort: sortOrder,
//     search: value
//   });
// };
//   return (
//     <Box p={4}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🛍 Browse Products
//       </Typography>

//       <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
//         <TextField
//           label="Search Product"
//           variant="outlined"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={selectedCategory}
//             onChange={(e) => handleCategoryChange(e.target.value)}
//             label="Category"
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>
//                 {cat}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl sx={{ minWidth: 160 }}>
//   <InputLabel>Type</InputLabel>
//   <Select
//     value={subCategory}
//     onChange={(e) => setSubCategory(e.target.value)}
//     label="Type"
//   >
//     {subCategoryMap[selectedCategory]?.map((type) => (
//       <MenuItem key={type} value={type}>
//         {type}
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl>

//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             label="Sort"
//           >
//             {sortOptions.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {featured && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           <strong>💸 Most Affordable:</strong> {featured.name} — only ${featured.price}
//         </Alert>
//       )}

//       {loading ? (
//         <Box textAlign="center" py={6}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {paginatedProducts.length > 0 ? (
//               paginatedProducts.map((product) => (
//                 <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                   <ProductCard product={product} onAddToCart={handleAddToCart} />
//                 </Grid>
//               ))
//             ) : (
//               <Typography color="textSecondary">No products found.</Typography>
//             )}
//           </Grid>

//           {totalPages > 1 && (
//             <Box mt={4} display="flex" justifyContent="center">
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={(_, value) => setCurrentPage(value)}
//                 color="primary"
//               />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// }

//Code phase 3
// import {
//   Box, Typography, TextField, Select, MenuItem, Grid,
//   CircularProgress, InputLabel, FormControl, Alert, Pagination
// } from "@mui/material";
// import ProductCard from "@/components/ProductCard";
// import useProductsPage from "./useProductsPage";

// export default function ProductsPage() {
//   const {
//     categories,
//     sortOptions,
//     selectedCategory,
//     setSelectedCategory,
//     subCategory,
//     setSubCategory,
//     sortOrder,
//     setSortOrder,
//     search,
//     setSearch,
//     subCategoryMap,
//     featured,
//     loading,
//     paginatedProducts,
//     handleAddToCart,
//     totalPages,
//     currentPage,
//     setCurrentPage,
//   }=useProductsPage();
//   return (
//     <Box p={4}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🛍 Browse Products
//       </Typography>

//       {/* Bộ lọc */}
//       <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
//         {/* Search */}
//         <TextField
//           label="Search Product"
//           variant="outlined"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {/* Category */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             label="Category"
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Type */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Type</InputLabel>
//           <Select
//             value={subCategory !== "None" ? subCategory : ""}
//             onChange={(e) => setSubCategory(e.target.value)}
//             label="Type"
//           >
//             {subCategoryMap[selectedCategory]?.map((type) => (
//               <MenuItem key={type} value={type}>{type}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Sort */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             label="Sort"
//           >
//             {sortOptions.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Sản phẩm nổi bật */}
//       {featured && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           <strong>💸 Most Affordable:</strong> {featured.name} — only ${featured.price}
//         </Alert>
//       )}

//       {/* Loading */}
//       {loading ? (
//         <Box textAlign="center" py={6}><CircularProgress /></Box>
//       ) : (
//         <>
//           {/* Danh sách sản phẩm */}
//           <Grid container spacing={3}>
//             {paginatedProducts.length > 0 ? (
//               paginatedProducts.map((product) => (
//                 <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
//                   <ProductCard product={product} onAddToCart={handleAddToCart} />
//                 </Grid>
//               ))
//             ) : (
//               <Typography color="textSecondary">No products found.</Typography>
//             )}
//           </Grid>

//           {/* Phân trang */}
//           {totalPages > 1 && (
//             <Box mt={4} display="flex" justifyContent="center">
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={(_, value) => setCurrentPage(value)}
//                 color="primary"
//               />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// }


// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Grid,
//   CircularProgress,
//   InputLabel,
//   FormControl,
//   Alert,
//   Pagination,
//   Button
// } from "@mui/material";

// import ProductCard from "@/components/ProductCard";
// import useProductsPage from "./useProductsPage";

// export default function ProductsPage() {
//   const {
//     categories,
//     sortOptions,
//     selectedCategory,
//     setSelectedCategory,
//     subCategory,
//     setSubCategory,
//     sortOrder,
//     setSortOrder,
//     search,
//     setSearch,
//     subCategoryMap,
//     featured,
//     loading,
//     paginatedProducts,
//     handleAddToCart,
//     totalPages,
//     currentPage,
//     setCurrentPage,
//   } = useProductsPage();

//   // Reset filters handler
//   const handleResetFilters = () => {
//     setSelectedCategory("All");
//     setSubCategory("None");
//     setSortOrder("");
//     setSearch("");
//   };

//   return (
//     <Box className="products-container" p={4}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         🛍 Browse Products
//       </Typography>

//       {/* Bộ lọc */}
//       <Box
//         display="flex"
//         flexDirection={{ xs: "column", sm: "row" }}
//         flexWrap="wrap"
//         gap={2}
//         mb={4}
//         className="products-filters"
//       >
//         {/* Search */}
//         <TextField
//           label="Search Product"
//           variant="outlined"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {/* Category */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             label="Category"
//           >
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>
//                 {cat}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Type */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Type</InputLabel>
//           <Select
//             value={subCategory !== "None" ? subCategory : ""}
//             onChange={(e) => setSubCategory(e.target.value)}
//             label="Type"
//           >
//             {subCategoryMap[selectedCategory]?.map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Sort */}
//         <FormControl sx={{ minWidth: 160 }}>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             label="Sort"
//           >
//             {sortOptions.map((opt) => (
//               <MenuItem key={opt.value} value={opt.value}>
//                 {opt.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Reset Filters */}
//         <Button variant="outlined" onClick={handleResetFilters}>
//           Reset Filters
//         </Button>
//       </Box>

//       {/* Sản phẩm nổi bật */}
//       {featured && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           <strong>💸 Most Affordable:</strong> {featured.name} — chỉ từ{" "}
//           {Number(featured.price).toLocaleString("vi-VN")} VND
//         </Alert>
//       )}

//       {/* Loading */}
//       {loading ? (
//         <Box className="products-loading">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <>
//           {/* Danh sách sản phẩm */}
//           <Grid container spacing={3} className="products-grid">
//             {paginatedProducts.length > 0 ? (
//               paginatedProducts.map((product) => (
//                 <Grid
//                   item
//                   xs={12}
//                   sm={6}
//                   md={4}
//                   lg={3}
//                   key={product.id}
//                   display="flex"
//                 >
//                   <ProductCard
//                     product={product}
//                     onAddToCart={handleAddToCart}
//                   />
//                 </Grid>
//               ))
//             ) : (
//               <Box width="100%" textAlign="center" py={6}>
//                 <Typography color="textSecondary">
//                   Không tìm thấy sản phẩm nào.
//                 </Typography>
//               </Box>
//             )}
//           </Grid>

//           {/* Phân trang */}
//           {totalPages > 1 && (
//             <Box mt={4} display="flex" justifyContent="center">
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={(_, value) => setCurrentPage(value)}
//                 color="primary"
//               />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// }

import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  InputLabel,
  FormControl,
  Alert,
  Pagination,
  Button
} from "@mui/material";

import ProductCard from "@/components/ProductCard";
import useProductsPage from "./useProductsPage";

export default function ProductsPage() {
  const {
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
    handleResetFilters
  } = useProductsPage();

  return (
    
    <Box className="products-container" p={4} sx={{ bgcolor: "#f5f5f7", minHeight: "100vh" }}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" fontWeight="700" mb={4} color="primary.main">
        🛍️ Bộ lọc sản phẩm
      </Typography>

      {/* Phần bộ lọc */}
      <Box
        className="products-filters"
        mb={5}
        p={3}
        sx={{
          bgcolor: "#ffffff",
          borderRadius: 2,
          boxShadow: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        {/* Tìm kiếm */}
        <TextField
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
        />

        {/* Danh mục */}
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory !== "All" ? selectedCategory : ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Danh mục"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat !== "All" ? cat : "Tất cả"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Loại */}
        <FormControl sx={{ minWidth: 160 }} size="small" disabled={selectedCategory === "Tất cả"}>
          <InputLabel>Loại</InputLabel>
          <Select
            value={subCategory !== "None" ? subCategory : ""}
            onChange={(e) => setSubCategory(e.target.value)}
            label="Loại"
          >
            {subCategoryMap[selectedCategory]?.map((type) => (
              <MenuItem key={type} value={type}>
                {type !== "None" ? type : "Tất cả loại"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sắp xếp */}
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sắp xếp"
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label !== "None" ? opt.label : "Mặc định"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nút đặt lại */}
        <Button variant="outlined" color="secondary" onClick={handleResetFilters} sx={{ minWidth: 120 }}>
          Đặt lại bộ lọc
        </Button>
      </Box>

      {/* Phần sản phẩm nổi bật */}
      {featured && (
        <Alert
          severity="info"
          sx={{
            mb: 4,
            fontWeight: 600,
            bgcolor: "#fffbea",
            borderLeft: "5px solid #fbc02d",
            fontSize: "1rem",
          }}
        >
          💸 <strong>Sản phẩm giá tốt nhất:</strong> {featured.name} — chỉ từ{" "}
          {Number(featured.minPrice).toLocaleString("vi-VN")} VND
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box className="products-loading" py={10} textAlign="center">
          <CircularProgress size={48} />
        </Box>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <Box
            className="products-grid"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
            }}
          >
            {paginatedProducts.length > 0 ? (
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} display="flex">
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box width="100%" textAlign="center" py={10}>
                <Typography color="text.secondary" fontSize="1.2rem" fontWeight="medium">
                  Không tìm thấy sản phẩm phù hợp.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Phân trang */}
          {totalPages > 1 && (
            <Box mt={5} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                size="large"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}