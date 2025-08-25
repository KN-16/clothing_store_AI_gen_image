# from transformers.models.clip.modeling_clip import CLIPModel
# print("✅ Transformers hoạt động!")
from accelerate import __version__ as accelerate_version
print(f"✅ Accelerate version: {accelerate_version}")
from huggingface_hub import __version__ as huggingface_hub_version
print(f"✅ Hugging Face Hub version: {huggingface_hub_version}")
from diffusers import __version__ as diffusers_version
print(f"✅ Diffusers version: {diffusers_version}")