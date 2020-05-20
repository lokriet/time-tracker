import { animate, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { ReportType } from '../reports.component';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss'],
  providers: [DecimalPipe],
  animations: [
    trigger('barJumpAnimation', [
      transition(':enter', [
        style({height: 0}),
        animate('400ms', style({height: '*'}))
      ])
    ])
  ]
})
export class ReportChartComponent implements OnInit, OnChanges, AfterViewChecked {

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
  barData: any[];
  /*
  [
    {
      "name": "Money earned",
      "series": [
        {
          "name": "2019/6/11",
          "value": 119
        }
        {
          "name": "2019/6/12",
          "value": 2.5
        }
        {
          "name": "2019/6/13",
          "value": 0
        }
      ]
    }
  ]
  */
  lineData: any[];
  // @Input() data: any[];
  @Input() chartType: string;

  // barTotals: number[];
  maxBarTotal: number;
  maxLineTotal: number;
  yAxisLabels: string[]; // labels for y axis
  yBarHeight: number;


  // date labels positioning
  needRecalc = false;
  barStackWidth: number;
  barGapWidth: number;
  dateLabelWidth: number;
  dateLabelPositions: string[];
  rotateDateLabels = true;

  lineGraphWidth: number;
  lineGraphHeight: number;
  linePath: string;
  lineDataCoords: Point[];

  barHovered = false;

  @ViewChild('dataGrid', { static: true }) dataGrid: ElementRef;
  @ViewChild('xAxis', { static: true }) xAxis: ElementRef;

  constructor(private decimals: DecimalPipe) { }

