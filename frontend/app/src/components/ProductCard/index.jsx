// import React, { useState } from "react";
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   CardActions,
//   Button,
//   Box,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField
// } from "@mui/material";
// import { Add, Remove } from "@mui/icons-material";
// import useCart from "../../hooks/useCart";

// export default function ProductCard({ product }) {
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const { add, updateQty, remove, items } = useCart();

//   const [openForm, setOpenForm] = useState(false);
//   const [size, setSize] = useState("");
//   const [color, setColor] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const colorMap = {
//   'Unknown': 'Unknown',
//   'white': 'Trắng',
//   'black': 'Đen',
//   'gray': 'Xám',
//   'light_gray': 'Xám nhạt',
//   'dark_gray': 'Xám đậm',
//   'blue': 'Xanh dương',
//   'navy': 'Xanh navy / xanh than',
//   'sky_blue': 'Xanh da trời',
//   'dark_blue': 'Xanh đậm',
//   'green': 'Xanh lá',
//   'olive': 'Xanh rêu',
//   'red': 'Đỏ',
//   'wine': 'Đỏ đô',
//   'pink': 'Hồng',
//   'light_pink': 'Hồng phấn',
//   'purple': 'Tím',
//   'yellow': 'Vàng',
//   'beige': 'Be',
//   'brown': 'Nâu',
//   'cream': 'Kem',
//   'orange': 'Cam',
// };
//   const handleAdd = () => {
//     if (!size || !color) return alert("Vui lòng chọn size và màu!");
//     const stock = product.productstocks.find(ps => ps.size === size && ps.color === color);
//     if (!stock) return alert("Không có lựa chọn này!");
//     add(stock.id, quantity);
//     setOpenForm(false);
//     // Reset form
//     setSize("");
//     setColor("");
//     setQuantity(1);
//   };

//   const handleCardClick = () => {
//     console.log("Clicked on product:", product.name);
//     alert("Clicked on product: " + product.name);
//   };

//   return (
//     <>
//       {/* Product Card */}
//       <Card
//         onClick={handleCardClick}
//         sx={{
//           width: 260,
//           height: 330,
//           display: "flex",
//           flexDirection: "column",
//           borderRadius: 2,
//           boxShadow: 2,
//           overflow: "hidden",
//           transition: "all 0.2s ease-in-out",
//           cursor: "pointer",
//           "&:hover": {
//             boxShadow: 5,
//             transform: "translateY(-3px)"
//           }
//         }}
//       >
//         <CardMedia
//           component="img"
//           image={`${apiUrl}/${product.image}`}
//           alt={product.name}
//           sx={{
//             height: 160,
//             objectFit: "cover",
//             width: "100%"
//           }}
//         />

//         <CardContent sx={{ flexGrow: 0, px: 2, pt: 1, pb: 0 }}>
//           <Typography
//             variant="subtitle1"
//             fontWeight={600}
//             sx={{
//               fontSize: "1rem",
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               minHeight: "3rem"
//             }}
//           >
//             {product.name}
//           </Typography>

//           <Typography variant="body2" color="text.secondary">
//             {Number(product.price).toLocaleString("vi-VN")} VND
//           </Typography>
//         </CardContent>

//         <Box flexGrow={1} /> {/* Push actions to bottom */}

//         <CardActions
//           onClick={e => e.stopPropagation()}
//           sx={{ p: 1, justifyContent: "center" }}
//         >
//           <Button
//             fullWidth
//             variant="outlined"
//             color="primary"
//             size="small"
//             onClick={() => setOpenForm(true)}
//           >
//             Thêm vào giỏ
//           </Button>
//         </CardActions>
//       </Card>

//       {/* Dialog Popup Form */}
//       <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>Thêm sản phẩm vào giỏ</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <FormControl fullWidth>
//             <InputLabel>Size</InputLabel>
//             <Select value={size} onChange={e => setSize(e.target.value)} label="Size">
//               {Array.from(new Set(product.productstocks.map(ps => ps.size))).map(s => (
//                 <MenuItem key={s} value={s}>{s}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//           <InputLabel>Màu</InputLabel>
//           <Select value={color} onChange={e => setColor(e.target.value)} label="Màu">
//             {Array.from(new Set(product.productstocks.map(ps => ps.color))).map(c => (
//               <MenuItem key={c} value={c}>
//                 {colorMap[c] || c}  {/* Nếu không tìm thấy ánh xạ, sẽ hiển thị giá trị gốc */}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//           <TextField
//             type="number"
//             label="Số lượng"
//             value={quantity}
//             onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
//             fullWidth
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenForm(false)} color="inherit">
//             Hủy
//           </Button>
//           <Button onClick={handleAdd} variant="contained">
//             Thêm vào giỏ
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }


import React, { useState, useMemo } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
export default function ProductCard({ product }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { add } = useCart();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const colorMap = {
    Unknown: "Unknown",
    white: "Trắng",
    black: "Đen",
    gray: "Xám",
    light_gray: "Xám nhạt",
    dark_gray: "Xám đậm",
    blue: "Xanh dương",
    navy: "Xanh navy / xanh than",
    sky_blue: "Xanh da trời",
    dark_blue: "Xanh đậm",
    green: "Xanh lá",
    olive: "Xanh rêu",
    red: "Đỏ",
    wine: "Đỏ đô",
    pink: "Hồng",
    light_pink: "Hồng phấn",
    purple: "Tím",
    yellow: "Vàng",
    beige: "Be",
    brown: "Nâu",
    cream: "Kem",
    orange: "Cam",
  };

  // Lọc ra các lựa chọn phù hợp
  const availableSizes = useMemo(() => {
    // if (!color) return [...new Set(product.productstocks.map(ps => ps.size))];
    // return product.productstocks
    //   .filter(ps => ps.color === color)
    //   .map(ps => ps.size);
  return [...new Set(product.productstocks.map(ps => ps.size))]
  }, [color, product.productstocks]);

  const availableColors = useMemo(() => {
    if (!size) return [...new Set(product.productstocks.map(ps => ps.color))];
    return product.productstocks
      .filter(ps => ps.size === size)
      .map(ps => ps.color);
  }, [size, product.productstocks]);

  const selectedStock = product.productstocks.find(
    ps => ps.size === size && ps.color === color
  );

  const price = selectedStock?.price || 0;
  const totalPrice = price * quantity;

  const handleAdd = () => {
    if (!size || !color) return alert("Vui lòng chọn size và màu!");
    if (!selectedStock) return alert("Không có lựa chọn này!");
    if (quantity > selectedStock.quantity) return alert("Số lượng sản phẩm không đủ!, sản phẩm chỉ còn " + selectedStock.quantity);
    add(selectedStock.id, quantity);
    setOpenForm(false);
    setSize("");
    setColor("");
    setQuantity(1);
  };
  const handleCardClick = () => {
    navigate(`/products/detail?id=${product.id}`);
  };
  return (
    <>
       {/* Product Card */}
       <Card
        onClick={handleCardClick}
        sx={{
          width: 260,
          height: 330,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: 2,
          overflow: "hidden",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          "&:hover": {
            boxShadow: 5,
            transform: "translateY(-3px)"
          }
        }}
      >
        <CardMedia
          component="img"
          image={`${apiUrl}/${product.image}`}
          alt={product.name}
          sx={{
            height: 160,
            objectFit: "cover",
            width: "100%"
          }}
        />

        <CardContent sx={{ flexGrow: 0, px: 2, pt: 1, pb: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              fontSize: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "3rem"
            }}
          >
            {product.name}
          </Typography>

          {/* <Typography variant="body2" color="text.secondary">
            {Number(product.price).toLocaleString("vi-VN")} VND
          </Typography> */}
          {product.productstocks.length > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Giá từ {Math.min(...product.productstocks.map(ps => ps.price)).toLocaleString("vi-VN")} VND
            </Typography>
          ) : (
            <Typography variant="body2" color="error">
              Tạm hết hàng
            </Typography>
          )}
        </CardContent>

        <Box flexGrow={1} /> {/* Push actions to bottom */}

        <CardActions
          onClick={e => e.stopPropagation()}
          sx={{ p: 1, justifyContent: "center" }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
            if (product.productstocks.length === 0) {
              alert("Sản phẩm tạm hết hàng!");
              return;
            }
            setOpenForm(true);
              }}
          >
            Thêm vào giỏ
          </Button>
        </CardActions>
      </Card>
      {/* Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Thêm sản phẩm vào giỏ</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Size</InputLabel>
            <Select value={size} onChange={e => setSize(e.target.value)} label="Size">
              {availableSizes.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Màu</InputLabel>
            <Select value={color} onChange={e => setColor(e.target.value)} label="Màu">
              {availableColors.map(c => (
                <MenuItem key={c} value={c}>
                  {colorMap[c] || c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Số lượng"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            fullWidth
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Giá (VND)"
            value={price.toLocaleString("vi-VN")}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Tổng giá trị (VND)"
            value={totalPrice.toLocaleString("vi-VN")}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleAdd} variant="contained">
            Thêm vào giỏ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
