from playwright.sync_api import sync_playwright
import os
import re
import uuid
from requests import get
from urllib.parse import urljoin, urlparse
import base64

url = "example.com"

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