# product/serializers.py
from rest_framework import serializers
from .models import Product, Productstock, ProductImage, Cart, CartItem, Order, OrderItem,Category, Productstock

# Serializer cho ProductImage
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'color', 'main_image']

# Serializer cho Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['title', 'name']

class ProductStockSerializer(serializers.ModelSerializer):
    product=serializers.SerializerMethodField()
    def get_product(self, obj):
        return {'id': obj.product.id, 'name': obj.product.name,'images':ProductImageSerializer(obj.product.images.all(), many=True).data,'image':ProductImageSerializer(obj.product.images.filter(main_image=True).first()).data}
    class Meta:
        model = Productstock
        fields = ['id','product', 'size', 'quantity', 'color', 'price', 'promotions']

# Serializer cho Product
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True)  # Liên kết nhiều ảnh
    productstocks=ProductStockSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description','material', 'brand', 'category', 'images', 'productstocks']
        
class ProductsPageSerializer(serializers.ModelSerializer):
    category=serializers.SerializerMethodField()
    subCategory=serializers.SerializerMethodField()
    image=serializers.SerializerMethodField()
    productstocks=ProductStockSerializer(many=True)
    images=ProductImageSerializer(many=True)

    def get_category(self, obj):
        return obj.category.title
    def get_subCategory(self, obj):
        return obj.category.name
    def get_image(self, obj):
        image = obj.images.filter(main_image=True).first()
        return image.image.url if image else None

    class Meta:
        model = Product
        fields = ['id', 'name', 'category','subCategory','image','productstocks','images']


class CartItemSerializer(serializers.ModelSerializer):
    productstock = ProductStockSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['id','productstock','quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['id','items','updated_at']

class CartItemValidationSerializer(serializers.Serializer):
    productstock_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    def validate(self, attrs):
        if attrs['productstock_id'] is None or attrs['quantity'] is None:
            raise serializers.ValidationError("Can co productstock_id và quantity")
        
        try:
            product_stock = Productstock.objects.get(id=attrs['productstock_id'])
            if product_stock.quantity < attrs['quantity']:
                raise serializers.ValidationError("So luong san pham khong du")
            
            if product_stock.quantity == 0:
                raise serializers.ValidationError("San pham khong con hang")
            
            attrs['productstock'] = product_stock
        except Productstock.DoesNotExist:
            raise serializers.ValidationError("productstock_id khong ton tai")
        return attrs

class AddCartItemSerializer(serializers.Serializer):
    productstock_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

class MergeCartSerializer(serializers.Serializer):
    items = AddCartItemSerializer(many=True)

class ProductStock_ForOrderSerializer(serializers.ModelSerializer):
    product=serializers.SerializerMethodField()
    
    def get_product(self, obj):
        image=obj.product.images.filter(color=obj.color).first()
        main_image=obj.product.images.filter(main_image=True).first()
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'image': image.image.url if image else main_image.image.url
        }
    
    class Meta:
        model = Productstock
        fields = ['id', 'product', 'size', 'color']

class OrderItemSerializer(serializers.ModelSerializer):
    productstock = ProductStock_ForOrderSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id','productstock','quantity','price_at_purchase']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id','items','created_at','status']