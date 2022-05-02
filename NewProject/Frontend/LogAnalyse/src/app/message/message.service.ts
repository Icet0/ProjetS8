import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataFormat} from "./DataFormat";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private service : HttpClient) { }

  sendMessage(Url : string, data : any): Observable<DataFormat>{

    // const headers =  new HttpHeaders("Access-Control-Allow-Origin:http://127.0.0.1:5000")
    let realUrl = environment.backend+Url;
    console.log(realUrl);
    let retour : Observable<DataFormat> = new Observable<DataFormat>();
    const formData = new FormData();
    if (data != null && data != undefined) {
      for(const key in data){
        formData.append(key,data[key]);
        console.log("key = "+key+" values = "+data[key]);
      }
    }
    retour = this.service.post<DataFormat>(realUrl,formData,{withCredentials:true });
    return retour;
  }
}
