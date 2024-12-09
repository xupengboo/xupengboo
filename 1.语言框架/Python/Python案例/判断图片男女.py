# DeepFace 是一个深度学习库能够预测图片中的任务性别
from deepface import DeepFace
import os 
from PIL import Image


# 目标目录
image_dir = 'images'

# 识别图片中的性别
for img_name in os.listdir(image_dir):
    img_path = os.path.join(image_dir, img_name)

    # 打开图片
    img = None

    try:
        img = Image.open(img_path)

        # 使用DeepFace 进行性别识别
        result = DeepFace.analyze(img_path, actions=['gender'])
    except Exception as e:
        continue

    # 打印结果
    gender = result[0]['gender']
    print(f'{img_name} is {gender}')
