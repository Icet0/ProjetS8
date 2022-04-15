from flask import Flask,render_template,request,jsonify,redirect, url_for
import json
from flask import jsonify
import pandas as pd


def create_app():
  app = Flask(__name__)
  return app

app = create_app()


@app.route("/")
def hello():
    return 'Hello, World!'



@app.route("/json",methods=['POST','GET'])
def json():
      try:
        myUrl = request.environ['HTTP_ORIGIN']
      except KeyError:
        print("KeyError lol")
        myUrl = '*'
      
      # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}]
      data = getTAB().to_dict(orient = 'records')
      de = {"status":"OK",
             "data":data}
      response = jsonify(de)
      response.headers.add('Access-Control-Allow-Origin',myUrl)
      response.headers.add('Access-Control-Allow-Credentials', 'true')
      response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
      response.headers.add('Content-type','application/json')
      response.headers.add('charset','utf8')
      return response




def getTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes']
    df2 = full_df2.head(10)
    return df2

def getallTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes']
    return full_df2




if __name__ == "__main__":
     app.run(debug=True)