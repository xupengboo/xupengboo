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


