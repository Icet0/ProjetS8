import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Loader} from "@googlemaps/js-api-loader";
import {ImplRecherche, RechercheSiteComponent} from "../recherche-site/recherche-site.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MessageService} from "../../Service/message/message.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-carte-widget',
  templateUrl: './carte-widget.component.html',
  styleUrls: ['./carte-widget.component.scss']
})
export class CarteWidgetComponent implements OnInit,ImplRecherche {
  private ip : string  = ""
  private nb_occur : string = ""
  title = "google-maps"

  private map! : google.maps.Map

  private ipList! : any[]


  //RECHERCHE BARRE ATTRIBUTES--------------------------------------------

  siteWebList: string[] = ['One', 'Two', 'Three']
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  selectChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  siteWeb: string = "";
  @ViewChild('RechercheSiteComponent') rechercheBarre! : RechercheSiteComponent;
  private loading = false;
  lastSiteUrlChoice:string = "";


  //RECHERCHE BARRE ATTRIBUTES--------------------------------------------

  constructor(private service:MessageService,private cookieService:CookieService) { }

  ngOnInit(): void {


    let loader = new  Loader(

      {apiKey : "AIzaSyCoSXfG5a2sQfy20dSJnCvjI-rBpJI7cFw"})

    loader.load().then(() => {

      const center: google.maps.LatLngLiteral = {lat: 48.86, lng: 2.34445};

      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom: 6
      });

    });

    //RECHERCHE BARRE--------------------------------------------

    this.loading = false;
    this.siteWebList = [""]
    // this.myControl.updateValueAndValidity(this.nothing);
    this.service.sendMessage("/topSite", {"loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (dataSet) => {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );
        for (let i in dataSet.data) {
          let siteName: string = dataSet.data[i]["VisitedSite"].toString()
          this.siteWebList.push(siteName)

          // console.log(dataSet.data[i]["siteWeb"]);
        }
        // this.rechercheBarre.siteWebList=this.siteWebList;
        // this.rechercheBarre._func=this._onClick;

      });
    //RECHERCHE BARRE--------------------------------------------



  }

  public  recupererIPSite(url:string){

    this.ipList = []

    if (url != null)
    {
      // REcupere les IP
      this.service.getmessage('/RecupIP?url=${url}').subscribe(
        e => {
          for(const element of Object.entries(e.data) )   {
             this.ipList.push(element)
          }

          this.afficheMarker()
        }
    )


    }


  }//NE PAS OUBLER DE PASSER LE COOKIE DANS LE SEND MESSAGE : => this.service.sendMessage("/searchSite",{url:url,"loginCookie":this.cookieService.get("loginCookie")}).subscribe(

  public afficheMarker()
  {

      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });

       const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };



          // Create markers.
          for (let element of Object.entries(this.ipList)) {
              let label = "Adresse IP : "+ element[1][1].IP
            const marker = new google.maps.Marker({
              position:({lat : element[1][1].lat , lng :element[1][1].lon }),
              icon: svgMarker,
              map: this.map,
            });


         marker.addListener("click", () => {
          infoWindow.setContent(label);
          infoWindow.open(this.map!, marker);
        });

          }

  }










  //RECHERCHE BARRE--------------------------------------------

  ngAfterViewInit() {
    Promise.resolve().then(() => this.loading=false);
    if(this.loading==false){
      this.rechercheBarre.myControl=this.myControl;
      this.rechercheBarre.selectChange=this.selectChange;
      this.rechercheBarre.filteredOptions=this.filteredOptions;
      this.rechercheBarre.siteWebList = this.siteWebList;

    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
  }

  _funcDeclancherOnClick(): void {
    console.log("On click");
    console.log(this.myControl.value);
    this.myControl.valueChanges.subscribe(
      (elem) => {
        console.log("in suscribe");
        console.log(elem);//ELEM EST LE SITE WEB CLIQUE
        if(this.lastSiteUrlChoice != elem && elem.length > 0) {
          console.log("nouveau site url");
          this.lastSiteUrlChoice = elem;

          //RAJOUTER FONCTION QUI FAIT L'APPELLE VERS LE BACK
          //exemple getIpSite()

          //-------------------------------------------------
         this.recupererIPSite(elem)
        }
      }
    );
  }

  _funcDeclancherOnEnter(): void {
    console.log("On enter");
    console.log(this.myControl.value);
    let elem = this.myControl.value;
    console.log("Wshhhh")
    if(this.lastSiteUrlChoice != elem && elem.length > 0){
      console.log("nouveau site url");
      this.lastSiteUrlChoice = elem;
      //On lance la recherche sur l'API
      //RAJOUTER FONCTION QUI FAIT L'APPELLE VERS LE BACK

      this.recupererIPSite(elem)
    }
  }
  //RECHERCHE BARRE---------------------------------------------


}
