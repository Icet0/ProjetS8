from flask import Flask,render_template,request,jsonify,redirect, url_for
from flask_bootstrap import Bootstrap
from datetime import datetime
import json
import requests
import pandas as pd

def create_app():
  app = Flask(__name__)
  Bootstrap(app)
  return app

app = create_app()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/map', methods = ['POST','GET'])
def sendCity():
    alldate = getAllDate()
    clientPlusActifs()
    vues = 0
    if request.method == 'POST': 
        table = convertTabtoIPT(getTAB())
        ipdata =""
        ipdata_html=""
        ipDisplay = ""
        topPages = ""
        topPages_html = ""
        site = ""
        if(request.form.get('website')):
            data = request.form.get('website')
            table = convertTabtoIPT(searchBySite(data))
            print(table)
        if(request.form.get('ipSearch')):
            ipAdress = request.form.get('ipSearch')
            ipdata = searchByIP(ipAdress)
            ipdata_html = ipdata.to_html(classes='data')
            # ipdata_columns = ipdata.columns.values
            ipDisplay = AffichagePourIPTracking(ipAdress)
            print(ipdata)
        if(request.form.get('date')):
            data = request.form.get('date')
            table = convertTabtoIPT(searchByDate(data))
            print(data)
            print(table)
        if(request.form.get('sortConsulted')):
            data = request.form.get('sortConsulted')
            topPages = PagesLesPlusConsultés(data)
            topPages_html = topPages.to_html(classes='data')
            print(topPages)
        if(request.form.get('view')):
            site = request.form.get('view')
            vues = numClickSite(site)
        return render_template("filterAndMap.html",data = table,vues = vues,site=site,topPages=[topPages_html],ipDisplay=ipDisplay,IPtables=[ipdata_html],AllDate = alldate)
    else:
        ipDisplay = ""
        table = convertTabtoIPT(getTAB())
        ipdata = ""
        return render_template("filterAndMap.html",data = table,vues = vues, ipdata = ipdata, AllDate = alldate )

def getTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'Consulted Page', 'IP','Visited Site', 'Status Code','Data(Bytes)']
    df2 = full_df2.head(10)
    return df2

def getallTAB():
    url = "./logs/dataset.txt"
    full_df2=pd.read_csv(url, sep=" ", encoding="utf-8")
    full_df2.columns =['Date', 'Heure', 'Consulted Page', 'IP','Visited Site', 'Status Code','Data(Bytes)']
    return full_df2

@app.route('/table')
def showDataBase():
    df2 = getallTAB()
    df2 = df2.sample(1000)
    df2 = df2.dropna(how='any')
    tab_html = df2.to_html(classes='table table-striped')
    
    text_file = open("./templates/Table.html", "w") 
    text_file.write(tab_html) 
    text_file.close()
    return render_template("Table.html")

@app.route('/database')
def headerdef():
    return render_template("header.html")

@app.route('/iptable', methods = ['POST','GET'])
def headerIPdef():
    table = []
    if(request.form.get('ipAdress')):
        data = request.form.get('ipAdress')
        table = convertIPtoCoord(data)
        # table_html = table.to_html(classes='data')
        return render_template("headerIP.html",table = table)
    return render_template("headerIP.html",table = table)
    
@app.route('/stats')
def stats():
    clientsActifs = clientPlusActifs()
    clientsActifs_html = clientsActifs.to_html(classes='data')
    mostVisitedSite = siteLesPlusVisités()
    mostVisitedSite_html = mostVisitedSite.to_html(classes='data')
    pageConsultes = pageLesPlusConsultes()
    pageConsultes_html = pageConsultes.to_html(classes='data')
    joursA = joursActif()
    jours_html = joursA.to_html(classes='data')
    return render_template("stats.html",clientsActifs = [clientsActifs_html],mostVisitedSite = [mostVisitedSite_html],pageConsultes = [pageConsultes_html],jours_html = [jours_html])

@app.route('/iptablee')
def IPtoCoord():
    df2 = getallTAB()
    df2 = deleteDoublon(df2,"IP")
    df2 = df2.sample(25)
    df2 = df2.dropna(how='any')
    data = {"IP":[],
        "lat":[],
       "lon":[],
       "City":[]};

    # GET API to convert
    api_url = "http://ip-api.com/json/" 

    # Requete vers l'API pour convertir les IPs en latitude/longitude
    for y in df2["IP"]:
        
        response_json = requests.get(api_url+y)
        if (response_json.status_code == 200):  
            response = response_json.json()
            Tab = response
        
        latitude = Tab["lat"]
        longitude = Tab["lon"]
        ville = Tab["city"]
        
        data["IP"].append(y)
        data["lat"].append(latitude)
        data["lon"].append(longitude)
        data["City"].append(ville)

    # Create DataFrame
    convertedDF = pd.DataFrame(data)
    convertedDF_html = convertedDF.to_html() 
    text_file = open("./templates/IPTable.html", "w") 
    text_file.write(convertedDF_html) 
    text_file.close() 
    
    # Print the output.
    # print(convertedDF)
    return render_template("IPTable.html")


