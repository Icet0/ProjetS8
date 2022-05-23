from asyncio.windows_events import NULL
from concurrent.futures import thread
from distutils.log import error
from urllib import response
from flask import Flask,render_template,request,jsonify,redirect, url_for,Response,stream_with_context
import json
import pandas as pd
from flask import make_response
import gzip
import os
import requests
import time
import threading





def create_app():
  app = Flask(__name__)
  return app

app = create_app()

def __init__():
  os.environ["USERMODEL_PATH"] = "http://127.0.0.1:"
  os.environ["USERMODEL_PORT"] = "5050"


@app.route("/", methods=['GET','POST'])
def hello():
    login = getRequestLoginCookie(request)
    @isAuthenticate
    def inside_hello(login):
        return 'Hello, World!'
    return inside_hello(login)


#MAPPING POUR LA CONNEXION AVEC L'API USERS / ANGULAR--------------------------

#On sera router ici si l'utilisateur veut s'identifier ou si il veut acceder e une page qui necessite une auth alors qu'il ne l'est pas
@app.route("/authenticate",methods=['GET','POST'])
def authenticate():
    if(request.method == "GET"):
        login = request.args.get("login")
        pwd=request.args.get("pwd")
    else:
        login = request.form.get('login')
        pwd=request.form.get('pwd')

    # headers = {"Content-Type": "application/json; charset=utf-8"}

    data = {
    "login": login,
    "pwd": pwd,
    }
    
    jsonObject = json.dumps(data)

    print(jsonObject)
    res = requests.post(os.getenv("USERMODEL_PATH")+os.getenv("USERMODEL_PORT")+"/authentification", json=jsonObject)
    if(res.status_code==200):
        if(res.json()["status"]=="OK"):
          print("status ok")
        else:
          print("status error")
        if(res.json()["data"]):
          print(res.json()["data"])
          status="OK"
        else:
          print(res.json()["data"])
          status=res.json()["status"]
          # retourne rien car pas connecte
        de = {"status":status,
              "data":res.json()["data"]}
        response = jsonify(de)
        return makeRequestHeaders(response)
    else:
        de = {"status":res.status_code,
              "data":""}
        response = jsonify(de)
        return makeRequestHeaders(response)
      
      
#On sera router ici si l'utilisateur veut s'identifier ou si il veut acceder e une page qui necessite une auth alors qu'il ne l'est pas
@app.route("/register",methods=['GET','POST'])
def register():
    if(request.method == "GET"):
        login = request.args.get("login")
        pwd=request.args.get("pwd")
    else:
        login = request.form.get('login')
        pwd=request.form.get('pwd')

    data = {
    "login": login,
    "pwd": pwd,
    }
    
    print("data : ",data)
    jsonObject = json.dumps(data)

    print(jsonObject)
    
    #REGISTER
    resRegister = requests.post(os.getenv("USERMODEL_PATH")+os.getenv("USERMODEL_PORT")+"/addUser", json=jsonObject)
    print(resRegister)
    if(resRegister.status_code==200):
          status = resRegister.json()["status"]
          data = resRegister.json()["data"]
    else:
          status = resRegister.status_code
          data = False
          print("register else")
    de = {"status":status,
          "data":data}
    response = jsonify(de)
    return makeRequestHeaders(response)
  



#------------------------------------------------------------------------------

#FONCTIONS DE REQUETTES VERS L'API USERS---------------------------------------

def getRequestLoginCookie(request):
    try:
        if(request.method == "GET"):
            login = request.args.get("loginCookie")
        else:
            login = request.form.get('loginCookie')
        return login
    except:
        return ""
    

def isAuthenticate(func):
    def inner(login):
      res = requests.get(os.getenv("USERMODEL_PATH")+os.getenv("USERMODEL_PORT")+"/isAuth")
      if(res.json()["status"]=="OK"):
        print("status ok")
      else:
        print("status error")
      if(login == res.json()["data"]):
        print(login)
        # retourne la fonction appelee a la base
        return func(login)
      else:
        # retourne rien car pas connecte
        de = {"status":"non auth",
             "data":None}
        response = jsonify(de)
        return makeRequestHeaders(response)
    return inner
    



#------------------------------------------------------------------------------

#MAPPING-----------------------------------------------------------------------

@app.route("/json",methods=['POST','GET'])
def visualisation_rooting():
    login = getRequestLoginCookie(request)
    @isAuthenticate
    def visualisation(login):
          # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
          data = getTAB().to_dict(orient = 'records')
          de = {"status":"OK",
                "data":data}
          response = jsonify(de)
          return makeRequestHeaders(response)
    return visualisation(login)
    

