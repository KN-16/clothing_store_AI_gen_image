# product/urls.py
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('products/detail/<int:pk>/', views.ProductDetail.as_view(), name='product-detail'),  # GET, PUT, DELETE sản phẩm theo ID
    path('header/productMenu', views.ProductHeader.as_view(), name='product-header'),  # GET header
    path('homePage/products', views.ProductHomePageList.as_view(), name='product-home-page'),
    path('products/', views.ProductsPage.as_view(),name='products-page'),

    path('cart/', views.CartViewSet.as_view({'get':'list'})),
    path('cart/add/', views.CartViewSet.as_view({'post':'add'})),
    path('cart/merge/', views.CartViewSet.as_view({'post':'merge'})),
    path('cart/update-item/', views.CartViewSet.as_view({'patch':'update_item'})),
    path('cart/remove-item/', views.CartViewSet.as_view({'delete':'remove_item'})),
    path('orders/create-from-cart/', views.OrderViewSet.as_view({'post': 'create_from_cart'})),
    path('orders/create-from-product/', views.OrderViewSet.as_view({'post': 'create_from_product'})),
    path('orders/', views.OrderViewSet.as_view({'get':'list'})),
    path('orders/<int:pk>/delete/', views.OrderViewSet.as_view({'delete': 'delete'})),
]
