from product.models import Product, ProductImage

# Lấy một sản phẩm bất kỳ
product = Product.objects.first()

# Thêm ảnh cho sản phẩm (giả sử bạn đã có file ảnh ở 'path/to/image.jpg')
with open('path/to/image.jpg', 'rb') as img_file:
    from django.core.files import File
    image_file = File(img_file)
    product_image = ProductImage.objects.create(
        product=product,
        image=image_file,
        main_image=True  # hoặc False nếu không phải ảnh chính
    )