# @app.route("/tryAll",methods=['POST','GET'])
# def tryAll():
#       try:
#         myUrl = request.environ['HTTP_ORIGIN']
#       except KeyError:
#         print("KeyError lol")
#         myUrl = '*'
      
#       data = getallTAB() #get all tab
#       data = data.head(5000)
#       data = data.to_dict(orient = 'records')
      
#       de = {"status":"OK",
#              "data":data}
    

#       content = gzip.compress(json.dumps(de).encode('utf8'), 5)
#       response = make_response(content)
#       response = makeRequestHeaders(response)
#       response.headers['Content-Encoding'] = 'gzip'
#       return response



    
# @app.route("/tryAll2",methods=['POST','GET'])
# def tryAll2():
#       # try:
#       #   myUrl = request.environ['HTTP_ORIGIN']
#       # except KeyError:
#       #   print("KeyError lol")
#       #   myUrl = '*'
      
#       data = getallTAB() #get all tab
#       taille = data.shape[0]
#       data = data.to_dict(orient = 'records')
#       de = {"status":"OK",
#              "data":data}
    
#       response = de
#       @stream_with_context
#       def generate():       
#           print(taille)
#           for i in range(taille):
#               yield json.dumps(response["data"][i])

#       # response = make_response(response)
#       # response.headers.add('Access-Control-Allow-Origin',myUrl)
#       # response.headers.add('Access-Control-Allow-Credentials', 'true')
#       # response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#       # response.headers.add('Content-type','application/json')
#       # response.headers.add('charset','utf8')
#       return Response(generate(), content_type='application/json')





@app.route("/afluence",methods=['POST'])
def affluence():
      login = getRequestLoginCookie(request)
      @isAuthenticate
      def affluence_inside(login):
        # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
        data = getTAB().to_dict(orient = 'records')
        de = {"status":"OK",
              "data":data}
        response = jsonify(de)
        
        return makeRequestHeaders(response)
      return affluence_inside(login)




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



#page affluence
@app.route('/site',methods=['POST'])
def getSiteWeb():
      login = getRequestLoginCookie(request)
      @isAuthenticate
      def getSiteWeb_inside(login):
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
      return getSiteWeb_inside(login)
    
    
    
@app.route('/topSite',methods=['POST','GET'])
def getBestSiteWeb():
    
    login = getRequestLoginCookie(request)
    @isAuthenticate
    def getBestSiteWeb_inside(login):    
        #TOP 40 SITE
        df = getallTAB()
        df_site = df['VisitedSite']
        df_site = df.groupby('VisitedSite').size().to_frame(name = 'nb_occur').sort_values('nb_occur', ascending = False)
        df_site = df_site.reset_index()
        df_site = df_site.head(40).to_dict(orient = 'records')
        de = {"status":"OK",
                "data":df_site}
        response = gzip.compress(json.dumps(de).encode('utf8'), 5)
        response = make_response(response)
        response = makeRequestHeaders(response)
        response.headers['Content-Encoding'] = 'gzip'
        return response
    return getBestSiteWeb_inside(login)


@app.route('/searchSite',methods=['POST','GET'])
def siteAffluence():
      login = getRequestLoginCookie(request)
      @isAuthenticate
      def siteAffluence_inside(login):
          if(request.method == "GET"):
              url = request.args.get("url")
              search=request.args.get("recherche")
          else:
              url = request.form.get('url')
              search=request.form.get('recherche')
          if(url != None):
              print("url : "+url)
              # A RAJOUTER TRI DU DATAFRAME (MOIS + ENLEVER LES ELTS INUTILES + CPT NB VISITE)
              res = searchSiteAffluence(url).reset_index(drop=True)
              if(search=="hours"):
                df_Heurs = ajoutHeurs(res)
                df_gb = groupByHeurs(df_Heurs)
              else:
                df_Mois = ajoutMois(res)
                df_gb = groupByMois(df_Mois)
              df_gb = df_gb.to_dict(orient = 'records')
          else :
            df_gb = None
          de = {"status":"OK",
                  "data":df_gb}
          response = gzip.compress(json.dumps(de).encode('utf8'), 5)
          response = make_response(response)
          response = makeRequestHeaders(response)
          response.headers['Content-Encoding'] = 'gzip'
          return response
      return siteAffluence_inside(login)

data = {
    "IP": [],
    "lat": [],
    "lon": [],
    "City": [] ,}


