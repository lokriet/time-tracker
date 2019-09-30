import { DecimalPipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReportType } from '../reports.component';
import { trigger, transition, style, animate } from '@angular/animations';

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
  lineData: any[];
  // @Input() data: any[];
  @Input() chartType: string;

  barTotals: number[];
  maxBarTotal: number;
  yAxisLabels: string[]; // labels for y axis
  yBarHeight: number;

  // date labels positioning
  needRecalc = false;
  barStackWidth: number;
  dateLabelWidth: number;
  dateLabelPositions: string[];
  rotateDateLabels = true;

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
      }, 0); // tick
    }
  }

  private init() {
    this.maxBarTotal = 0;
    this.barTotals = [];

    for (const dayBarData of this.barData) {
      let dayTotal = 0;
      for (const task of dayBarData.series) {
        dayTotal += task.value;
      }
      this.barTotals.push(dayTotal)
      this.maxBarTotal = Math.max(this.maxBarTotal, dayTotal);
    }


    this.yAxisLabels = [];

    if (this.isHourChart()) {
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
  }

  getBarHeightPercent(barValue: number, totalValue: number): string {
    return (barValue * 100 / totalValue) + '%';
  }

  onBarHovered(event: MouseEvent) {
    const barElement = event.currentTarget as HTMLElement;
    const barDimensions = barElement.getBoundingClientRect();
    const tooltipElement = barElement.getElementsByClassName('bar-tooltip')[0] as HTMLElement;
    const tooltipDimensions = tooltipElement.getBoundingClientRect();

    const rem = parseFloat(window.getComputedStyle(tooltipElement).fontSize);

    if (barDimensions.top > (tooltipDimensions.height + 2 * rem) &&
        barDimensions.left > ((tooltipDimensions.width / 2) + rem)) {
          tooltipElement.style.top = (barDimensions.top - tooltipDimensions.height - rem) + 'px';
          tooltipElement.style.left = (barDimensions.left + (barDimensions.width / 2) - (tooltipDimensions.width / 2)) + 'px';
    } else {
      let top = Math.max(rem, barDimensions.top);
      if ((top + tooltipDimensions.height > window.innerHeight) && tooltipDimensions.height < window.innerHeight) {
        top = window.innerHeight - tooltipDimensions.height - rem;
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
  }

  private calculateDimensions() {
    const firstDataStack = this.dataGrid.nativeElement.querySelector('.data-bar-stack');
    const style = firstDataStack.currentStyle || window.getComputedStyle(firstDataStack);
    this.barStackWidth = firstDataStack.offsetWidth + parseFloat(style.marginRight);

    this.dateLabelWidth = 6 * parseFloat(style.fontSize); // 6rem
  }

  private setDataLabelPositions() {
    this.rotateDateLabels = this.dateLabelWidth > this.barStackWidth;
    this.dateLabelPositions = [];
    for (let i = 0; i < this.barData.length; i++) {
      this.dateLabelPositions.push(i * this.barStackWidth + 'px');
    }

    this.needRecalc = false;
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

  getBarTooltipText(projectName: string, value: number): string {
    const projectDesc = projectName === 'no project' ? 'with no project' : 'for ' + projectName + ' project';
    let valueDesc = '';
    if (this.isHourChart() || this.isCombinedChart) {
      valueDesc = `I last ${this.decimals.transform(value, '1.0-2')}  ${value === 1 ? 'hr' : 'hrs'}`;
    } else if (this.isMoneyChart()) {
      valueDesc = `I'm worth $${this.decimals.transform(value, '1.0-2')}`;
    }
    return `Hi! I'm a task ${projectDesc}. ${valueDesc}`;
  }

}
