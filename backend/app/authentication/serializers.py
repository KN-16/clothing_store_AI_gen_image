# Create your views here.
from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers

class RegisterSerializer(ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    phoneNumber = serializers.CharField(source='phone_number')
    
    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'email', 'fullName', 'phoneNumber', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        required_fields = ['username', 'email', 'password', 'full_name', 'phone_number', 'address']
        for field in required_fields:
            if not attrs.get(field):
                raise serializers.ValidationError({field: f"{field} is required."})
        return attrs
    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