@app.route("/RecupIP", methods = ['POST', 'GET'])
def RecupIPVisiteur() :
      login = getRequestLoginCookie(request)
      @isAuthenticate
      def RecupIPVisiteur_inside(login):
          if (request.method == "GET"):
              url = request.args.get("url")
          else:
              url = request.form.get('url')
          if (url != None):
              print("url : " + url)
              res = searchIPVisiteur(url).reset_index(drop=True)
              res = groupByIP(res)

          else:
              res = None

          t1 = thread.threading.Thread(target=IPtoCoord, args=(res,))
          t2 = thread.threading.Thread(target=IPtoCoord, args=(res,))

          t1.start()
          t2.start()

          t1.join()
          t2.join()




          res = pd.DataFrame(data).reset_index()
          res = res.to_dict(orient = 'records')
          de = {"status": "OK",
                    "data": res}


          de = json.dumps(de).encode('utf8')
          response = gzip.compress(de, 5)
          response = make_response(response)
          response = makeRequestHeaders(response)
          response.headers['Content-Encoding'] = 'gzip'
          return response
      return RecupIPVisiteur_inside(login)


# Prendre des ip des local
@app.route('/iptablee')
def IPtoCoord(res):
    login = getRequestLoginCookie(request)
    @isAuthenticate
    def IptoCoord_inside(login):
      data["IP"].clear()
      data["lat"].clear()
      data["lon"].clear()
      data["City"].clear()


    data["IP"].clear()
    data["lat"].clear()
    data["lon"].clear()
    data["City"].clear()


    api_url = "http://ip-api.com/json/"
    for y in res["IP"].sample(100):
        response_json = requests.get(api_url + y)
        if (response_json.status_code == 200):
            response = response_json.json()
            data["IP"].append(y)
            data["lat"].append(response["lat"])
            data["lon"].append(response["lon"])
            data["City"].append(response["city"])





@app.route('/isSite',methods=['POST','GET'])
def isSite():
    login = getRequestLoginCookie(request)
    @isAuthenticate
    def isSite_inside(login):
      try:
        if(request.form.get('url')!=None):
          url = request.form.get('url')
          df = getallTAB()
          df_site = df[df['VisitedSite']==url].to_dict(orient = 'records')
          de = {"status":"OK",
                "data":df_site}
          response = gzip.compress(json.dumps(de).encode('utf8'), 5)
          response = make_response(response)
          response = makeRequestHeaders(response)
          response.headers['Content-Encoding'] = 'gzip'
          return response
        else:
          raise ValueError('bad request')
        
      except ValueError:
        print("error, bad request")
        de = {"status":"error",
              "data":"Bad request"}
      finally:
        return makeRequestHeaders(jsonify(de))
    return isSite_inside(login)


@app.route("/pageSite",methods=['POST','GET'])
def visualisation_PageSite():
      login = getRequestLoginCookie(request)
      @isAuthenticate
      def visualisation_PageSite_inside(login):
        try:
          myUrl = request.environ['HTTP_ORIGIN']
          #urlSite = request.form.get("urlSite")
        except KeyError:
          print("KeyError lol")
          myUrl = '*'
        if(request.method == "GET"):
          url = request.args.get("url")
          search=request.args.get("recherche")
        else:
          url = request.form.get('url')
        # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
        infoPage = getSiteInfos(getallTAB(),url).to_dict(orient = 'records')
        de = {"status":"OK",
              "data":infoPage}
        response = jsonify(de)
        response.headers.add('Access-Control-Allow-Origin',myUrl)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Content-type','application/json')
        response.headers.add('charset','utf8')
        return response
      return visualisation_PageSite_inside(login)

#FONCTIONS LOAD DATASET
@app.route("/IpSite",methods=['POST','GET'])
def visualisation_IpSite():
      try:
        myUrl = request.environ['HTTP_ORIGIN']
        #urlSite = request.form.get("urlSite")
      except KeyError:
        print("KeyError lol")
        myUrl = '*'
      if(request.method == "GET"):
        #url = request.args.get("url")
        search=request.args.get("recherche")
      else:
        #url = request.form.get('url')
        ip = request.form.get("ip")

      # data = [{"lol":1,"cocorico":"ZARBI"},{"lol":2,"cocorico":"WTF"}] #exemple de la forme de donnée à retourner
      infoPage = getSiteByIp(getallTAB(),ip).to_dict(orient = 'records')
      de = {"status":"OK",
             "data":infoPage}
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
    df2 = full_df2.head(1000)
    return df2

def getallTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes']
    return full_df2


#FONCTIONS UTILISABLES

