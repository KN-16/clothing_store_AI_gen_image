# product/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.decorators import action 
from .models import Product, Category, Productstock, Cart, CartItem, Order, OrderItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ProductsPageSerializer, 
    CartSerializer, 
    AddCartItemSerializer, 
    OrderItem,
    OrderSerializer)
import logging
from authentication import permissions
from django.db import transaction
from django.db.models import Prefetch


# Tạo logger
logger = logging.getLogger(__name__)

# Sử dụng logger thay cho print
# logger.info('123')
# Header API

class ProductHeader(APIView):
    def get(self, request):
        category_serializer = CategorySerializer(Category.objects.all(), many=True)
        return Response(category_serializer.data, status=status.HTTP_200_OK)
    
# Home Page API
class ProductHomePageList(APIView):
    def get(self, request):
        titles=[category.title for category in Category.objects.all().distinct('title')]
        data=[]
        for title in titles:
            products=[]
            categores=Category.objects.filter(title=title).prefetch_related(Prefetch('products', queryset=Product.objects.filter(product_home_page=True), to_attr='products_home_page'))
            for category in categores:
                products.extend(category.products_home_page)
            data.append(
                {'title':title,
                'products':[{
                    'id':product.id,
                    'title':product.name,
                    'image':product.images.filter(main_image=True).first().image.url if product.images.filter(main_image=True).exists() else None
                }for product in products]})
        return Response(data=data, status=status.HTTP_200_OK)

# API để lấy chi tiết sản phẩm theo ID
class ProductDetail(APIView):
    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

class ProductsPage(APIView):
    def get(self, request):
        try:
            products = Product.objects.all()
            serializer = ProductsPageSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    def _get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        try:
            cart = self._get_cart(request.user)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=['post'])
    def add(self, request): 
        ser = AddCartItemSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        cart = self._get_cart(request.user)
        ps_id = ser.validated_data['productstock_id']
        qty = ser.validated_data['quantity']
        #Check quantity productstock
        try:
            with transaction.atomic():
                productstock = Productstock.objects.get(id=ps_id)
                if productstock.quantity < qty:
                    return Response({"error": f"Sản phẩm không đủ hàng, chỉ còn {productstock.quantity}",
                                    'data': CartSerializer(cart).data}, status=status.HTTP_400_BAD_REQUEST)

                item, created = CartItem.objects.get_or_create(cart=cart, productstock_id=ps_id, defaults={'quantity': qty})
                if not created:
                    if item.quantity + qty > item.productstock.quantity:
                        return Response({"error": f"Sản phẩm không đủ hàng, chỉ còn {productstock.quantity}",
                                        'data': CartSerializer(cart).data}, status=status.HTTP_400_BAD_REQUEST)
                    item.quantity += qty
                    item.save()
        except Productstock.DoesNotExist:
            return Response({"error": "Không tìm thấy sản phẩm"}, status=status.HTTP_404_NOT_FOUND)

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def merge(self, request):
        cart = self._get_cart(request.user)
        errors = []
        added = []

        for raw_item in request.data.get('items', []):
            single_ser = AddCartItemSerializer(data=raw_item)
            if not single_ser.is_valid():
                errors.append({
                    "productstock_id": raw_item.get("productstock_id"),
                    "errors": single_ser.errors
                })
                continue

            validated = single_ser.validated_data
            ps_id = validated['productstock_id']
            qty = validated['quantity']

            try:
                with transaction.atomic():
                    productstock = Productstock.objects.get(pk=ps_id)
                    if productstock.quantity < qty:
                        raise ValueError(f"Sản phẩm {productstock.product.name} không đủ hàng. Chỉ còn {productstock.quantity} cái.")

                    item, created = CartItem.objects.get_or_create(
                        cart=cart, productstock=productstock, defaults={'quantity': qty}
                    )
                    if not created:
                        if item.quantity + qty > productstock.quantity:
                            raise ValueError(f"Sản phẩm {productstock.id} không đủ hàng để cộng thêm. Chỉ còn {productstock.quantity} cái.")
                        item.quantity += qty
                        item.save()
                    added.append({"productstock_id": ps_id, "name": productstock.product.name,"quantity": qty,"size": productstock.size,"color": productstock.color})

            except Productstock.DoesNotExist:
                errors.append({"productstock_id": ps_id, "error": "Không tìm thấy sản phẩm"})
            except ValueError as ve:
                errors.append({"productstock_id": ps_id, "error": str(ve)})

        return Response({
            "added_productstock_ids": added,
            "errors": errors,
            "data": CartSerializer(cart).data
        })

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        item_id = request.data.get('id')
        cart = self._get_cart(request.user)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error':'Item not found'}, status=404)
        try:
            qty = int(request.data.get('quantity'))
        except (TypeError, ValueError):
            return Response({'error': 'Invalid quantity format'}, status=400)

        if qty <= 0 or qty > item.productstock.quantity:
            return Response({'error': 'Invalid quantity', 'data': CartSerializer(cart).data}, status=400)
        try:
            with transaction.atomic():
                item.quantity = qty
                item.save()
                return Response(CartSerializer(cart).data)
        except Exception as e:
            return Response({'error': str(e), 'data': CartSerializer(cart).data}, status=400)        

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        cart = self._get_cart(request.user)
        item_id = request.GET.get('id')
        if not item_id:
            return Response({'error': 'Item id is required', 'data': CartSerializer(cart).data}, status=400)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found', 'data': CartSerializer(cart).data}, status=404)

        item.delete()
        return Response(CartSerializer(cart).data)

class OrderViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    def list(self, request):
        qs = Order.objects.filter(user=request.user, visible=True).order_by('-created_at')
        data = OrderSerializer(qs, many=True).data
        return Response(data)
    
     # Action để tạo đơn hàng từ giỏ hàng
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        # 1. Nhận danh sách CartItem IDs từ request
        cart_item_ids = request.data.get('item_ids', [])

        # Kiểm tra nếu không có item nào được chỉ định
        if not cart_item_ids:
            return Response({'error': 'Chưa chọn sản phẩm trong giỏ hàng'}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Kiểm tra và lấy giỏ hàng của người dùng
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({'error': 'Giỏ hàng không tồn tại'}, status=status.HTTP_400_BAD_REQUEST)

        errors = []  # Danh sách lỗi
        order = None  # Đặt biến order là None để xác định nếu có lỗi

        # 3. Bắt đầu transaction atomic
        try:
            with transaction.atomic():
                # Tạo đơn hàng mới
                order = Order.objects.create(user=request.user, status='PLACED')

                # 4. Duyệt qua các CartItem ID trong danh sách và thêm vào đơn hàng
                for cart_item_id in cart_item_ids:
                    try:
                        cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)
                        productstock = cart_item.productstock
                        name=productstock.product.name
                        size=productstock.size
                        color=productstock.color
                        quantity = cart_item.quantity

                        # Kiểm tra số lượng sản phẩm
                        if productstock.quantity < quantity:
                            raise ValueError(f"Sản phẩm {productstock.id} không đủ hàng. Chỉ còn {productstock.quantity} cái.")

                        # Tạo OrderItem nếu hợp lệ
                        OrderItem.objects.create(
                            order=order,
                            productstock=productstock,
                            quantity=quantity,
                            price_at_purchase=productstock.price
                        )

                        # Giảm số lượng tồn kho
                        productstock.quantity -= quantity
                        productstock.save()

                        # Xóa CartItem sau khi chuyển sang đơn hàng
                        cart_item.delete()

                    except CartItem.DoesNotExist:
                        # Nếu CartItem không tồn tại trong giỏ hàng
                        errors.append({
                            "cart_item_id": cart_item_id,
                            "error": "CartItem không tồn tại"
                        })
                    except Productstock.DoesNotExist:
                        # Nếu sản phẩm không tồn tại
                        errors.append({
                            "cart_item_id": cart_item_id,
                            "error": "Sản phẩm không tồn tại"
                        })
                    except ValueError as ve:
                        # Nếu số lượng không đủ
                        errors.append({
                            "name":name,
                            "size":size,
                            "color":color,
                            'quantity': quantity,
                            'quantity_in_stock': productstock.quantity,
                            "error": 'Số lượng không đủ',

                        })
                    except Exception as e:
                        # Bắt các lỗi khác
                        errors.append({
                            "name":name,
                            "size":size,
                            "color":color,
                            'quantity': quantity,
                            'quantity_in_stock': productstock.quantity, 
                            "error": str(e)
                        })

                # Kiểm tra nếu không có sản phẩm hợp lệ thì rollback
                if len(errors) > 0:
                    raise ValueError("Không thể tạo đơn hàng, vui lòng kiểm tra danh sách sản phẩm của giỏ hàng")

        except Exception as e:
            # Nếu có bất kỳ lỗi nào xảy ra, transaction sẽ rollback và không tạo đơn hàng
            if order:
                order.delete()  # Nếu đơn hàng đã được tạo, hủy nó
            return Response({
                "errors": errors,
                "data": CartSerializer(cart).data 
            }, status=status.HTTP_400_BAD_REQUEST)

        # 5. Trả về kết quả nếu thành công
        return Response(CartSerializer(cart).data
        , status=status.HTTP_201_CREATED)

    # Action để tạo đơn hàng từ giao diện sản phẩm lẻ
    @action(detail=False, methods=['post'])
    def create_from_product(self, request):
        # 1. Lấy dữ liệu từ request
        productstock_id = request.data.get('productstock_id')
        quantity = request.data.get('quantity')

        order = None  # Biến order sẽ là None nếu có lỗi xảy ra

        # 2. Kiểm tra nếu không có dữ liệu
        if not productstock_id or not quantity:
            return Response({'error': 'Thiếu dữ liệu sản phẩm hoặc số lượng'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 3. Bắt đầu transaction atomic
            with transaction.atomic():
                # 4. Lấy thông tin sản phẩm từ Productstock
                productstock = Productstock.objects.get(id=productstock_id)

                # 5. Kiểm tra số lượng sản phẩm
                if productstock.quantity < quantity:
                    raise ValueError(f"Sản phẩm {productstock.id} không đủ hàng. Chỉ còn {productstock.quantity} cái.")

                # 6. Tạo đơn hàng mới
                order = Order.objects.create(user=request.user, status='PLACED')

                # 7. Tạo OrderItem cho sản phẩm
                OrderItem.objects.create(
                    order=order,
                    productstock=productstock,
                    quantity=quantity,
                    price_at_purchase=productstock.price
                )

                # 8. Giảm số lượng tồn kho
                productstock.quantity -= quantity
                productstock.save()

        except Productstock.DoesNotExist:
            # Nếu sản phẩm không tồn tại
            return Response({
                "error": "Sản phẩm không tìm thấy"
            }, status=status.HTTP_404_NOT_FOUND)
        except ValueError as ve:
            # Nếu số lượng không đủ
            return Response({
                "error": f"Sản phẩm {productstock.product.name} loại bạn chọn không đủ hàng. Chỉ còn {productstock.quantity} cái."
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Bắt các lỗi khác
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        # 11. Trả về kết quả nếu không có lỗi
        return Response({
            'message': 'Đơn hàng đã tạo'
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        try:
            with transaction.atomic():
                # Lấy đối tượng Order theo id (pk)
                order = Order.objects.get(id=pk, user=request.user, visible=True)

                # Đánh dấu đơn hàng là không hiển thị
                order.visible = False
                # Trả lại số lượng các item đặt
                for item in order.items.all():
                    item.productstock.quantity += item.quantity
                    item.productstock.save()
                order.save()
                qs = Order.objects.filter(user=request.user, visible=True).order_by('-created_at')
                data = OrderSerializer(qs, many=True).data
                return Response(data)
            
        except Order.DoesNotExist:
            # Trường hợp không tìm thấy đơn hàng hoặc đơn hàng không hợp lệ
            qs = Order.objects.filter(user=request.user, visible=True).order_by('-created_at')
            data = OrderSerializer(qs, many=True).data
            return Response({'error:': 'Không tìm thấy đơn hàng','data':data},status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            qs = Order.objects.filter(user=request.user, visible=True).order_by('-created_at')
            data = OrderSerializer(qs, many=True).data
            return Response({'error': str(e),'data':data}, status=status.HTTP_400_BAD_REQUEST)
    