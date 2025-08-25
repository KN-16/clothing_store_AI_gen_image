import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
} from "@mui/material";
import api from "../../api/api";

// Mô tả style
const styles = {
  cartoon:
    "Cartoon: Avatar phong cách hoạt hình hiện đại, màu sắc tươi sáng, đường nét rõ ràng, phù hợp ảnh profile.",
  chibi:
    "Chibi: Nhân vật đầu to thân nhỏ, cực kỳ dễ thương với màu pastel, mang vibe cute và đáng yêu.",
  anime:
    "Anime: Avatar phong cách manga/anime, màu sắc sống động, mắt to chi tiết, phù hợp fan anime.",
};

export default function AIGenImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [style, setStyle] = useState("cartoon");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleClickPreview = () => {
    if (!preview) fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("style", style);
    try {
      const res = await api.post("/api/generate_image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const blob = await fetch(`data:image/png;base64,${res.data.image}`).then(
        (r) => r.blob()
      );
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Phiên đăng nhập của bạn hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      console.error(err);
      alert("❌ Có lỗi khi sinh ảnh!");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "generated.png";
    link.click();
  };

  return (
    <Box p={4}>
      {/* Header */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 4,
          background: "linear-gradient(to right, #ff6b6b, #5f27cd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🎨 Chào mừng bạn đến với Trình tạo Avatar AI
      </Typography>

      {/* Chọn style */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          👉 Chọn style bạn muốn:
        </Typography>
        <FormControl fullWidth>
          <Select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            {Object.keys(styles).map((k) => (
              <MenuItem key={k} value={k}>
                {k.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {styles[style]}
        </Typography>
      </Box>

      {/* Main content */}
      <Box display="flex" gap={4}>
        {/* Left - Upload */}
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: 380,
            border: !preview ? "2px dashed #aaa" : "none",
            backgroundColor: !preview ? "#fafafa" : "white",
            transition: "0.3s",
            "&:hover": { boxShadow: 6 },
          }}
          onClick={handleClickPreview}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Ảnh gốc
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
            {preview ? (
              <Box mt={2} sx={{ height: 300 }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            ) : (
              <Typography color="text.secondary" mt={4}>
                Kéo & thả ảnh vào đây hoặc nhấn để chọn file
              </Typography>
            )}
          </CardContent>
        </Card>

     <Card
  sx={{
    flex: 1,
    borderRadius: 3,
    boxShadow: 4,
    textAlign: "center",
    height: 380,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: !result ? "2px dashed #aaa" : "none",
    backgroundColor: !result ? "#fafafa" : "white",
    transition: "0.3s",
    "&:hover": { boxShadow: 6 },
  }}
>
  <CardContent sx={{ width: "100%", pt: "20px" }}>
    <Typography variant="h6" gutterBottom>
      Ảnh đã xử lý
    </Typography>

    {result ? (
      <Box mt={2} sx={{ height: 300 }}>
        <img
          src={result}
          alt="result"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </Box>
    ) : loading ? (
      <Box mt={2} sx={{ height: 300 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Đang xử lý...
          </Typography>
        </Box>
      </Box>
    ) : (
      <Typography color="text.secondary" mt={4}>
        Chưa có ảnh kết quả
      </Typography>
    )}
  </CardContent>
</Card>
      </Box>
      {/* Actions */}
      <Box display="flex" justifyContent="center" gap={3} mt={4}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!file || loading}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          {loading ? "Đang xử lý..." : "✨ Sinh ảnh"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleDownload}
          disabled={!result}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "bold",
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          ⬇️ Tải xuống
        </Button>
      </Box>
    </Box>
  );
}
