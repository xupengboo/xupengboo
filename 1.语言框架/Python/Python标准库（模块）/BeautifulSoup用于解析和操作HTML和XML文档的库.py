# 例如：爬取csdn首页上的文章标题和链接并保存到csv文件中。
import requests
from bs4 import BeautifulSoup
import csv

url = "https://www.csdn.net/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    'Connection': 'keep-alive',
}

response = requests.get(url, headers=headers)
if response.status_code != 200:
    print(f'请求失败, 状态码为{response.status_code}, 返回结果为：{response.text}')



'''
BeautifulSoup 将 HTML 或 XML 文档解析为一个类似于 DOM 树的结构。你可以通过访问这个树的节点来操作和查询网页内容。
- find()：返回第一个匹配的元素。
- find_all()：返回所有匹配的元素（列表形式）。
- select()：使用 CSS 选择器来查找元素。
'''
# 解析网页内容
soup = BeautifulSoup(response.text, "html.parser")
# 匹配返回结果
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