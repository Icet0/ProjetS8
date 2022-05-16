import { Component, OnInit } from '@angular/core';
import {Loader} from "@googlemaps/js-api-loader";

@Component({
  selector: 'app-carte-widget',
  templateUrl: './carte-widget.component.html',
  styleUrls: ['./carte-widget.component.scss']
})
export class CarteWidgetComponent implements OnInit {

  title = "google-maps"

  private map! : google.maps.Map

  constructor() { }

  ngOnInit(): void {


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

      let label = "0.0.0.15 \n nombre de visite: 4"
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




}
