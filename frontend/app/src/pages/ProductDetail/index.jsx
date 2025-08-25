import React, { useState ,useEffect, useMemo} from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./productdetail.css";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import  useAuth  from "../../hooks/useAuth";
import api, { API_URL } from "../../api/api";

import  useCart  from "../../hooks/useCart";

export default function ProductDetail() {
    const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { user } = useAuth();
  const { add } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const THUMB_WINDOW = 3;

  useEffect(() => {
    if (!productId) return;
    // Gọi API detail
    fetch(`${API_URL}/api/products/detail/${productId}/`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => 
        {
          alert("Không tìm thấy sản phẩm, quay lại trang chủ");
          // navigate("/");

        }
    );
  }, [productId]);

  // // Gộp Size + Color thành Loại
  // const variants = product.productstocks.map((s) => ({
  //   id: s.id,
  //   label: `Size ${s.size} - Màu ${s.color}`,
  //   size: s.size,
  //   color: s.color,
  //   price: parseFloat(s.price),
  //   quantity: s.quantity,
  //   image:
  //     product.images.find((img) => img.color === s.color)?.image ||
  //     product.images.find((img) => img.main_image)?.image,
  // }));
  

    // Sử dụng useMemo để tính toán variants khi product thay đổi
  const variants = useMemo(() => {
    if (!product) return []; // Nếu chưa có sản phẩm, trả về mảng rỗng

    return product.productstocks.map((s) => ({
      id: s.id,
      label: `Size ${s.size} - Màu ${s.color}`,
      size: s.size,
      color: s.color,
      price: parseFloat(s.price),
      quantity: s.quantity,
      image:
        product.images.find((img) => img.color === s.color)?.image ||
        product.images.find((img) => img.main_image)?.image,
    }));
  }, [product]); // Chỉ tính lại variants khi product thay đổi

  // Gallery logic
  const galleryData = useMemo(() => {
    if (!product || !product.images) return [];
    return product.images.map((img) => img.image);
  }, [product]);

  const displayedIndex =
    hoverIndex !== null
      ? hoverIndex
      : selectedIndex !== null
      ? selectedIndex
      : product.images.findIndex((img) => img.main_image);

  const handlePrev = () => {
    let newIndex =
      selectedIndex === 0 ? galleryData.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    if (newIndex < thumbStart) setThumbStart(Math.max(0, newIndex));
    if (newIndex === galleryData.length - 1)
      setThumbStart(Math.max(0, galleryData.length - THUMB_WINDOW));
  };

  const handleNext = () => {
    let newIndex =
      selectedIndex === galleryData.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    if (newIndex > thumbStart + THUMB_WINDOW - 1)
      setThumbStart(Math.min(galleryData.length - THUMB_WINDOW, newIndex));
    if (newIndex === 0) setThumbStart(0);
  };
  const handleClickVariant = (variant) => {
    if (variant.id === selectedVariant?.id) {
      setSelectedVariant(null);
      setSelectedIndex(null);
      return;
    }
    else {
      setSelectedIndex(product.images.findIndex((img) => img.image === variant.image) );
    }
    setSelectedVariant(variant);
  };
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn loại (Size + Màu).");
      return;
    }
    add(selectedVariant.id, quantity); 
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn loại (Size + Màu).");
      return;
    }

    if (quantity <= 0 )
    {
      alert("Số lượng hàng hóa phải lớn hơn 0");
      return;
    }

    if (!user) {
      alert("⚠️ Bạn cần đăng nhập để đặt hàng");
      return;
    }
    try {
      const { data } = await api.post("api/orders/create-from-product/",{
        productstock_id: selectedVariant.id,
        quantity: quantity
      });
      alert("✅ Đặt hàng thành công");
      //Reset
      setSelectedVariant(null);
    } catch (error) {
      if (error.response?.status === 401) {
    // Nếu refresh token fail, bạn có thể redirect về trang login
    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    navigate("/login"); // Hoặc dùng react-router: navigate('/login')
  }
      const msg = error.response?.data?.error || "Đã xảy ra lỗi khi đặt hàng";
      alert("❌ " + msg);
      setSelectedVariant(null);
    }
  };

  const totalPrice = selectedVariant
    ? (selectedVariant.price * quantity).toLocaleString("vi-VN") + " VND"
    : "0 VND";
  if (!product) return <LoadingScreen message="Đang tải sản phẩm"/>;
  return (
    <Box className="product-detail-container">
      <div className="product-detail-main">
        {/* Gallery Section */}
        <div className="gallery-container">
          <Box className="main-image-box">
            <img
              src={API_URL + "/" + galleryData[displayedIndex]}
              alt=""
              className="main-image"
            />
          </Box>
          <Box className="thumbnail-list">
            <IconButton onClick={handlePrev}>
              <ArrowBackIosNewIcon />
            </IconButton>
            {thumbStart > 0 && <Box className="thumbnail-ellipsis">...</Box>}
            {galleryData
              .slice(thumbStart, thumbStart + THUMB_WINDOW)
              .map((url, idx) => {
                const realIdx = thumbStart + idx;
                return (
                  <Box
                    key={realIdx}
                    onClick={() => setSelectedIndex(realIdx)}
                    onMouseEnter={() => setHoverIndex(realIdx)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className={`thumbnail-item ${
                      displayedIndex === realIdx ? "selected" : ""
                    }`}
                  >
                    <img src={API_URL + "/" + url} alt="" />
                  </Box>
                );
              })}
            {thumbStart + THUMB_WINDOW < galleryData.length && (
              <Box className="thumbnail-ellipsis">...</Box>
            )}
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <Typography className="product-name">{product.name}</Typography>
      
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Loại (Size + Màu):
          </Typography>
          <Box className="color-options" mb={2}>
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={
                  selectedVariant?.id === variant.id
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleClickVariant(variant)}
                onMouseEnter={() => setHoverIndex(product.images.findIndex((img) => img.image === variant.image) )}
                onMouseLeave={() => setHoverIndex(null)}
                className="color-button"
              >
                {variant.label}
              </Button>
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Số lượng:
          </Typography>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
            className="quantity-input"
            sx={{ width: 100, mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Đơn giá:
          </Typography>
          <Typography variant="subtitle1" color={selectedVariant ? "primary" : "red"}>
            {selectedVariant
              ? `${selectedVariant.price.toLocaleString("vi-VN")} VND`
              : "Chọn loại để xem đơn giá"}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Tổng giá trị:
          </Typography>
          <Typography variant="h6" color="primary" mb={2}>
            {totalPrice}
          </Typography>

          <Box
            className="action-buttons"
            sx={{ display: "flex", gap: 16, marginBottom: 6 }}
          >
            <Button
              variant="outlined"
              onClick={handleAddToCart}
              fullWidth
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleBuyNow}
              fullWidth
            >
              Mua ngay
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box className="product-specs">
            <Typography variant="subtitle2">
              <strong>Chất liệu:</strong> {product.material}
            </Typography>
            <Typography variant="subtitle2">
              <strong>Thương hiệu:</strong> {product.brand}
            </Typography>
          </Box>
          <div className="product-description">{product.description}</div>
        </div>
      </div>
    </Box>
  );
}
