from django.db import models
from app import settings
#Define values range
COLOR_CHOICES = [
    ('Unknown', 'Unknown'),
    ('white', 'Trắng'),
    ('black', 'Đen'),
    ('gray', 'Xám'),
    ('light_gray', 'Xám nhạt'),
    ('dark_gray', 'Xám đậm'),
    ('blue', 'Xanh dương'),
    ('navy', 'Xanh navy / xanh than'),
    ('sky_blue', 'Xanh da trời'),
    ('dark_blue', 'Xanh đâm'),
    ('green', 'Xanh lá'),
    ('olive', 'Xanh rêu'),
    ('red', 'Đỏ'),
    ('wine', 'Đỏ đô'),
    ('pink', 'Hồng'),
    ('light_pink', 'Hồng phấn'),
    ('purple', 'Tím'),
    ('yellow', 'Vàng'),
    ('beige', 'Be'),
    ('brown', 'Nâu'),
    ('cream', 'Kem'),
    ('orange', 'Cam'),
]
SIZE_CHOICES = [
        ('Unknown', 'Unknown'),
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
        ('3XL', '3XL'),
        *[(str(size), str(size)) for size in range(28, 46)],
    ]

class Category(models.Model):
    title = models.CharField(max_length=255)  # Tiêu đề danh mục
    name = models.CharField(max_length=255)  # Tên danh mục

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)  # Tên sản phẩm
    created_at = models.DateTimeField(auto_now_add=True)  # Thời gian tạo
    updated_at = models.DateTimeField(auto_now=True)  # Thời gian cập nhật
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)  # Danh mục sản phẩm
    product_home_page = models.BooleanField(default=False)
    material = models.CharField(max_length=50, null=True, blank=True)  # Chất liệu sản phẩm
    brand = models.CharField(max_length=100, null=True, blank=True)  # Thương hiệu sản phẩm
    description = models.TextField(null=True, blank=True)  # Mô tả sản phẩm  
    
    def __str__(self):
        return self.name

class Promotion(models.Model):
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)  # Giảm giá theo phần trăm
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField()

    def __str__(self):
        return f"{self.discount_percentage}% off for {self.product or self.category}"

class Productstock(models.Model):
    product = models.ForeignKey(Product, related_name='productstocks', on_delete=models.CASCADE)  # Liên kết với sản phẩm
    size= models.CharField(max_length=10,choices=SIZE_CHOICES,default='Unknown')  # Size san pham
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Giá sản phẩm
    quantity = models.IntegerField(blank=True,default=0)  # Số lượng
    color = models.CharField(max_length=50,choices=COLOR_CHOICES,default='Unknown')  # Màu sắc sản phẩm
    promotions = models.ManyToManyField('Promotion', related_name='products', blank=True)  # Liên kết với các chương trình khuyến mãi
    class Meta:
        unique_together = ('product','size','color')

    def __str__(self):
        return f"{self.product.name} - {self.size}: {self.color}" 

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)  # Liên kết ảnh với sản phẩm
    image = models.ImageField(upload_to='product_images/')  # Lưu trữ ảnh vào thư mục 'product_images/'
    color = models.CharField(max_length=50, null=True, blank=True)
    main_image = models.BooleanField(default=False)  # Đánh dấu ảnh chính

    def __str__(self):
        return f"Image for {self.product.name}"
    
# New feature    
class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    updated_at = models.DateTimeField(auto_now=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    productstock = models.ForeignKey(Productstock, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    class Meta:
        unique_together = ('cart','productstock')

class Order(models.Model):
    STATUS_CHOICES = [('PLACED','Đã đặt'),('APPROVED','Đã duyệt')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLACED')
    visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    productstock = models.ForeignKey(Productstock, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)