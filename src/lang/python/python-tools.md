---
title: Python 工具
order: 2
---

## Pandas 数据清洗

```python
from flask import Flask, request, jsonify
import pandas as pd

# 初始化 Flask 应用
app = Flask(__name__)

# 定义一个数据清洗的 API 接口
@app.route('/api/clean_data', methods=['POST'])
def clean_data():
    # 接收上传的文件
    file = request.files.get('file')  # 获取表单中上传的文件
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # 使用 Pandas 清洗数据
    try:
        data = pd.read_csv(file)
        data['OrderDate'] = pd.to_datetime(data['OrderDate'], errors='coerce')  # 转换日期格式
        cleaned_data = data.dropna()  # 删除空值的行

        # 返回清洗后的数据（以 JSON 格式返回）
        return jsonify(cleaned_data.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 启动服务
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## DeepFace 预测图片性别

DeepFace 是一个深度学习库能够预测图片中的任务性别。

```python
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
```

## Pytesseract 文字识别

`pytesseract` 是一个 Python 库，它是 Tesseract OCR（光学字符识别）引擎的一个封装，可以用来从图片中提取文本。

```python
from PIL import Image
import pytesseract

# 手动指定 tesseract 的路径, 需要安装 tesseract 
pytesseract.pytesseract.tesseract_cmd = r'D:\\tools\\Tesseract-OCR\\tesseract.exe'

image = Image.open('123.jpg')

# 需要安装中文语言包，否则识别结果可能不准确（推荐 tesseract_best 语言包 ）
text = pytesseract.image_to_string(image, lang='chi_sim')

print(f'识别结果：{text}')
```

## BeautifulSoup HTML或XML文档中提取数据

1. BeautifulSoup 是一个用于从 HTML 或 XML 文档中提取数据的 Python 库。

```python
import requests
from bs4 import BeautifulSoup
import csv

url = "xxx.example.com"

headers = {
    'User-Agent': 'xxx',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Connection': 'keep-alive',
}

response = requests.get(url, headers=headers)
response.encoding = 'utf-8'
if response.status_code != 200:
    print(f'请求失败, 状态码为{response.status_code}, 返回结果为：{response.text}')

# 解析网页
soup = BeautifulSoup(response.text, "html.parser")


articles = soup.find_all('a')

articles_data = []
for article in articles:
    title = article.get_text()
    link  = article.get('href')
    articles_data.append([title, link])

# 将数据保存到csv文件中
with open('articles.csv', mode='w', newline='', encoding='utf-8') as files:
    writer = csv.writer(files)
    writer.writerow(['Title','Link'])
    writer.writerows(articles_data)

print("爬取完成")
```

2. 爬取网页图片，处理渲染：

```python
from playwright.sync_api import sync_playwright
import os
import re
import uuid
from requests import get
from urllib.parse import urljoin, urlparse
import base64

url = "http://xxx.com"

# 清理文件命名的非法字符
def clean_filename(filename): 
    """
    处理字符串中的特殊字符，将其替换为安全的字符。
    :param input_string: 输入的字符串
    :return: 处理后的字符串
    """
    # 定义特殊字符的替换规则，这里将常见的特殊字符替换为下划线
    sanitized_string = filename

    # 1. 替换空格
    sanitized_string = sanitized_string.replace(" ", "_")
    sanitized_string = sanitized_string.replace('.', '')

    # 2. 替换所有非字母数字的字符为下划线（这可以根据实际需要修改）
    sanitized_string = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', sanitized_string)

    # 3. 你也可以添加更多的替换规则，比如处理&符号、=号等
    # sanitized_string = sanitized_string.replace("&", "_and_").replace("=", "_equals_")

    return sanitized_string

# 获取图片格式
def get_image_extension(content_type):
    if 'jpeg' in content_type:
        return '.jpg'
    elif 'png' in content_type:
        return '.png'
    elif 'gif' in content_type:
        return '.gif'
    elif 'svg' in content_type:
        return '.svg'
    else:
        return '.jpg'  # 默认使用 .jpg 格式

