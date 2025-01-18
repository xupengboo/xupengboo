import requests
from bs4 import BeautifulSoup
import csv

url = "xxx.example.com"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
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