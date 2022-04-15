from flask import Flask,render_template,request,jsonify,redirect, url_for
import json
from flask import jsonify


def create_app():
  app = Flask(__name__)
  return app

app = create_app()

@app.route("/")
def hello():
    return 'Hello, World!'

@app.route("/json")
def json():
    de = {"lol":1,"cocorico":"ZARBI"}
    return jsonify(de)


if __name__ == "__main__":
     app.run(debug=True)