import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartDataset, ChartEvent, ChartType} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import annotationPlugin from 'chartjs-plugin-annotation';
import {MessageService} from "../../message/message.service";

import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {ChangeDetectionStrategy} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {clone} from "chart.js/helpers";

@Component({
  selector: 'app-affluence',
  templateUrl: './affluence.component.html',
  styleUrls: ['./affluence.component.scss']
})
export class AffluenceComponent implements OnInit {

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
  _labelsHours:String[] =  ["01h","02h","03h","04h","05h","06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"
                            ,"19h","20h","21h","22h","23h"];




  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60, 70,80,90,100,110,120],
        label: 'Consultations',
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

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.datasets.length; i++) {
      for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
        this.lineChartData.datasets[i].data[j] = AffluenceComponent.generateNumber(i);
      }
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



  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = AffluenceComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${this.lineChartData.labels.length}`);

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
      this.searchSite(this.lastSiteUrlChoice, this.abscisse == "hours" ? "hours" : "months");
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


  constructor(private service: MessageService) {


  }

  ngOnInit() {
    console.log("On init affluence ts");
    this.siteWebList = [""]

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

      });
  }

  public _onClick(){
    console.log("On click");
    this.myControl.valueChanges.subscribe(
      (elem) => {
        console.log("in suscribe");
        console.log(elem);//ELEM EST LE SITE WEB CLIQUE
        if(this.lastSiteUrlChoice != elem && elem.length > 0){
          console.log("nouveau site url");
          this.lastSiteUrlChoice = elem;
          //On lance la recherche sur l'API
          this.searchSite(elem,this.abscisse=="hours"?"months":"hours");
        }
      }
    );
  }

  public searchSite(url:String,recherche:String){
    let index = recherche=="months"?"Mois":"H";
    this.service.sendMessage("/searchSite",{url:url,recherche:recherche}).subscribe(
      (data) => {
        console.log("Dans lel subscribe du /searchSite")
        console.log(data);
        //DANS LE SUSCRIBE POUR RELOAD LE GRAPH
        let valid = true;
        for(let i = 0; i <= this.cptLabels; i++) {
          valid = false;
          for (let j = 0; j < data.data.length; j++) {
            // console.log(data.data[j][index]);
            if (data.data[j][index] == i) {
              // console.log("count = " + data.data[j]['count']);
              this.lineChartData.datasets[0].data[i-1] = data.data[j]['count'];
              valid = true;
              break;
            }
          }
          if(!valid){
            this.lineChartData.datasets[0].data[i-1] = 0;
          }
        }
        this.chart?.update();
      }
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
  }


  nothing() {
    console.log("nothing");
  }
}




