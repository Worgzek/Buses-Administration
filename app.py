from flask import Flask, jsonify
from db import get_summary_data

app = Flask(__name__)

@app.route('/api/chuyen-xe', methods=['GET'])
def api_chuyen_xe():
    try:
        data = get_summary_data()
        return jsonify({
            "status": "success",
            "total": len(data),
            "data": data
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)