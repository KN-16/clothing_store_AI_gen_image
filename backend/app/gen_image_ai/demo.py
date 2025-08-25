def clean_memory():
    # Xoá các biến mô hình lớn nếu có
    globals_to_delete = ["pipe", "controlnet", "vae", "unet", "tokenizer", "text_encoder"]
    for var in globals_to_delete:
        if var in globals():
            del globals()[var]

    # Dọn bộ nhớ Python và GPU
    gc.collect()

    if torch.cuda.is_available():
        torch.cuda.empty_cache()     # Dọn cache VRAM không dùng
        torch.cuda.ipc_collect()     # Dọn các handle IPC (cho đa tiến trình)
        torch.cuda.synchronize()     # Đồng bộ lại để đảm bảo mọi thứ ổn
    print("✅ Đã dọn bộ nhớ GPU và Python")

import cv2
import torch
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler,DEISMultistepScheduler
from diffusers.utils import load_image
import numpy as np
import gc

# clean_memory()  # Dọn bộ nhớ trước khi bắt đầu

# ====== CẤU HÌNH ======
MODEL_ID = "./models/dreamshaper-7"
CONTROLNET_ID = "./models/sd-controlnet-canny"

#Style
#Style 1
PROMPT ="masterpiece, best quality, 2D illustration, full body, cartoon style, modern avatar design, vibrant flat colors, clean bold outlines, simple shapes, soft shading, large expressive eyes, big smile, smooth skin, stylized hair, casual outfit, standing, front view, centered composition, neutral background, friendly expression, professional digital art"
NEG_PROMPT = "lowres, bad anatomy, blurry, extra limbs, missing fingers, distorted proportions, realistic textures, photorealistic, complex background, harsh shadows, text, watermark, signature, cropped, ugly, old style cartoon, 3D render"

# Style 2
PROMPT = "adorable chibi character, oversized head with tiny body, soft rounded line art, pastel pinks and blues, oversized sparkling eyes, cozy and cute clothing, simple minimal backdrop, gentle shadow under character, heartwarming expression, bubblegum pop color scheme"
NEG_PROMPT = "dark horror tone, sharp or aggressive lines, hyper-realistic rendering, horror eyes, elongated limbs, busy patterned background, muted colors, glitch texture, text or watermark"

#Style 3
PROMPT = 'anime manga style 2d cartoon avatar, clean cel shading, vibrant colors, detailed hair, smooth skin, expressive large eyes, professional digital art'
NEG_PROMPT = 'blurry, lowres, bad anatomy, missing limbs, extra limbs, distorted face, ugly, deformed, cropped, messy lines, sketch, photorealistic, 3d render, watermark, text, logo, grayscale, monochrome'

# # ====== LOAD MODEL ======
# device = "cuda"
# controlnet = ControlNetModel.from_pretrained(CONTROLNET_ID, torch_dtype=torch.float32)
# pipe = StableDiffusionControlNetPipeline.from_pretrained(
#     MODEL_ID,
#     controlnet=controlnet,
#     torch_dtype=torch.float32
# )
# pipe = pipe.to(device)
# # scheduler tweak
# pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)

# pipe.safety_checker = None  # Tắt safety checker

# try:
#     pipe.enable_sequential_cpu_offload()  # Giảm tiêu thụ VRAM
# except Exception as e:
#     print(f"⚠️ Không thể bật sequential CPU offload: {e}")


def img2anime(input_path,output_path, device="cuda", size=512, canny_low=100, canny_high=200, keep_aspect=True):
    # Đọc ảnh
    image = cv2.imread(input_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    cv2.imshow('Gray',image)
    # Tính edges với Canny
    edges = cv2.Canny(image, canny_low, canny_high)
    cv2.imshow('Edges', edges)
    
    edges_rgb = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)

    # Resize hợp lý
    if keep_aspect:
        h, w = image.shape[:2]
        scale = size / max(h, w)  # scale theo cạnh lớn nhất
        new_w, new_h = int(w * scale), int(h * scale)
        edges_resized = cv2.resize(edges_rgb, (new_w, new_h))

        # Thêm padding để thành size x size (không crop/méo)
        top = (size - new_h) // 2
        bottom = size - new_h - top
        left = (size - new_w) // 2
        right = size - new_w - left
        edges_padded = cv2.copyMakeBorder(edges_resized, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(0,0,0))
    else:
        edges_padded = cv2.resize(edges_rgb, (size, size))
    cv2.imshow('Padded', edges_padded)
    cv2.waitKey(0)
    # # Convert sang tensor chuẩn cho ControlNet
    # image_tensor = torch.from_numpy(edges_padded).float().div(255.0)  # [0,1]
    # image_tensor = image_tensor.permute(2, 0, 1).unsqueeze(0).to(device, dtype=torch.float32)
    # # Chạy pipeline
    # result = pipe(
    #     prompt=PROMPT,
    #     negative_prompt=NEG_PROMPT,
    #     image=image_tensor,
    #     num_inference_steps=24,
    #     guidance_scale=8.5
    # ).images[0]

    # result.save(output_path)
    # print(f"✅ Đã lưu ảnh kết quả: {output_path}")
    
# ====== TEST ======
if __name__ == "__main__":
    img2anime("input.png", "output_ngon3.png")