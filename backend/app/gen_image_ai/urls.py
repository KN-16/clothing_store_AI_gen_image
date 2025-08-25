from django.urls import path
from . import views

urlpatterns = [
    path('generate_image/', views.generate, name='generate_image'),
]