def searchBySite(Vsite):
    tab = getallTAB()
    filter = tab["Visited Site"]==Vsite
    res = tab.where(filter)
    research = res.dropna()
    research = deleteDoublon(research,"IP")
    if(research.shape[0] > 30):
        research = research.sample(30)
    return research

def searchByIP(ipAdress):
    tab = getallTAB()
    filter = tab["IP"]==ipAdress
    res = tab.where(filter)
    research = res.dropna()
    return research

def searchByDate(date):
    tab = getallTAB()
    filter = tab["Date"]==date
    res = tab.where(filter)
    research = res.dropna()
    research = deleteDoublon(research,"IP")
    if(research.shape[0] > 30):
       research = research.sample(30)
    return research

def AffichagePourIPTracking(ipAdress):
    df = searchByIP(ipAdress)
    res = "Le " + df["Date"] + " à " + df["Heure"] + " | " + df["IP"] + " à consulté la page " + df["Consulted Page"] + " depuis le site " + df["Visited Site"]
    return res

def PagesLesPlusConsultés(ipAdress):
    df = searchByIP(ipAdress)
    res = df.groupby(['Consulted Page']).count()
    res = res.sort_values('IP',ascending=False)
    res = res.head(15)
    res = res.drop(columns=["Data(Bytes)", "Status Code","Visited Site","IP","Heure"])
    res = res.rename(columns={'Date': 'Nombre de fois que la page a été consulté'})
    return res

def numClickSite(site):
    df = getallTAB()
    filter = df["Visited Site"]==site
    df = df.where(filter)
    df = df.dropna()
    df = deleteDoublon(df,"IP")
    df = df.shape[0]
    return df

def clientPlusActifs():
    df = getallTAB()
    df = df.dropna(how='any')
    res = df.groupby(['IP']).count()
    res = res.sort_values('Date',ascending=False)
    res = res.head(15)
    res = res.drop(columns=["Data(Bytes)", "Status Code","Visited Site","Consulted Page","Heure"])
    res = res.rename(columns={'Date': 'Nombre de pages visitées'})
    return res

def siteLesPlusVisités():
    df = getallTAB()
    df = df.dropna(how='any')
    res = df.groupby(['Visited Site']).count()
    res = res.sort_values('Date',ascending=False)
    res = res.head(15)
    res = res.drop(columns=["Data(Bytes)", "Status Code","IP","Consulted Page","Heure"])
    res = res.rename(columns={'Date': 'Sites les plus visités'})
    return res

def pageLesPlusConsultes():
    df = getallTAB()
    df = df.dropna(how='any')
    res = df.groupby(['Consulted Page']).count()
    res = res.sort_values('Date',ascending=False)
    res = res.head(15)
    res = res.drop(columns=["Data(Bytes)", "Status Code","IP","Visited Site","Heure"])
    res = res.rename(columns={'Date': 'Pages les plus consultées'})
    return res

def joursActif():
    df = getallTAB()
    df = df.dropna(how='any')
    res = df.groupby(['Date']).count()
    res = res.sort_values('IP',ascending=False)
    res = res.head(15)
    res = res.drop(columns=["Data(Bytes)", "Status Code","Consulted Page","Visited Site","Heure"])
    res = res.rename(columns={'IP': 'Nombre de visites selon le jour'})
    print(res)
    return res

def convertTabtoIPT(Tab):
    df2 = Tab
    data = {"IP":[],
        "lat":[],
       "lon":[],
       "Date":[],
       "Visited Site":[]};

    # GET API to convert
    api_url = "http://ip-api.com/json/" 

    # Requete vers l'API pour convertir les IPs en latitude/longitude
    for y in df2["IP"]:
        
        response_json = requests.get(api_url+y)
        if (response_json.status_code == 200):  
            response = response_json.json()
            Tab = response
        
        latitude = Tab["lat"]
        longitude = Tab["lon"]
        ville = Tab["city"]

        data["IP"].append(y)
        data["lat"].append(latitude)
        data["lon"].append(longitude)

    for x in df2["Date"]:
        data["Date"].append(x)
    
    for x in df2["Visited Site"]:
        data["Visited Site"].append(x)

    # Create DataFrame
    convertedDF = pd.DataFrame(data)
    return convertedDF

def convertIPtoCoord(ipadress):

    data = {"IP":[],
        "lat":[],
       "lon":[],
       "City":[]};

    # GET API to convert
    api_url = "http://ip-api.com/json/" 

    # Requete vers l'API pour convertir les IPs en latitude/longitude
    response_json = requests.get(api_url+ipadress)
    if (response_json.status_code == 200):  
        response = response_json.json()
        Tab = response
    
    latitude = Tab["lat"]
    longitude = Tab["lon"]
    ville = Tab["city"]

    data["IP"].append(ipadress)
    data["lat"].append(latitude)
    data["lon"].append(longitude)
    data["City"].append(ville)


    # Create DataFrame
    convertedDF = pd.DataFrame(data)
    return convertedDF


def deleteDoublon(tableau,param):
    tab = tableau.drop_duplicates(subset = param, keep = 'first')
    return tab

def getAllDate():
    df = getallTAB()
    df = deleteDoublon(df,"Date")
    return df

if __name__ == "__main__":
     app.run(debug=True)