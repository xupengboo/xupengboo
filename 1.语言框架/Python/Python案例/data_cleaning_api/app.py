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

