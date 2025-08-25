import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import api, { API_URL } from "../../api/api";
import useAuth from "../../hooks/useAuth";
import { getProductsByCategory } from "../../api/products";
import "./CartPage.css";
import useCart from "../../hooks/useCart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loadingItems, setLoadingItems] = useState([]); // lưu item đang loading
  const { user } = useAuth();
  const {items, add, updateQty, remove,placeOrder} =useCart();
  const navigate = useNavigate();
  

  const colorMap = {
    Unknown: "Không xác định",
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

  useEffect(() => {
    const load = async () => {
      if (user) {
       setCart(items);
      }
       else {
        const guest = sessionStorage.getItem("guest_cart");
        const rawCart = guest ? JSON.parse(guest) : [];

        if (rawCart.length > 0) {
          const products = await getProductsByCategory("all");
          const enriched = rawCart.map((item) => {
            const ps = products
              .flatMap((p) =>
                p.productstocks.map((s) => ({
                  ...s,
                  product: p,
                  images: p.images,
                }))
              )
              .find((s) => s.id === item.productstock_id);

            return {
              id: item.productstock_id,
              quantity: item.quantity,
              productstock: ps,
            };
          });
          setCart(enriched.filter(Boolean));
        } else {
          setCart([]);
        }
      }
    };
    load();
  }, [user,navigate,items]);

  const toggleSelectAll = () => {
    if (selected.length === cart.length) setSelected([]);
    else setSelected(cart.map((item) => item.id));
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyQuantity = async (item, newQty, msg_success="Đã cập nhật số lượng sản phẩm",msg_error="Đã xảy ra lỗi khi cập nhật số lượng sản phẩm") => {
    if (newQty <= 0) {
      setConfirmDelete(item);
      return;
    }

    setLoadingItems((prev) => [...prev, item.id]);

    if (user) {
      try {
        // const res = await api.patch("api/shop/cart/update-item/", {
        //   id: item.id,
        //   quantity: newQty,
        // });

        updateQty(item.id,newQty,msg_success,msg_error);

        // setCart(res.data.items);
      } finally {
        setLoadingItems((prev) => prev.filter((x) => x !== item.id));
      }
    } else {
      // const guest = cart.map((x) =>
      //   x.id === item.id ? { ...x, quantity: newQty } : x
      // );
      // setCart(guest);
      // sessionStorage.setItem(
      //   "guest_cart",
      //   JSON.stringify(
      //     guest.map((g) => ({
      //       productstock_id: g.id,
      //       quantity: g.quantity,
      //     }))
      //   )
      // );
      updateQty(item.id,newQty,msg_success,msg_error);
      setLoadingItems((prev) => prev.filter((x) => x !== item.id));
    }
  };

  const updateQuantity = (item, delta,msg_success="Đã cập nhật số lượng sản phẩm",msg_error="Đã xảy ra lỗi khi cập nhật số lượng sản phẩm") => {
    applyQuantity(item, item.quantity + delta,msg_success,msg_error);
  };

  const handleQuantityInput = (item, value,isEnter) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      applyQuantity(item, num,"Đã cập nhật số lượng sản phẩm","Đã xảy ra lỗi khi cập nhật số lượng sản phẩm");
    }
  };

  const removeItem = (id) => {
    setConfirmDelete(null);
    remove(id,"Đã xóa sản phẩm trong giỏ hàng","Đã xảy ra lỗi khi xóa sản phẩm");
    }

  const handlePlaceOrder = () => {
    if (!selected.length) return alert("Chưa chọn sản phẩm nào");
    placeOrder(selected);
    // api
    //   .post("api/shop/orders/create/", { item_ids: selected })
    //   .then(() => {
    //     alert("✅ Đặt hàng thành công!");
    //     setSelected([]);
    //     api.get("api/shop/cart/").then((res) => setCart(res.data.items || []));
    //   });
  };

  const getImage = (item) => {
    if (!item?.productstock?.product) return "";
    const color = item.productstock.color;
    const product = item.productstock.product;
    const images = product.images || [];

    const colorImg = images.find((img) => img.color === color);
    if (colorImg) return colorImg.image;

    const mainImg = images.find((img) => img.main_image);
    if (mainImg) return mainImg.image;

    return product.image || "";
  };

  return (
    <Box className="cart-container">
      <Typography variant="h5" gutterBottom>
        Giỏ hàng của bạn
      </Typography>

      <Table className="cart-table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className="col-checkbox">
              Chọn tất cả
              <Checkbox
                checked={selected.length === cart.length && cart.length > 0}
                indeterminate={
                  selected.length > 0 && selected.length < cart.length
                }
                onChange={toggleSelectAll}
              />
            </TableCell>
            <TableCell align="center">Sản phẩm</TableCell>
            <TableCell align="center">Hình ảnh</TableCell>
            <TableCell align="center">Size</TableCell>
            <TableCell align="center">Màu</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center" className="col-price">
              Giá (VND)
            </TableCell>
            <TableCell align="center" className="col-action"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow
              key={item.id}
              className={clsx("cart-row", {
                selected: selected.includes(item.id),
              })}
              hover
            >
              <TableCell align="center" padding="checkbox">
                <Checkbox
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </TableCell>
              <TableCell>
                <Typography className="product-name">
                  {item.productstock?.product?.name}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <img
                  src={`${API_URL}/${getImage(item)}`}
                  alt={item.productstock?.product?.name}
                  className="product-img"
                />
              </TableCell>
              <TableCell align="center">{item.productstock?.size}</TableCell>
              <TableCell align="center">
                {colorMap[item.productstock?.color] ||
                  item.productstock?.color}
              </TableCell>
              <TableCell align="center" className="quantity-cell">
                <IconButton
                  onClick={() => updateQuantity(item, -1,"Đã bỏ đi 1 sản phẩm thành công","Đã xảy ra lỗi khi bỏ đi 1 sản phẩm")}
                  disabled={loadingItems.includes(item.id)}
                >
                  <Remove />
                </IconButton>

                {loadingItems.includes(item.id) ? (
                  <CircularProgress size={20} />
                ) : (
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      setCart((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                quantity: parseInt(e.target.value) || 0,
                              }
                            : x
                        )
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.target.blur();
                      }
                    }}
                    onBlur={(e) => handleQuantityInput(item, e.target.value,false)}
                    className="quantity-input"
                  />
                )}

                <IconButton
                  onClick={() => updateQuantity(item, 1,"Đã thêm 1 sản phẩm","Đã xảy ra lỗi khi thêm 1 sản phẩm")}
                  disabled={loadingItems.includes(item.id)}
                >
                  <Add />
                </IconButton>
              </TableCell>
              <TableCell align="center" className="price-cell">
                {(item.productstock?.price * item.quantity).toLocaleString()}
              </TableCell>
              <TableCell align="center" className="col-action">
                <IconButton
                  color="error"
                  className="delete-btn"
                  onClick={() => setConfirmDelete(item)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box className="cart-footer">
        <Typography variant="h6" className="total">
          Tổng:{" "}
          {cart
            .filter((x) => selected.includes(x.id))
            .reduce(
              (sum, i) => sum + i.productstock?.price * i.quantity,
              0
            )
            .toLocaleString()}{" "}
          VND
        </Typography>
        <Button
          variant="contained"
          disabled={selected.length === 0}
          onClick={handlePlaceOrder}
        >
          Đặt hàng
        </Button>
      </Box>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Bạn có chắc muốn xoá sản phẩm này?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Huỷ</Button>
          <Button color="error" onClick={() => removeItem(confirmDelete.id)}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


// /* Ẩn spinner Chrome, Safari, Edge */
// input[type=number]::-webkit-inner-spin-button,
// input[type=number]::-webkit-outer-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }

// /* Ẩn spinner Firefox */
// input[type=number] {
//   -moz-appearance: textfield;
//   text-align: center; /* căn giữa giá trị */
// }