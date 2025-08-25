# Create your views here.
import base64, io, gc, time
from rest_framework.decorators import api_view, permission_classes
from authentication import permissions
from rest_framework.response import Response
from PIL import Image
import torch, cv2, numpy as np
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
import time
import os
import threading

# Lấy thư mục chứa file views.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# ========= CONFIG ==========
MODEL_ID = os.path.join(BASE_DIR, 'models',"dreamshaper-7")
CONTROLNET_ID = os.path.join(BASE_DIR, 'models','sd-controlnet-canny')
device = "cuda" if torch.cuda.is_available() else "cpu"

# Prompt styles
STYLES = {
    "cartoon": {
        "prompt": "masterpiece, best quality, 2D illustration, full body, cartoon style, modern avatar design, vibrant flat colors, clean bold outlines, simple shapes, soft shading, large expressive eyes, big smile, smooth skin, stylized hair, casual outfit, standing, front view, centered composition, neutral background, friendly expression, professional digital art",
        "neg": "lowres, bad anatomy, blurry, extra limbs, missing fingers, distorted proportions, realistic textures, photorealistic, complex background, harsh shadows, text, watermark, signature, cropped, ugly, old style cartoon, 3D render"
    },
    "chibi": {
        "prompt": "adorable chibi character, oversized head with tiny body, soft rounded line art, pastel pinks and blues, oversized sparkling eyes, cozy and cute clothing, simple minimal backdrop, gentle shadow under character, heartwarming expression, bubblegum pop color scheme",
        "neg": "dark horror tone, sharp or aggressive lines, hyper-realistic rendering, horror eyes, elongated limbs, busy patterned background, muted colors, glitch texture, text or watermark"
    },
    "anime": {
        "prompt": "anime manga style 2d cartoon avatar, clean cel shading, vibrant colors, detailed hair, smooth skin, expressive large eyes, professional digital art",
        "neg": "blurry, lowres, bad anatomy, missing limbs, extra limbs, distorted face, ugly, deformed, cropped, messy lines, sketch, photorealistic, 3d render, watermark, text, logo, grayscale, monochrome"
    }
}

# ========= GLOBAL STATE ==========
pipe = None
last_used = time.time()
lock=threading.Lock()

# CLean memory
def clean_memory():
    global pipe
    with lock:
        if pipe is not None:
            del pipe
            pipe = None
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
            print("✅ Cleaned GPU/CPU memory")

def load_model():
    global pipe
    if pipe is None:
        controlnet = ControlNetModel.from_pretrained(CONTROLNET_ID, torch_dtype=torch.float32)
        pipe_local = StableDiffusionControlNetPipeline.from_pretrained(
            MODEL_ID, controlnet=controlnet, torch_dtype=torch.float32
        )
        pipe_local = pipe_local.to(device)
        pipe_local.scheduler = UniPCMultistepScheduler.from_config(pipe_local.scheduler.config)
        pipe_local.safety_checker = None
        try:
            pipe_local.enable_sequential_cpu_offload()
        except:
            pass
        pipe = pipe_local
    return pipe

def run_inference(image_bytes, style="cartoon",size=512, canny_low=100, canny_high=200, keep_aspect=True):
    with lock:
        # decode image
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # canny edges
        edges = cv2.Canny(image, canny_low, canny_high)
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
        
        # tensor
        image_tensor = torch.from_numpy(edges_padded).float().div(255.0)
        image_tensor = image_tensor.permute(2, 0, 1).unsqueeze(0).to(device, dtype=torch.float32)

        # load model
        pipe_local = load_model()

        # run
        out = pipe_local(
            prompt=STYLES[style]["prompt"],
            negative_prompt=STYLES[style]["neg"],
            image=image_tensor,
            num_inference_steps=24,
            guidance_scale=8.5
        ).images[0]

        # convert to base64
        buf = io.BytesIO()
        out.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return b64

@api_view(["POST"])
# @permission_classes([permissions.IsAuthenticated])
def generate(request):
    global last_used
  
    file = request.FILES.get("image")
    style = request.data.get("style", "cartoon")
    if style not in STYLES:
        return Response({"error": "Invalid style"}, status=400)
    if not file:
        return Response({"error": "No image"}, status=400)

    b64 = run_inference(file.read(), style, size=512, canny_low=100, canny_high=200, keep_aspect=True)

    last_used = time.time()
    return Response({"image": b64})