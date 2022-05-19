import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "../message/message.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";


export interface Tmp {//pour le test
  lol:number;
  cocorico:string;
}
export interface DataSetSite{
  ConsultedPage: string;
  nb_occur: string

}

@Component({
  selector: 'app-visualisation-siteq',
  templateUrl: './visualisation-siteq.component.html',
  styleUrls: ['./visualisation-siteq.component.scss']
})
export class VisualisationSiteqComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  lastSiteUrlChoice:string = "";
  siteWebList: string[] = ['One', 'Two', 'Three']
  constructor(private service:MessageService,private cookieService:CookieService) { }
  /// Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ ],
    datasets: [ {
      data: [  ]
    } ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ DatalabelsPlugin ];


  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeLabels(): void {
    const words = [ 'hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
      'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
      'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
      'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
      'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny' ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartData.labels = new Array(3).map(_ => randomWord());

    this.chart?.update();
  }

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push([ 'Line 1', 'Line 2', 'Line 3' ]);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position = this.pieChartOptions.plugins.legend.position === 'left' ? 'top' : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display = !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }
  ngOnInit(): void {
    console.log("On init affluence ts");
    this.siteWebList = [""]
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
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.siteWebList.filter(siteWebList => siteWebList.toLowerCase().includes(filterValue));
  }
  public _onClickPage(url:string){
    console.log("On click");
    console.log("On init visualisation ts");
    this.service.sendMessage("/pageSite", {url:url,"loginCookie":this.cookieService.get("loginCookie")}).subscribe(
      (DataSetSite) => {
        console.log(DataSetSite.data);
        for(const info in DataSetSite.data ){
          if (this.pieChartData.labels) {
            this.pieChartData.labels.push(DataSetSite.data[info]["ConsultedPage"]);
          }
          this.pieChartData.datasets[0].data.push(DataSetSite.data[info]["nb_occur"]);
          this.chart?.update();
        }
      });
  }

  public _onClick(){
    this.pieChartData.datasets = [ {
      data: [  ]
    } ];
    this.pieChartData.labels = [ ];
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
  nothing() {
    console.log("nothing");
  }

}
