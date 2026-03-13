---
title: Python 实用工具库
outline: deep
---

# Python 实用工具库

> 记录工作中实际用过的 Python 第三方库，持续扩展。每节包含：简介 + 安装 + 核心用法。

---

## Pandas 数据处理

**Pandas** 是 Python 最主流的数据分析库，提供 DataFrame 结构，适合数据清洗、统计、转换等场景。

```bash
pip install pandas
```

**结合 Flask 提供数据清洗 API：**

```python
from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/api/clean_data', methods=['POST'])
def clean_data():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        data = pd.read_csv(file)
        # 转换日期格式，无法解析的置为 NaT
        data['OrderDate'] = pd.to_datetime(data['OrderDate'], errors='coerce')
        # 删除含空值的行
        cleaned_data = data.dropna()
        return jsonify(cleaned_data.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## DeepFace 人脸识别

**DeepFace** 是一个深度学习人脸分析库，支持性别、年龄、情绪、种族预测，以及人脸比对。

```bash
pip install deepface
```

**批量预测目录下图片中的人物性别：**

```python
from deepface import DeepFace
from PIL import Image
import os

image_dir = 'images'

for img_name in os.listdir(image_dir):
    img_path = os.path.join(image_dir, img_name)
    try:
        Image.open(img_path)  # 验证文件是否为有效图片
        result = DeepFace.analyze(img_path, actions=['gender'])
        gender = result[0]['gender']
        print(f'{img_name}: {gender}')
    except Exception:
        # 跳过无法识别的文件
        continue
```

:::tip
`actions` 支持多项同时分析：`['age', 'gender', 'emotion', 'race']`，按需传入。
:::

---

## Pytesseract OCR 文字识别

**Pytesseract** 是 Google Tesseract OCR 引擎的 Python 封装，可从图片中提取文本。

```bash
pip install pytesseract pillow
```

:::warning 前置依赖
需先安装 Tesseract OCR 引擎本体：
- **Windows**：[下载安装包](https://github.com/UB-Mannheim/tesseract/wiki)，安装后配置路径
- **macOS**：`brew install tesseract`
- **Linux**：`sudo apt install tesseract-ocr`

识别中文需额外下载语言包（推荐 `tessdata_best` 版本），放入 Tesseract 的 `tessdata` 目录。
:::

```python
from PIL import Image
import pytesseract

# Windows 需手动指定可执行文件路径
pytesseract.pytesseract.tesseract_cmd = r'D:\tools\Tesseract-OCR\tesseract.exe'

image = Image.open('document.jpg')

# lang='chi_sim' 识别简体中文，需安装对应语言包
text = pytesseract.image_to_string(image, lang='chi_sim')
print(f'识别结果：{text}')
```

---

## BeautifulSoup 网页爬取

**BeautifulSoup** 是一个解析 HTML/XML 文档、提取数据的库，通常配合 `requests` 使用。

```bash
pip install beautifulsoup4 requests
```

### 爬取网页链接

```python
import requests
from bs4 import BeautifulSoup
import csv

url = "https://example.com"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept-Language': 'zh-CN,zh;q=0.8',
}

response = requests.get(url, headers=headers)
response.encoding = 'utf-8'

if response.status_code != 200:
    print(f'请求失败，状态码：{response.status_code}')
else:
    soup = BeautifulSoup(response.text, 'html.parser')
    articles = soup.find_all('a')

    articles_data = [[a.get_text(), a.get('href')] for a in articles]

    with open('articles.csv', mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Title', 'Link'])
        writer.writerows(articles_data)

    print(f'爬取完成，共 {len(articles_data)} 条')
```

### 爬取网页图片（静态页面）

适用于服务端直出的 HTML 页面，**不支持 JS 动态渲染**。

```python
from requests import get
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re, os

url = "https://example.com"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.8',
}

def clean_filename(filename):
    """去除文件名中的非法字符"""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def get_image_extension(content_type):
    """根据 Content-Type 判断图片扩展名"""
    mapping = {'jpeg': '.jpg', 'png': '.png', 'gif': '.gif', 'svg': '.svg'}
    for key, ext in mapping.items():
        if key in content_type:
            return ext
    return '.jpg'  # 默认

os.makedirs('images', exist_ok=True)

response = get(url=url, headers=headers)
response.encoding = 'utf-8'
soup = BeautifulSoup(response.text, 'html.parser')

# 过滤掉 SVG 和无 src 的 img
imgs = [img for img in soup.find_all('img')
        if img.get('src') and not img['src'].endswith('.svg')]

print(f'找到 {len(imgs)} 张图片')

for img in imgs:
    img_url = urljoin(url, img['src'])
    img_name = clean_filename(os.path.basename(urlparse(img_url).path))

    try:
        img_response = get(img_url)
        ext = get_image_extension(img_response.headers.get('Content-Type', ''))
        if not img_name.endswith(ext):
            img_name = img_name + ext

        with open(os.path.join('images', img_name), 'wb') as f:
            f.write(img_response.content)
        print(f'已下载：{img_name}')
    except Exception as e:
        print(f'下载失败 {img_url}：{e}')
```

### 爬取网页图片（动态渲染）

适用于需要 JS 渲染的 SPA 页面（Vue/React 等），依赖 **Playwright** 驱动真实浏览器。

```bash
pip install playwright
playwright install chromium
```

```python
from playwright.sync_api import sync_playwright
from requests import get
from urllib.parse import urljoin, urlparse
import base64, os, re, uuid

url = "https://example.com"

def clean_filename(filename):
    filename = filename.replace(' ', '_')
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', filename)

def get_image_extension(content_type):
    mapping = {'jpeg': '.jpg', 'png': '.png', 'gif': '.gif', 'svg': '.svg'}
    for key, ext in mapping.items():
        if key in content_type:
            return ext
    return '.jpg'

def save_base64_image(base64_str):
    """保存 Base64 编码的图片"""
    img_data = base64.b64decode(base64_str.split(',')[1])
    filename = os.path.join('images', f'{uuid.uuid4()}.jpg')
    with open(filename, 'wb') as f:
        f.write(img_data)

def download_image(img_url):
    """下载普通图片 URL"""
    if not img_url:
        return
    img_url = urljoin(url, img_url)
    img_name = clean_filename(os.path.basename(urlparse(img_url).path))

    try:
        resp = get(img_url)
        ext = get_image_extension(resp.headers.get('Content-Type', ''))
        if not img_name.endswith(ext):
            img_name = img_name + ext
        with open(os.path.join('images', img_name), 'wb') as f:
            f.write(resp.content)
        print(f'已下载：{img_name}')
    except Exception as e:
        print(f'下载失败 {img_url}：{e}')

os.makedirs('images', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto(url)
    page.wait_for_timeout(3000)  # 等待 JS 渲染完成

    # 获取所有 img 的 src 属性
    img_urls = page.eval_on_selector_all('img', 'imgs => imgs.map(img => img.src)')

    for img_url in img_urls:
        if img_url.startswith('data:image'):
            save_base64_image(img_url)
        else:
            download_image(img_url)

    browser.close()
```

:::tip 静态 vs 动态选型
| | `requests + BeautifulSoup` | `Playwright` |
|---|---|---|
| 适用场景 | 服务端渲染（SSR）页面 | JS 动态渲染（SPA）页面 |
| 速度 | 快 | 慢（需启动浏览器） |
| 依赖 | 轻量 | 需安装 Chromium |
:::

---

<!--
## 新工具模板

**XXX** 是 ...

```bash
pip install xxx
```

简介 + 核心用法

-->
