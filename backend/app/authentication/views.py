# Create your views here.
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def get_queryset(self):
        return get_user_model().objects.all()

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'full_name': request.user.full_name,
            'phone_number': request.user.phone_number,
            'address': request.user.address
        })