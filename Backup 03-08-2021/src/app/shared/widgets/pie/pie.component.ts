import { Component, OnInit, Input} from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
export class ChartData{
  hasTag: String[];
  rate: number[];
}
export class Data{
  name: String;
  y: number;
}
@Component({
  selector: 'app-widget-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions = {};
  doesDataExist: boolean = false;
  constructor() {
  }
  ngOnChanges () {
    console.log(this.data);
    this.doesDataExist = (this.data.length > 0) ? true : false;
    if(this.doesDataExist){
      this.chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'MOST POPULAR HASTAG'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>'+ '<br/>' +'{point.percentage:.1f} %'
            }
          }
        },
        exporting: {
          enabled: true
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Hastag',
          colorByPoint: true,
          data: this.data
        }]
      };
  
      HC_exporting(Highcharts);
  
      setTimeout(() => {
        window.dispatchEvent(
          new Event('resize')
        );
      }, 300);
    }
  }
  @Input('data') data = [];
  async ngOnInit() {
  }
}
