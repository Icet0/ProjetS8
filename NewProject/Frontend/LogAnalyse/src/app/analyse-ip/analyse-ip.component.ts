import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {MessageService} from "../Service/message/message.service";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {RechercheSiteComponent} from "../Widgets/recherche-site/recherche-site.component";
import {clone} from "chart.js/helpers";
import {map, startWith} from "rxjs/operators";
@Component({
  selector: 'app-analyse-ip',
  templateUrl: './analyse-ip.component.html',
  styleUrls: ['./analyse-ip.component.scss']
})
export class AnalyseIpComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart2?: BaseChartDirective;

  constructor(private service:MessageService,private cookieService:CookieService) { }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max : 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ ],
    datasets: [ {
      data: [  ]
    } ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }
  ngOnInit(): void {
    this.ipList = [""]
    this.service.sendMessage("/getIp", {loginCookie:this.cookieService.get("loginCookie")}).subscribe(
      (dataSet) => {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );
        for (let i in dataSet.data) {
          let siteName: string = dataSet.data[i]["IP"].toString()
          this.ipList.push(siteName)
          // console.log(dataSet.data[i]["siteWeb"]);
        }
      });
    this.service.sendMessage("/IpSite", {ip :"144.76.185.173","loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (DataSetSite) => {
        console.log(DataSetSite.data);
        for(const info in DataSetSite.data ){
          console.log(DataSetSite.data);
          if (this.barChartData.labels) {
            this.barChartData.labels.push(DataSetSite.data[info]["VisitedSite"]);
          }
          this.barChartData.datasets[0].data.push(DataSetSite.data[info]["nb_occur"]);
          this.chart?.update();

        }
      });

    this.service.sendMessage("/affluenceip", {ip :"144.76.185.173","loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (DataSetSite) => {
        let i = 0;
        for(const info in DataSetSite.data ){
          if (this.lineChartData.labels) {
            //this.lineChartData.labels.push(DataSetSite.data[info]["H"]);
            this.lineChartData.datasets[0].data[i] = DataSetSite.data[info]["count"];
            console.log(DataSetSite.data[info]["count"]);
            i++;
          }
        }
        this.chart2?.update();
        console.log(this.lineChartData.datasets[0].data);
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ipList.filter(ipList => ipList.toLowerCase().includes(filterValue));
  }
  ipList: string[] = ['One', 'Two', 'Three']
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  selectChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  siteWeb: string = "";
  data!:[];
  lastSiteUrlChoice:string = "";
  cptLabels = 24;
  abscisse: String = "hours";
  _labelsHours:String[] =  ["00h","01h","02h","03h","04h","05h","06h","07h","08h","09h","10h","11h","12h","13h","14h","15h","16h","17h","18h"
    ,"19h","20h","21h","22h","23h"];

  @ViewChild('RechercheSiteComponent') rechercheBarre! : RechercheSiteComponent;
  @ViewChild('RechercheSiteComponentAdd') rechercheBarreAdd! : RechercheSiteComponent;

  loading =true;
  addSite = false;
  cptSite = 0;


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
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

    labels: clone(this._labelsHours)
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



  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  public reset(): void {
    for (let i = 0; i < this.lineChartData.datasets.length-1; i++) {
      this.lineChartData.datasets.pop()
    }
    this.chart2?.update();
  }

  // events
  public chartClicked2({event, active}: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered2({event, active}: { event?: ChartEvent, active?: {}[] }): void {
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


  public changeColor(): void {
    for(let dataSet of this.lineChartData.datasets){
      dataSet.borderColor = this.ColorCode();
      dataSet.backgroundColor = this.addAlpha(this.ColorCode(),0.3);
      // dataSet.backgroundColor;
    }
    this.chart2?.update();
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
  public _onClick(){
    this.barChartData.datasets = [ {
      data: [  ]
    } ];
    this.barChartData.labels = [ ];
    console.log("On click");
    this.myControl.valueChanges.subscribe(
      (elem) => {
        console.log("in suscribe");
        console.log(elem);//ELEM EST LE SITE WEB CLIQUE
        if(this.lastSiteUrlChoice != elem && elem.length > 0){
          console.log("nouveau site url");
          this.lastSiteUrlChoice = elem;
          //On lance la recherche sur l'API
          this._onClickPage(elem)
        }
      }
    );
  }

  public _onEnter(){
    this.barChartData.datasets = [ {
      data: [  ]
    } ];
    this.barChartData.labels = [ ];
    console.log("On enter");
    console.log(this.myControl.value);
    let elem = this.myControl.value;
    if(this.lastSiteUrlChoice != elem && elem.length > 0){
      console.log("nouveau site url");
      this.lastSiteUrlChoice = elem;
      //On lance la recherche sur l'API
      this._onClickPage(elem)
    }
  }

  public _onClickPage(ip:string){
    console.log("On click");
    console.log("On init visualisation ts");
    this.service.sendMessage("/IpSite", {ip :ip,"loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (DataSetSite) => {
        console.log(DataSetSite.data);
        for(const info in DataSetSite.data ){
          console.log(DataSetSite.data);
          if (this.barChartData.labels) {
            this.barChartData.labels.push(DataSetSite.data[info]["VisitedSite"]);
          }
          this.barChartData.datasets[0].data.push(DataSetSite.data[info]["nb_occur"]);
          this.chart?.update();

        }
      });
   /* this.service.sendMessage("/affluenceip", {ip :ip,"loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (DataSetSite) => {
        let i = 0;
        for(const info in DataSetSite.data ){
          if (this.lineChartData.labels) {
            //this.lineChartData.labels.push(DataSetSite.data[info]["H"]);
            this.lineChartData.datasets[0].data[i] = DataSetSite.data[info]["count"];
            console.log(DataSetSite.data[info]["count"]);
            i++;
          }
        }
        this.chart2?.update();
        console.log(this.lineChartData.datasets[0].data);
      });*/
  }

}
