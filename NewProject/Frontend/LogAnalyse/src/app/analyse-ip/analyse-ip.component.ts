import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {MessageService} from "../Service/message/message.service";
import {CookieService} from "ngx-cookie-service";
@Component({
  selector: 'app-analyse-ip',
  templateUrl: './analyse-ip.component.html',
  styleUrls: ['./analyse-ip.component.scss']
})
export class AnalyseIpComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
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
  }

}
