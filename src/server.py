from flask import Flask, request
from flask_cors import CORS
from yahoo_fin import stock_info
import yfinance as yf
import time
import requests
import json 
app = Flask(__name__)
CORS(app, origins='*', 
     headers=['Content-Type', 'Authorization'], 
     expose_headers='Authorization')
@app.route('/api/<asset>', methods=['GET'])
def api(asset):
    print("Im here")
    #res = requests.post('http://localhost/5000')
    # print(res)
    #data = request.json
    # print(data)
    print(asset)
    rate = stock_info.get_live_price(asset)
    print(rate)
    dic = {'data':rate}
    dic = json.dumps(dic)
    return dic

if __name__ == '__main__':
   app.run(debug=True)
