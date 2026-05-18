from flask import Flask, render_template, request, redirect, url_for
from db import fetch_all_trips

app = Flask(__name__)

@app.route('/')
def index():
    data = fetch_all_trips()
    return render_template('index.html', chuyen_xe=data)

if __name__ == '__main__':
    app.run(debug=True)