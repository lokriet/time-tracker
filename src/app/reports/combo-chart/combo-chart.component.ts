import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { BaseChartComponent, calculateViewDimensions, ColorHelper, ViewDimensions } from '@swimlane/ngx-charts';
import { scaleBand, scaleLinear } from 'd3-scale';

import { DataEntry, formatHours, ReportsDataService } from '../reports-data.service';



@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.component.html',
  styleUrls: ['./combo-chart.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
          transform: '*',
        }),
        animate(500, style({opacity: 0, transform: 'scale(0)'}))
      ])
    ])
  ]
})
export class ComboChartComponent extends BaseChartComponent {
  @Input() legendTitle = 'Legend';
  @Input() legendPosition = 'bottom';
  @Input() xAxisLabel;
  @Input() gradient: boolean;
  @Input() showGridLines = true;
  @Input() activeEntries: any[] = [];
  @Input() schemeType: string;
  @Input() trimXAxisTicks = false;
  @Input() trimYAxisTicks = false;
  @Input() rotateXAxisTicks = true;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() xAxisTicks: any[];
  @Input() yAxisTicks: any[];
  @Input() barPadding = 8;
  @Input() roundDomains = false;
  @Input() dataLabelFormatting: any;
  @Input() noBarWhenZero = true;
  @Input() lineResults: DataEntry[];

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate', {static: true}) tooltipTemplate: TemplateRef<any>;

  constructor(protected chartElement: ElementRef,
              protected zone: NgZone,
              protected cd: ChangeDetectorRef,
              private reportsDataService: ReportsDataService) {
    super(chartElement, zone, cd);
  }

  dims: ViewDimensions;
  groupDomain: any[];
  innerDomain: any[];
  valueDomain: any[];
  xScale: any;
  yScale: any;
  transform: string;
  halfBarTransform: string;
  tickFormatting: (label: string) => string;
  colors: ColorHelper;
  margin = [10, 20, 10, 20];
  xAxisHeight = 0;
  legendOptions: any;
  dataLabelMaxHeight: any = {negative: 0, positive: 0};

  scaledResults: any[];
  scaledLineResults: any[];
  xSet: string[];
  hoveredVertical: any; // the value of the x axis that is hovered over

  update(): void {
    super.update();

    let maxResultsTotal = (this.results as DataEntry[]).map(el =>
      el.series.map(seriesEl => seriesEl.value).reduce((sum, seriesElValue) => sum += seriesElValue, 0)
    ).reduce((max, seriesTotal) => Math.max(max, seriesTotal));

    if (maxResultsTotal === 0) {
      maxResultsTotal = 1;
    }

    this.scaledResults = (this.results as DataEntry[]).map(el => { return { name: el.name, series:
      el.series.map(seriesEl => {
        return { name: seriesEl.name, value: seriesEl.value / maxResultsTotal
      }; })
    }; }
    );


    let maxLineResult = this.lineResults[0].series.map(el => el.value)
                                                            .reduce((max, seriesEl) => Math.max(max, seriesEl));

    if (maxLineResult === 0) {
      maxLineResult = 1;
    }

    this.scaledLineResults = this.lineResults.map(el => { return { name: el.name, series:
      el.series.map(seriesEl => {
        return { name: seriesEl.name, value: seriesEl.value / maxLineResult
      }; })
    }; }
    );

    this.xSet = [];
    for (let moneyEntry of this.lineResults[0].series) {
      this.xSet.push(moneyEntry.name);
    }


    this.dataLabelMaxHeight = {negative: 0, positive: 0};
    this.margin = [10 + this.dataLabelMaxHeight.positive, 20, 10 + this.dataLabelMaxHeight.negative, 20];

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: true,
      showYAxis: false,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: 0,
      showXLabel: true,
      showYLabel: false,
      showLegend: true,
      legendType: this.schemeType,
      legendPosition: this.legendPosition
    });

    this.groupDomain = this.getGroupDomain();
    this.innerDomain = this.getInnerDomain();
    this.valueDomain = this.getValueDomain();

    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${ this.dims.xOffset } , ${ this.margin[0] + this.dataLabelMaxHeight.negative })`;
    this.halfBarTransform = `translate(${ this.dims.xOffset + Math.round(this.xScale.bandwidth() / 2) },
                                       ${ this.margin[0] + this.dataLabelMaxHeight.negative })`;
  }

  getGroupDomain() {
    const domain = [];
    for (const group of this.results) {
      if (!domain.includes(group.name)) {
        domain.push(group.name);
      }
    }
    return domain;
  }

  getInnerDomain() {
    const domain = [];
    for (const group of this.results) {
      for (const d of group.series) {
        if (!domain.includes(d.name)) {
          domain.push(d.name);
        }
      }
    }
    return domain;
  }

  getValueDomain() {
    return [0, 1];
  }

  getXScale(): any {
    const spacing = this.groupDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .domain(this.groupDomain);
  }

  getYScale(): any {
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.valueDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  onDataLabelMaxHeightChanged(event, groupIndex) {
    if (event.size.negative)  {
      this.dataLabelMaxHeight.negative = Math.max(this.dataLabelMaxHeight.negative, event.size.height);
    } else {
      this.dataLabelMaxHeight.positive = Math.max(this.dataLabelMaxHeight.positive, event.size.height);
    }
    if (groupIndex === (this.results.length - 1)) {
      setTimeout(() => this.update());
    }
  }

  groupTransform(group) {
    return `translate(${this.xScale(group.name)}, 0)`;
  }

  onClick(data, group?) {
    if (group) {
      data.series = group.name;
    }

    this.select.emit(data);
  }

  trackBy(index, item) {
    return item.name;
  }

  setColors(): void {
    let domain;
    if (this.schemeType === 'ordinal') {
      domain = this.innerDomain;
    } else {
      domain = this.valueDomain;
    }

    this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
  }

  getLegendOptions() {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
      position: this.legendPosition
    };
    if (opts.scaleType === 'ordinal') {
      opts.domain = this.innerDomain;
      opts.colors = this.colors;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.valueDomain;
      opts.colors = this.colors.scale;
    }

    return opts;
  }

  updateXAxisHeight({height}) {
    this.xAxisHeight = height;
    this.update();
  }

  onActivate(event, group?) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [ item, ...this.activeEntries ];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(event, group?) {
    const item = Object.assign({}, event);
    if (group) {
      item.series = group.name;
    }

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }

  updateHoveredVertical(item): void {
    this.hoveredVertical = item.value;
  }

  @HostListener('mouseleave')
  hideCircles(): void {
    this.hoveredVertical = null;
  }

  formatHours(item) {
    return formatHours(item);
  }

  getHoveredBars(): any[] {
    return (this.results as DataEntry[]).find((result => result.name === this.hoveredVertical)).series;
  }

  formatDate(dateString: string): string {
    return this.reportsDataService.formatDate(dateString);
  }
}
