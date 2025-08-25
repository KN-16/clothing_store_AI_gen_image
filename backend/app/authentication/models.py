# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
    ('customer', 'Customer'),
    ('admin', 'Admin')
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, blank=True, null=False)
    full_name = models.CharField(max_length=255, blank=True, null=False)
    address = models.TextField(blank=True, null=False)