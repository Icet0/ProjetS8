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

      const center: google.maps.LatLngLiteral = {lat: 30, lng: -110};

      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom: 8
      });


    });

  }




}
