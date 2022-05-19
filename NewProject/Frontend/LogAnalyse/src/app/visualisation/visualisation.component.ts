import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MessageService} from "../Service/message/message.service";
import {EnvServiceService} from "../env/env-service.service";
import {CookieService} from "ngx-cookie-service";


export interface Tmp {//pour le test
  lol:number;
  cocorico:string;
}

export interface DataSet{
  Date: string;
  Heure: string;
  ConsultedPage: string;
  IP: string;
  VisitedSite: string;
  StatusCode: string;
  DataBytes: string;
}


@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss'],
})
export class VisualisationComponent implements OnInit {

  displayedColumns: String[] = ['Date', 'Heure', 'ConsultedPage', 'IP','VisitedSite', 'StatusCode','DataBytes'];
  dataSource = new MatTableDataSource<DataSet>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private service:MessageService,private k:CookieService) {
    this.k = k;
  }

  ngOnInit(): void {
    console.log("On init visualisation ts");
    console.log("visuCompo envLogin : ",this.k.get("loginCookie"));

    this.service.sendMessage("/json", {"loginCookie":this.k.get("loginCookie")}).subscribe(//TROUVER LA SOLUTION POUR SAUVEGARDER UN TOKEN DE SESSION
      (dataSet) => {
        console.log(dataSet.data);
        this.dataSource.data = dataSet.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

}
