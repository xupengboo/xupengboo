from PIL import Image
import pytesseract

# 手动指定 tesseract 的路径, 需要安装 tesseract 
pytesseract.pytesseract.tesseract_cmd = r'D:\\tools\\Tesseract-OCR\\tesseract.exe'

image = Image.open('123.jpg')

# 需要安装中文语言包，否则识别结果可能不准确（推荐 tesseract_best 语言包 ）
text = pytesseract.image_to_string(image, lang='chi_sim')

print(f'识别结果：{text}')
