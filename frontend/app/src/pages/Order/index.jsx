import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import api, { API_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await api.get("api/orders/");
      setOrders(res.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      const msg =
        err?.response?.data?.error ||
        "Đã xảy ra lỗi khi tải danh sách đơn hàng";
      alert("⚠️ " + msg);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const cancelOrder = async (id) => {
    setConfirmDelete(null);
    try {  
      await api.delete(`api/orders/${id}/delete/`);
      alert("✅ Đã xóa đơn hàng");  
      loadOrders();
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      const msg =
        err?.response?.data?.error || "Đã xảy ra lỗi khi xoá đơn hàng";
      alert("⚠️ " + msg);
    }
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN");

  return (
    <Box className="p-4">
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Đơn hàng của bạn
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
    <TableRow>
      <TableCell>Mã đơn</TableCell>
      <TableCell align="center">Ngày đặt</TableCell>
      <TableCell align="center">Tổng tiền (VND)</TableCell>
      <TableCell align="center">Trạng thái</TableCell>
      <TableCell align="center">Thao tác</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {orders.map((order) => (
      <TableRow
        key={order.id}
        hover
        sx={{
          transition: "0.2s",
          "&:hover": { backgroundColor: "#fafafa" },
        }}
      >
        <TableCell>#{order.id}</TableCell>
        <TableCell align="center">{new Date(order.created_at).toLocaleString()}</TableCell>
        <TableCell align="center">
          {formatCurrency(
            order.items.reduce(
              (sum, i) => sum + i.price_at_purchase * i.quantity,
              0
            )
          )}
        </TableCell>
        <TableCell align="center">
          {order.status === "PLACED" ? (
            <Chip label="Đã đặt" color="warning" size="small" />
          ) : (
            <Chip label="Đã duyệt" color="success" size="small" />
          )}
        </TableCell>
        <TableCell align="center">
          <Button
            size="small"
            variant="outlined"
            onClick={() => setDetail(order)}
            sx={{ mr: 1 }}
          >
            Chi tiết
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            disabled={order.status !== "PLACED"}
            onClick={() =>setConfirmDelete(order)} 
          >
            Huỷ
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
      </Paper>

      {/* Chi tiết đơn hàng */}
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Chi tiết đơn hàng #{detail?.id}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {detail && (
            <Table>
             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
  <TableRow>
    <TableCell>Sản phẩm</TableCell>
    <TableCell>Hình ảnh</TableCell>
    <TableCell align="center">Loại</TableCell>
    <TableCell align="right">Đơn giá (VND)</TableCell>
    <TableCell align="center">Số lượng</TableCell>
    <TableCell align="right">Tổng giá trị (VND)</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {detail.items.map((item) => (
    <TableRow key={item.id} hover>
      <TableCell sx={{ maxWidth: 180 }}>
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.productstock.product.name}
        </Typography>
      </TableCell>
      <TableCell>
        <img
          src={API_URL + "/" + item.productstock.product?.image}
          alt={item.productstock.product.name}
          style={{
            width: 60,
            height: 60,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </TableCell>
      <TableCell align="center">
        Size {item.productstock.size} - Màu {item.productstock.color}
      </TableCell>
      <TableCell align="center">
        {formatCurrency(item.price_at_purchase)}
      </TableCell>
      <TableCell align="center">{item.quantity}</TableCell>
      <TableCell align="center">
        {formatCurrency(item.price_at_purchase * item.quantity)}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDetail(null)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Bạn có chắc muốn xoá đơn hàng này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Huỷ</Button>
          <Button color="error" onClick={() =>cancelOrder(confirmDelete.id)}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>  
    </Box>

);
}

