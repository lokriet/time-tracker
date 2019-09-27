import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  /*
  [
    {
      "name": "2019/6/10",
      "series": [
        {
          "name": "study",
          "value": 9.5
        }
      ]
    },
    {
      "name": "2019/6/11",
      "series": [
        {
          "name": "work",
          "value": 8.5
        },
        {
          "name": "sleep",
          "value": 8
        }
      ]
    }
  ]
  */
  // tslint:disable-next-line: variable-name
  _data: any[];

  totals: number[];
  maxTotal: number;
  hours: string[]; // labels for y axis
  hourBarHeight: number;

  @ViewChild('dataGrid', { static: true }) dataGrid: ElementRef;
  @ViewChild('xAxis', { static: true }) xAxis: ElementRef;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.maxTotal = 0;
    this.totals = [];
    for (const dayData of this.data) {
      let dayTotal = 0;
      for (const task of dayData.series) {
        dayTotal += task.value;
      }
      this.totals.push(dayTotal)
      this.maxTotal = Math.max(this.maxTotal, dayTotal);
    }


    this.hours = [];
    this.hourBarHeight = this.maxTotal > 12 ? 2 : 1;
    for (let i = 1; i < this.maxTotal; i++) {
      if (this.maxTotal > 12 && (i % 2 === 1)) {
        continue;
      }

      const label = i + (i === 1 ? ' hr' : ' hrs');
      this.hours.push(label);
    }
  }

  getBarHeightPercent(barValue: number, totalValue: number): string {
    return (barValue * 100 / totalValue) + '%';
  }

  getDatePosition(dataStackIndex: number): string {
    const firstDataStack = this.dataGrid.nativeElement.querySelector('.data-bar-stack');
    const style = firstDataStack.currentStyle || window.getComputedStyle(firstDataStack);
    const dataStackWidth = firstDataStack.offsetWidth + parseFloat(style.marginRight);
    return (dataStackIndex * dataStackWidth) + 'px';
  }

  rotateDateLabels(): boolean {
    const firstDataStack = this.dataGrid.nativeElement.querySelector('.data-bar-stack');
    const style = firstDataStack.currentStyle || window.getComputedStyle(firstDataStack);
    const dataStackWidth = firstDataStack.offsetWidth + parseFloat(style.marginRight);

    const rem = parseFloat(style.fontSize);
    return 6 * rem < dataStackWidth;
  }

  @Input() set data(data: any[]) {
    this._data = data;
    this.init();
  }

  get data(): any[] {
    return this._data;
  }

}
