from playwright.sync_api import sync_playwright
import os
import re
import uuid
from requests import get
from urllib.parse import urljoin, urlparse
import base64

url = "https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&ie=utf8&word=%E7%94%B5%E5%BD%B1%E5%90%8D%E5%8F%A5%20%E7%85%A7%E7%89%87&fr=ala&ala=1&alatpl=normal&pos=0&dyTabStr=MCwzLDEsMiwxMyw3LDYsNSwxMiw5"

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