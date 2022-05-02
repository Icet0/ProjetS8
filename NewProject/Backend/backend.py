from flask import Flask,render_template,request,jsonify,redirect, url_for,Response,stream_with_context

import json
from flask import jsonify
import pandas as pd
from flask import make_response
import gzip


def create_app():
  app = Flask(__name__)
  return app

app = create_app()



@app.route("/")
def hello():
    return 'Hello, World!'



@app.route("/json",methods=['POST','GET'])
def visualisation():
      # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
      data = getTAB().to_dict(orient = 'records')
      de = {"status":"OK",
             "data":data}
      response = jsonify(de)
      return makeRequestHeaders(response)
    

@app.route("/tryAll",methods=['POST','GET'])
def tryAll():
      try:
        myUrl = request.environ['HTTP_ORIGIN']
      except KeyError:
        print("KeyError lol")
        myUrl = '*'
      
      data = getallTAB() #get all tab
      data = data.head(5000)
      data = data.to_dict(orient = 'records')
      
      de = {"status":"OK",
             "data":data}
    

      content = gzip.compress(json.dumps(de).encode('utf8'), 5)
      response = make_response(content)
      response = makeRequestHeaders(response)
      response.headers['Content-Encoding'] = 'gzip'
      return response



    
@app.route("/tryAll2",methods=['POST','GET'])
def tryAll2():
      # try:
      #   myUrl = request.environ['HTTP_ORIGIN']
      # except KeyError:
      #   print("KeyError lol")
      #   myUrl = '*'
      
      data = getallTAB() #get all tab
      taille = data.shape[0]
      data = data.to_dict(orient = 'records')
      de = {"status":"OK",
             "data":data}
    
      response = de
      @stream_with_context
      def generate():       
          print(taille)
          for i in range(taille):
              yield json.dumps(response["data"][i])

      # response = make_response(response)
      # response.headers.add('Access-Control-Allow-Origin',myUrl)
      # response.headers.add('Access-Control-Allow-Credentials', 'true')
      # response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
      # response.headers.add('Content-type','application/json')
      # response.headers.add('charset','utf8')
      return Response(generate(), content_type='application/json')





@app.route("/afluence",methods=['POST'])
def afluence():
      
      # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
      data = getTAB().to_dict(orient = 'records')
      de = {"status":"OK",
             "data":data}
      response = jsonify(de)
      
      return makeRequestHeaders(response)



@app.route("/test")
def test():
  data = getTAB()
  taille = data.shape[0]
  data = data.to_dict(orient = 'records')
  de = {"status":"OK",
          "data":data}
  de["data"][0]["StatusCode"] = taille
  response = jsonify(de["data"][0])
  return response


    
@app.route('/stream')
def streamed_response():
    stre = "abcdefgijklmnopqrstuvwxyz"
    @stream_with_context
    def generate():
        for i in range (1000):
          yield stre[i%len(stre)]
          yield "\n"
    return Response((generate()))
 


#FONCTIONS

def makeRequestHeaders(response):
    try:
      myUrl = request.environ['HTTP_ORIGIN']
    except KeyError:
      print("KeyError lol")
      myUrl = '*'
    response.headers.add('Access-Control-Allow-Origin',myUrl)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Content-type','application/json')
    response.headers.add('charset','utf8')
    return response

@app.route('/site',methods=['POST'])
def getSiteWeb():
    df = getallTAB()
    df_site = df['VisitedSite'].unique()
    df_site = pd.DataFrame(df_site,columns=["siteWeb"]).to_dict(orient = 'records')
    de = {"status":"OK",
            "data":df_site}
    # response = jsonify(de)
    # return makeRequestHeaders(response)
    response = gzip.compress(json.dumps(de).encode('utf8'), 5)
    response = make_response(response)
    response = makeRequestHeaders(response)
    response.headers['Content-Encoding'] = 'gzip'
    return response
    




#FONCTIONS LOAD DATASET


def getTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes']
    df2 = full_df2.head(1000)
    return df2

def getallTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes']
    return full_df2


#------------------------------




if __name__ == "__main__":
     app.run(debug=True)