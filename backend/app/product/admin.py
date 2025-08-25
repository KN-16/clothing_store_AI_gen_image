from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Product, Promotion, Productstock, ProductImage, Cart,CartItem, Order, OrderItem

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Promotion)
admin.site.register(Productstock)
admin.site.register(ProductImage)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)