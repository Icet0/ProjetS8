import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartDataset, ChartEvent, ChartType} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import annotationPlugin from 'chartjs-plugin-annotation';
import {MessageService} from "../../Service/message/message.service";

import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {clone} from "chart.js/helpers";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ImplRecherche, RechercheSiteComponent} from "../../recherche-site/recherche-site.component";
import {copyArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-affluence',
  templateUrl: './affluence.component.html',
  styleUrls: ['./affluence.component.scss']
})
export class AffluenceComponent implements OnInit,ImplRecherche {

  siteWebList: string[] = ['One', 'Two', 'Three']
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  selectChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  siteWeb: string = "";
  data!:[];
  lastSiteUrlChoice:string = "";
  cptLabels = 12;
  abscisse: String = "hours";
  _labelsMonths:String[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','October','September','November','December'];
  _labelsHours:String[] =  ["00h","01h","02h","03h","04h","05h","06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"
                            ,"19h","20h","21h","22h","23h"];

  @ViewChild('RechercheSiteComponent') rechercheBarre! : RechercheSiteComponent;
  @ViewChild('RechercheSiteComponentAdd') rechercheBarreAdd! : RechercheSiteComponent;

  loading = false;
  addSite = false;
  cptSite = 0;


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60, 70,80,90,100,110,120],
        label: 'SiteWeb',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      // {
      //   data: [28, 48, 40, 19, 86, 27, 90],
      //   label: 'Series B',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // },
      // {
      //   data: [180, 480, 770, 90, 1000, 270, 400],
      //   label: 'Series C',
      //   yAxisID: 'y-axis-1',
      //   backgroundColor: 'rgba(255,0,0,0.3)',
      //   borderColor: 'red',
      //   pointBackgroundColor: 'rgba(148,159,177,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      //   fill: 'origin',
      // }
    ],

    labels: clone(this._labelsMonths)
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
        {
          position: 'left',
          grid: {
                color: 'rgba(255,0,0,0.3)',
              },
          ticks: {
                color: 'red'
              }
        },
      // 'y-axis-1': {
      //   position: 'right',
      //   grid: {
      //     color: 'rgba(255,0,0,0.3)',
      //   },
      //   ticks: {
      //     color: 'red'
      //   }
      // }
    },

    plugins: {
      legend: {display: true},
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              position: 'center',
              enabled: true,
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold'
              }
            }
          },
        ],
      }
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  public reset(): void {
    for (let i = 0; i < this.lineChartData.datasets.length-1; i++) {
      this.lineChartData.datasets.pop()
      this.cptSite-=1;

    }
    this.chart?.update();
  }

  // events
  public chartClicked({event, active}: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({event, active}: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public addOne(data:any):void{
    let dataSet =  {
        data: data,
        label: 'Series B',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      }
    this.cptSite+=1;
    this.lineChartData.datasets.push(data);
    this.changeColor();
  }

  public pushOne(content:any): void {
    this.openWindowCustomClass(content);
    this.chart?.update();
  }

  public changeColor(): void {
    for(let dataSet of this.lineChartData.datasets){
      dataSet.borderColor = this.ColorCode();
      dataSet.backgroundColor = this.addAlpha(this.ColorCode(),0.3);
      // dataSet.backgroundColor;
    }
    this.chart?.update();
  }

  public ColorCode() {
    let makingColorCode = '0123456789ABCDEF';
    let finalCode = '#';
    for (let counter = 0; counter < 6; counter++) {
      finalCode =finalCode+ makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
  }
  public addAlpha(color: string, opacity: number): string {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  public changeAbscisse(): void {
    if(this.lastSiteUrlChoice.length > 0) {
      let cptSave = this.cptSite;
      for(let i = 0; i < this.lineChartData.datasets.length;i++){
        let url = typeof (this.lineChartData.datasets[i].label) == "string" ? this.lineChartData.datasets[i].label : '';
        console.log("searchSIte de ",url," avec un cpt site = ",this.cptSite);
        this.searchSite(url!, this.abscisse == "hours" ? "hours" : "months",this.cptSite);
        this.cptSite-=1;

      }
      this.cptSite=cptSave;

      let len = this.chart?.data?.labels?.length;
      console.log("len : "+len);
      for (let i = 0; i < len!; i++){
        this.chart?.data?.labels?.pop();
      }
      console.log(this._labelsMonths);
      for(let s of this.abscisse == "months" ? clone(this._labelsMonths) : clone(this._labelsHours)){
        this.chart?.data?.labels?.push(s);
      }
      this.abscisse = this.abscisse == "hours" ? "months" : "hours";

      this.chart?.update();//DEJA FAIT DANS LE SEARCHSITE ??

    }

  }


  constructor(private service: MessageService,private rooting: HttpClient,private modalService: NgbModal, ) {

  }
  ngAfterViewInit() {
    Promise.resolve().then(() => this.loading=false);
    if(this.loading==false){
      this.rechercheBarre.myControl=this.myControl;
      this.rechercheBarre.selectChange=this.selectChange;
      this.rechercheBarre.filteredOptions=this.filteredOptions;
      this.rechercheBarre.siteWebList = this.siteWebList;

      // this.rechercheBarreAdd.myControl=this.myControl;
      // this.rechercheBarreAdd.selectChange=this.selectChange;
      // this.rechercheBarreAdd.filteredOptions=this.filteredOptions;
      // this.rechercheBarreAdd.siteWebList = this.siteWebList;
    }
  }

  ngOnInit() {
    this.loading = false;

    console.log("On init affluence ts");
    this.siteWebList = [""]
    // this.myControl.updateValueAndValidity(this.nothing);
    this.service.sendMessage("/topSite", {}).subscribe(
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
  }


  // public _filter(value: string): string[] {
  //   return this.rechercheBarre._filter(value);
  // }




  public _onEnter(){
    console.log("On enter");
    console.log(this.myControl.value);
    let elem = this.myControl.value;
    if(this.lastSiteUrlChoice != elem && elem.length > 0){
      console.log("nouveau site url");
      this.lastSiteUrlChoice = elem;
      //On lance la recherche sur l'API
      this.searchSite(elem,this.abscisse=="hours"?"months":"hours",this.cptSite);
    }
  }

  public _onClick(){
    console.log("On click");
    console.log(this.myControl.value);
    this.myControl.valueChanges.subscribe(
      (elem) => {
        console.log("in suscribe");
        console.log(elem);//ELEM EST LE SITE WEB CLIQUE
        if(this.lastSiteUrlChoice != elem && elem.length > 0){
          console.log("nouveau site url");
          this.lastSiteUrlChoice = elem;
          //On lance la recherche sur l'API
          this.searchSite(elem,this.abscisse=="hours"?"months":"hours",this.cptSite);
        }
      }
    );
  }

  public searchSite(url:string,recherche:string,cpt:number){
    let constAddSite = this.addSite;
    let index = recherche=="months"?"Mois":"H";
    this.service.sendMessage("/searchSite",{url:url,recherche:recherche}).subscribe(
      (data) => {
        console.log(data.data.length);
        if (data.data.length > 0) {
          console.log("Dans lel subscribe du /searchSite ",cpt);
          console.log(data);
          //DANS LE SUSCRIBE POUR RELOAD LE GRAPH
          let valid = true;
          let datasetClone = clone(this.lineChartData.datasets[this.cptSite]);

          for (let i = 0; i <= (this.abscisse == "months" ? this._labelsHours.length : this._labelsMonths.length); i++) {
            valid = false;
            let valIndex = index=="Mois"?i-1:i;
            for (let j = 0; j < data.data.length; j++) {
              // console.log(data.data[j][index]);
              if (data.data[j][index] == i) {
                if (constAddSite) {
                  datasetClone.data[valIndex] = data.data[j]['count'];
                } else {
                  this.lineChartData.datasets[cpt].data[valIndex] = data.data[j]['count'];
                }
                valid = true;
                break;
              }
            }
            //                this.addOne(data.data);
            if (!valid) {
              if (constAddSite) {
                datasetClone.data[valIndex] = 0;
              } else {
                this.lineChartData.datasets[cpt].data[valIndex] = 0;
              }
            }
          }
          if (constAddSite) {
            this.addOne(datasetClone);
          }
          this.lineChartData.datasets[cpt].label = url;
          this.myControl.setValue('');
          this.chart?.update();
        }
      }
    )
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if(this.modalService.hasOpenModals()){
      this.addSite=true;
    }else {
      this.addSite=false;
    }
    console.log(this.addSite);
    return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
  }
  _funcDeclancherOnClick(): void {
    this._onClick();
  }

  _funcDeclancherOnEnter(): void {
    this._onEnter();
  }



  openWindowCustomClass(content: any) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
    this.addSite=true;

  }


}