  @Input() set data(data: any) {
    if (!this.isCombinedChart()) {
      this.barData = data;
      this.lineData = null;
    } else {
      this.barData = data.hours;
      this.lineData = data.money;
    }
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'data') {
        this.init();
        this.needRecalc = true;
      }
    }
  }

  ngAfterViewChecked() {
    if (this.needRecalc) {
      setTimeout(() => {
        this.calculateDimensions();
        this.setDataLabelPositions();
        this.buildLineDataPath();
      }, 0); // tick
    }
  }

  private init() {
    this.maxBarTotal = 0;
    // this.barTotals = [];

    for (const dayBarData of this.barData) {
      let dayTotal = 0;
      for (const task of dayBarData.series) {
        dayTotal += task.value;
      }
      // this.barTotals.push(dayTotal)
      this.maxBarTotal = Math.max(this.maxBarTotal, dayTotal);
    }


    this.yAxisLabels = [];

    if (!this.isMoneyChart()) {
      this.yBarHeight = this.maxBarTotal > 12 ? 2 : 1;
      for (let i = 1; i < this.maxBarTotal; i++) {
        if (this.maxBarTotal > 12 && (i % 2 === 1)) {
          continue;
        }

        const label = i + (i === 1 ? ' hr' : ' hrs');
        this.yAxisLabels.push(label);
      }
    } else if (this.isMoneyChart() && this.maxBarTotal >= 1) {
      const order = (Math.floor(this.maxBarTotal) + '').length - 1;
      const showHalfOrders = parseFloat((this.maxBarTotal + '').charAt(0)) < 5;
      this.yBarHeight = Math.pow(10, order);
      if (showHalfOrders) {
        this.yBarHeight /= 2;
      }

      for (let nextBar = this.yBarHeight; nextBar < this.maxBarTotal; nextBar += this.yBarHeight) {
        this.yAxisLabels.push('$' + nextBar);
      }
    }

    if (this.isCombinedChart()) {
      this.maxLineTotal = 0;
      for (const lineDataPoint of this.lineData[0].series) {
        this.maxLineTotal = Math.max(this.maxLineTotal, lineDataPoint.value);
      }
    }

    this.lineGraphWidth = null;
    this.lineGraphHeight = null;
    this.linePath = '';
  }

  getBarHeightPercent(barValue: number, totalValue: number): string {
    return (barValue * 100 / totalValue) + '%';
  }

  onBarHovered(event: MouseEvent) {
    this.barHovered = true;

    const dataGridDimensions = (this.dataGrid.nativeElement as HTMLElement).getBoundingClientRect();
    const barElement = event.currentTarget as HTMLElement;
    const barDimensions = barElement.getBoundingClientRect();
    const tooltipElement = barElement.getElementsByClassName('bar-tooltip')[0] as HTMLElement;
    const tooltipDimensions = tooltipElement.getBoundingClientRect();

    const rem = parseFloat(window.getComputedStyle(tooltipElement).fontSize);

    let top = Math.max(rem, barDimensions.top);
    if (((top + tooltipDimensions.height) > window.innerHeight) && tooltipDimensions.height < window.innerHeight) {
      top = window.innerHeight - tooltipDimensions.height - rem;
    }
    if (((top + tooltipDimensions.height) > dataGridDimensions.bottom) && tooltipDimensions.height < window.innerHeight) {
      top = dataGridDimensions.bottom - tooltipDimensions.height - rem;
    }
    tooltipElement.style.top = top + 'px';


    if ((window.innerWidth - barDimensions.right + 2 * rem) > tooltipDimensions.width) {
      tooltipElement.style.left = (barDimensions.right + rem) + 'px';
    } else if ((barDimensions.left + 2 * rem) > tooltipDimensions.width) {
      tooltipElement.style.left = (barDimensions.left - 2 * rem - tooltipDimensions.width) + 'px';
    } else {
      tooltipElement.style.left = rem + 'px';
    }

  }

  onBarUnhovered() {
    this.barHovered = false;
  }

  onBarStackHovered(event: MouseEvent, dayIndex: number) {
    if (this.isCombinedChart()) {
      const barStackElement = (event.currentTarget as HTMLElement);
      const tooltipElement = barStackElement.getElementsByClassName('bar-tooltip')[0] as HTMLElement;
      const tooltipDimensions = tooltipElement.getBoundingClientRect();

      tooltipElement.style.top = event.pageY + 'px';

      let left = event.pageX + 16;
      if ((left + tooltipDimensions.width > window.innerWidth)) {
        left = event.pageX - tooltipDimensions.width - 16;
        if (left < 0) {
          left = 16;
        }
      }
      tooltipElement.style.left = left + 'px';

    }
  }

  private calculateDimensions() {
    if (this.maxBarTotal > 0) {
      const firstDataStack = this.dataGrid.nativeElement.querySelector('.data-bar-stack');
      const dataStackstyle = firstDataStack.currentStyle || window.getComputedStyle(firstDataStack);
      this.barStackWidth = firstDataStack.offsetWidth; // + parseFloat(dataStackstyle.marginRight);
      this.barGapWidth = parseFloat(dataStackstyle.marginRight);

      this.dateLabelWidth = 6 * parseFloat(dataStackstyle.fontSize); // 6rem

      this.lineGraphHeight = this.dataGrid.nativeElement.offsetHeight;
    }
    //  else {
    //   this.needRecalc = false;
    // }
  }

  private setDataLabelPositions() {
    if (this.needRecalc) {
      this.rotateDateLabels = this.dateLabelWidth > (this.barStackWidth + this.barGapWidth);
      this.dateLabelPositions = [];
      for (let i = 0; i < this.barData.length; i++) {
        this.dateLabelPositions.push(i * (this.barStackWidth + this.barGapWidth) + 'px');
      }
    }

    // this.needRecalc = false;
  }

  isHourChart(): boolean {
    return this.chartType === ReportType.HOURS;
  }

  isMoneyChart(): boolean {
    return this.chartType === ReportType.MONEY;
  }

  isCombinedChart(): boolean {
    return this.chartType === ReportType.COMBINED;
  }

  getBarTooltipText(projectName: string, barValue: number, dayIndex: number): string {
    const projectDesc = projectName === 'no project' ? 'with no project' : 'for ' + projectName + ' project';
    let valueDesc = '';
    if (this.isHourChart() || this.isCombinedChart()) {
      valueDesc = `I last ${this.decimals.transform(barValue, '1.0-2')}  ${barValue === 1 ? 'hr' : 'hrs'}`;
    } else if (this.isMoneyChart()) {
      valueDesc = `I'm worth $${this.decimals.transform(barValue, '1.0-2')}`;
    }
    if (this.isCombinedChart()) {
      const dayMoneyTotal = this.lineData[0].series[dayIndex].value;
      valueDesc += `.\nYou earned ${dayMoneyTotal === 0 ? 'no money' : '$' + this.decimals.transform(dayMoneyTotal, '1.0-2')} this day`;
    }
    return `Hi! I'm a task ${projectDesc}.\n ${valueDesc}`;
  }

  getBarStackTooltipText(dayIndex: number) {
    const dayMoneyTotal = this.lineData[0].series[dayIndex].value;
    return `You earned ${dayMoneyTotal === 0 ? 'no money' : '$' + this.decimals.transform(dayMoneyTotal, '1.0-2')} this day`;
  }

  showLineGraph(): boolean {
    return this.isCombinedChart() && (this.maxBarTotal > 0);
  }

  buildLineDataPath() {
    if (!this.needRecalc) {
      return;
    }
    if (this.isCombinedChart() && this.dateLabelPositions && this.dateLabelPositions.length !== 0) {
      this.lineGraphWidth = this.dateLabelPositions.length * (this.barStackWidth + this.barGapWidth) - this.barGapWidth;
      const fullWidth = this.lineGraphWidth; //this.dateLabelPositions.length * (this.barStackWidth + this.barGapWidth) - this.barGapWidth;
      const vectorLength = this.xCoord(this.barStackWidth, fullWidth);

      this.lineDataCoords = [];

      let x1 = this.xCoord(this.barStackWidth / 2, fullWidth);
      let y1 = this.yCoord(this.lineData[0].series[0].value, this.maxLineTotal);

      this.lineDataCoords.push({x: x1, y: y1});
      let x2 = this.xCoord(this.barStackWidth * 1.5 + this.barGapWidth, fullWidth);
      let y2 = this.yCoord(this.lineData[0].series[1].value, this.maxLineTotal);
      this.lineDataCoords.push({x: x2, y: y2});
      let result = 'M ' + x1 + ',' + y1 +                           // initial point
                  'C' + (x1 + vectorLength) + ',' + y1 + ',' +     // first bezier handle
                        (x2 - vectorLength) + ',' + y2 + ',' +     // second bezier handle
                        x2 + ',' + y2;                             // second point

      for (let i = 2; i < this.lineData[0].series.length; i++) {
        x1 = x2;
        y1 = y2;
        x2 = this.xCoord( i * (this.barStackWidth + this.barGapWidth) + (this.barStackWidth / 2), fullWidth);
        y2 = this.yCoord(this.lineData[0].series[i].value, this.maxLineTotal);
        result += 'S' + (x2 - vectorLength) + ',' + y2 + ',' +      //second bezier handle. first one is assumed from previous point
                        x2 + ',' + y2;

        this.lineDataCoords.push({x: x2, y: y2});
      }

      this.linePath = result;
    }
    this.needRecalc = false;
  }

  private xCoord(value: number, totalValue: number): number {
    if (value === 0 || totalValue === 0) {
      return 0;
    }
    return Math.floor(value / totalValue * this.lineGraphWidth) ;
  }

  private yCoord(value: number, totalValue: number): number {
    if (value === 0 || totalValue === 0) {
      return this.lineGraphHeight - 2;
    }
    return 2 + Math.floor((1 - (value / totalValue)) * (this.lineGraphHeight - 4));
  }

}
