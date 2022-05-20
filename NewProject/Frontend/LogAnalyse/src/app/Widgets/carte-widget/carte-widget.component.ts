import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Loader} from "@googlemaps/js-api-loader";
import {ImplRecherche, RechercheSiteComponent} from "../recherche-site/recherche-site.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

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






  constructor() { }

  ngOnInit(): void {

    this.loading = false;

    let loader = new  Loader(

      {apiKey : "AIzaSyCoSXfG5a2sQfy20dSJnCvjI-rBpJI7cFw"})

    loader.load().then(() => {
      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });
      const center: google.maps.LatLngLiteral = {lat: 48.86, lng: 2.34445};

      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom: 6
      });

      let label = "Adresse IP :"+this.ip +'<br>'+"nombre de visite: "+this.nb_occur;
      const marker = new google.maps.Marker({
        position: {lat: 48.86, lng: 2.34445},
        map: this.map!,
      });

      marker.addListener("click", () => {
        infoWindow.setContent(label);
        infoWindow.open(this.map!, marker);
      });
    });

  }

  public  recupererIPSite(){}//NE PAS OUBLER DE PASSER LE COOKIE DANS LE SEND MESSAGE : => this.service.sendMessage("/searchSite",{url:url,"loginCookie":this.cookieService.get("loginCookie")}).subscribe(





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


        }
      }
    );
  }

  _funcDeclancherOnEnter(): void {
    console.log("On enter");
    console.log(this.myControl.value);
    let elem = this.myControl.value;
    if(this.lastSiteUrlChoice != elem && elem.length > 0){
      console.log("nouveau site url");
      this.lastSiteUrlChoice = elem;
      //On lance la recherche sur l'API
      //RAJOUTER FONCTION QUI FAIT L'APPELLE VERS LE BACK

      //-------------------------------------------------
    }
  }
  //RECHERCHE BARRE---------------------------------------------


}