def getSiteInfos(df,ip):
    """ Fonction permettant de retourner un dataframe contenant la liste des sites visité par une adresse IP

    paramètres : 

    df : dataframe contenant tous les logs.
    ip : chaine de caractère decrivant l'url à avoir.

    retour : 
    
     dataframe listant les sites visité par l'ip.
    
    """
    return df[df['IP'] == ip]

def getSiteInfos(df,url):
    """ Fonction permettant de retourner un dataframe contenant la liste des pages consultées par sites 

    paramètres : 

    df : dataframe contenant tous les logs.
    url : chaine de caractère decrivant l'url à avoir.

    retour : 
    
    dc_site : dataframe listant la liste des pages consultées par sites.
    
    """
    df_ip = df[df['VisitedSite'] == url] 
    df_site =  df_ip.groupby('ConsultedPage').size().to_frame(name = 'nb_occur').sort_values(by = 'nb_occur', ascending = False).reset_index().head(10)
    return df_site

def getSiteByIp(df,ipaddr):
    """ Fonction permettant de retourner un dataframe contenant la liste des sites visité par une adresse IP

    paramètres : 

    df : dataframe contenant tous les logs.
    url : chaine de caractère decrivant l'url à avoir.
    ip : adresse IP à analyser

    retour : 
    
    df_ip : dataframe listant les sites visité par l'ip.
      
    """
    df_ip = df[df['IP'] == ipaddr]
    df_ip =  df_ip.groupby('VisitedSite').size().to_frame(name = 'nb_occur').sort_values(by = 'nb_occur', ascending = False).reset_index().head(10)
    return df_ip


@app.route('/affluenceip',methods=['POST','GET'])
def ipAffluence():
    if(request.method == "GET"):
        ip = request.form.get('ip')
    else:
        ip = request.form.get('ip')

    if(ip != None):
        print("url : "+ip)
        # A RAJOUTER TRI DU DATAFRAME (MOIS + ENLEVER LES ELTS INUTILES + CPT NB VISITE)
        res = searchIpAffluence(ip).reset_index(drop=True)

        df_Heurs = ajoutHeurs(res)
        df_gb = groupByHeurs(df_Heurs)
    df_gb = df_gb.to_dict(orient = 'records')
    de = {"status":"OK",
            "data":df_gb}
    response = gzip.compress(json.dumps(de).encode('utf8'), 5)
    response = make_response(response)
    response = makeRequestHeaders(response)
    response.headers['Content-Encoding'] = 'gzip'
    return response

def searchIpAffluence(ip):
    df = getallTAB()
    df = pd.DataFrame(df,columns=['Date', 'Heure', 'IP','VisitedSite','Mois'])
    if(ip != "" and ip != None):
        df_site = df[df['IP'] == ip]
        # A RAJOUTER TRI DU DATAFRAME (MOIS + ENLEVER LES ELTS INUTILES + CPT NB VISITE)
        return (df_site)

def searchSiteAffluence(url):
    df = getallTAB()
    df = pd.DataFrame(df,columns=['Date', 'Heure', 'IP','VisitedSite','Mois'])
    if(url != "" and url != None):
        df_site = df[df['VisitedSite'] == url]
        # A RAJOUTER TRI DU DATAFRAME (MOIS + ENLEVER LES ELTS INUTILES + CPT NB VISITE)
        return (df_site)

# Fonction qui permet de recup les ip des visiteurs d'un site
def searchIPVisiteur(url):
    df = getallTAB()
    df = pd.DataFrame(df, columns= ['IP', 'VisitedSite'])
    if (url != "" and url != None):
        df_site = df[df['VisitedSite'] == url]


    df_site = pd.DataFrame(df_site, columns=['IP']).reset_index(drop=True)
    return df_site

def ajoutMois(df):
    for i in range(len(df)): 
         df.loc[i,"Mois"] = str((df.loc[i,"Date"])[5]) + str((df.loc[i,"Date"])[6])
    return df.sort_values('Mois')


def groupByMois(df):
    df = df.groupby("Mois").size().to_frame(name='count')
    df = df.reset_index()
    return df


def ajoutHeurs(df):
    for i in range(len(df)): 
         df.loc[i,"H"] = str((df.loc[i,"Heure"])[0]) + str((df.loc[i,"Heure"])[1])
    return df.sort_values('H')


def groupByHeurs(df):
    df = df.groupby("H").size().to_frame(name='count')
    df = df.reset_index()
    return df

def groupByIP(df):
    df = df.groupby("IP").size().to_frame(name='count')
    df = df.reset_index()
    return df.sort_values('count')


if __name__ == "__main__":
    __init__()
    app.run(debug=True)