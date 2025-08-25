
Cách setup


B1: Clone project về 


B2: vào thư mục backend\app\gen_image_ai\models, chạy 2 lệnh git sau


git clone https://huggingface.co/Lykon/dreamshaper-7


git clone https://huggingface.co/lllyasviel/sd-controlnet-canny


B3: vào thư mục backend, chạy lệnh sau, lưu ý khác GPU 1650 thì dùng thư viện khác, nhớ sửa trong requirements.txt tránh crash máy


pip install -r requirements.txt


Lưu ý B3 không tải thư viện được thì tạm thời dừng ở đây, đợi chủ source điều chỉnh thư viện cho phù hợp

B4 vào backend\app, chạy 


python manage.py runserver


B5: Vào frontend\app,


npm install


npm start



B6: vào cùng thư mục, nơi đặt file docker compose, chạy lệnh


docker compose up --build -d