def base64Func(base64_str):
    temp = uuid.uuid4()
    # 将base64 解码为二进制数据
    base64_str = base64_str.split(",")[1]
    images_data = base64.b64decode(base64_str)
    with open(os.path.join("images",  f"{temp}base64.jpg"), 'wb') as file:
        file.write(images_data)

def downloadImgUrl(img_url):
    # 处理url土坯那
    if img_url is None:
        return
    # 如果是相对路径，则拼接成绝对路径
    img_url = urljoin(url, img_url)
    # 提取 URL 的基础部分，去掉查询参数
    img_url_parsed = urlparse(img_url)
    # 获取图片文件名成
    img_name = os.path.basename(img_url_parsed.path)
    img_name = clean_filename(img_name)

    img_response = get(img_url)
    # 如果 URL 是 Base64 编码的图片
    if img_url.startswith('data:image'):
        base64Func(img_url)
    else:
        content_type = img_response.headers.get('Content-Type', '')
        extension = get_image_extension(content_type)
        if not img_name.endswith(extension):
            if img_name.endswith("."):
                img_name = img_name + extension
            else:
                img_name = img_name + '.' + extension
        # 保存图片
        with open(os.path.join("images", img_name), 'wb') as f:
            f.write(img_response.content)
            print(f"Downloaded {img_name} ")
            

os.makedirs('images', exist_ok=True)
with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    # 打开页面
    page.goto(url)

    # 等待页面加载完成（例如等待 5 秒）
    page.wait_for_timeout(3000)

    # 获取所有img的srm属性
    img_urls = page.eval_on_selector_all('img', 'imgs => imgs.map(img => img.src)')

    for img_url in img_urls:
        print(f'img_url: {img_url}')
        # 处理图片地址
        if img_url.startswith('data:image'):
            base64Func(img_url)
        else:
            downloadImgUrl(img_url)

    # 关闭浏览器
    browser.close()
```

无法处理渲染：

```python
from requests import get
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urljoin, urlparse

url = "xxx.example.com"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Connection': 'keep-alive',
    'Content-Type': 'text/html;charset=UTF-8'
}

response = get(url=url, headers=headers)
response.encoding = 'utf-8'
print(f'访问地址：{response.text}')

# print(f'访问地址返回：{response.text}')
soup = BeautifulSoup(response.text, 'html.parser')

imgs = soup.find_all('img')

print(f'找到{len(imgs)}张图片')


# 过滤svg
imgs = [img for img in imgs if not img.get('src', '').endswith('.svg')]

os.makedirs('images', exist_ok=True)

# 清理文件命名的非法字符
def clean_filename(filename): 
    return re.sub(r'[<>:"/\\|?*]', '', filename)

# 获取图片格式
def get_image_extension(content_type):
    if 'jpeg' in content_type:
        return '.jpg'
    elif 'png' in content_type:
        return '.png'
    elif 'gif' in content_type:
        return '.gif'
    elif 'svg' in content_type:
        return '.svg'
    else:
        return '.jpg'  # 默认使用 .jpg 格式

# 下载每张图片
for img in imgs:
    img_url = img.get('src')

    if img_url is None:
        continue
    
    # 如果是相对路径，则拼接成绝对路径
    img_url = urljoin(url, img_url)

    # 提取 URL 的基础部分，去掉查询参数
    img_url_parsed = urlparse(img_url)
    # 获取图片文件名成
    img_name = os.path.basename(img_url_parsed.path)
    img_name = clean_filename(img_name)

    # 下载图片
    try:
        img_response = get(img_url)

        # 如果 URL 是 Base64 编码的图片
        if img_url.startswith('data:image'):
            continue

        print(f'图片地址：{img_url}')
        print(f'图片名称：{img_name}')

        content_type = img_response.headers.get('Content-Type', '')
        extension = get_image_extension(content_type)
        # 如果文件名没有扩展名，添加正确的扩展名
        if not img_name.endswith(extension):
            img_name = img_name + '.' +  extension
        # 保存图片到本地
        with open(os.path.join('images', img_name), 'wb') as f:
            f.write(img_response.content)
            print(f'Downloaded {img_url}')
    except Exception as e:
        print(f'Failed to download {img_url}: {e}')
        continue
```

