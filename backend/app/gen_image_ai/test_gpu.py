# import torch
# print(torch.cuda.get_device_name(0))
# print(torch.cuda.is_available()) 

# pip install torch==2.0.1+cu118 torchvision==0.15.2+cu118 torchaudio==2.0.2+cu118 --index-url https://download.pytorch.org/whl/cu118

# pip install diffusers==0.25.0 transformers==4.30.2
# pip install accelerate safetensors pillow open_clip_torch timm
import torch
print("PyTorch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
print("CUDA version:", torch.version.cuda)
print("Current device:", torch.cuda.current_device())
print("Device name:", torch.cuda.get_device_name(torch.cuda.current_device()))