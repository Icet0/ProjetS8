import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MessageService} from "../message/message.service";

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements OnInit {

  constructor( private message : MessageService) { }

  ngOnInit(): void {
  }

  public recupererDonner()
  {
    this.message.sendMessage('http://ip-api.com/php/24.48.0.1?fields=61439',{}).subscribe(
      data => console.log(data)
    )
  }
}
