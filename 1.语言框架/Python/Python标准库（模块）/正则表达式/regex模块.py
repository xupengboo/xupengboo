# regex 正则表达式用于匹配。
import re 

# re.match(pattern, string)
result = re.match(r'\d+', '123abc')
if result:
    print(result.group())

# re.search(pattern, string)
result = re.search(r'\d+', 'abc123xyz')
if result:
    print(result.group())

# re.findall(pattern, string)
result = re.findall(r'\d+', '123abc456def')
if result:
    print(result)

# re.finditer(pattern, string)
result = re.finditer(r'\d+', '123abc456def')
if result:
    for match in result:
        print(match.group())

# re.sub(pattern, repl, string, count=0)
result = re.sub(r'\d+', 'x', '123abc456def')
if result:
    print(result)

# re.split(pattern, string, maxsplit=0)
result = re.split(r'\d+', '123abc456def')
if result:
    print(result)

