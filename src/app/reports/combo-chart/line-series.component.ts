import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColorHelper, ViewDimensions } from '@swimlane/ngx-charts';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';

@Component({
  selector: 'g[app-line-series]',
  template: `
      <svg:path
        [@animationState]="'active'"
        class="line"
        [attr.d]="path"
        [attr.fill]="fill"
        [attr.stroke]="stroke"
        stroke-width="3px"
      />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          strokeDasharray: 2000,
          strokeDashoffset: 2000,
        }),
        animate(1000, style({
          strokeDashoffset: 0
        }))
      ])
    ])
  ]
})
export class LineSeriesComponent implements OnChanges, OnInit {

  path;
  stroke;
  @Input() data;
  fill = 'none';
  animations = true;
  @Input() xScale;
  @Input() yScale;
  @Input() colors: ColorHelper;
  @Input() dims: ViewDimensions;
  curve = curveMonotoneX;

  clipPathId: string;
  clipPath: string;

  halfBarWidth: number;
  firstXValue: number;
  lastXValue: number;

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePathEl();
  }

  updatePathEl(): void {
    const lineGen = this.getLineGenerator();
    this.stroke = this.colors.getColor(this.data.name);
    let pathSeries = [];

    if (this.data.series.length) {
      pathSeries = this.data.series.slice(0);
      this.halfBarWidth = this.xScale.bandwidth() / 2;
      this.firstXValue = this.xScale(this.data.series[0].name);
      this.lastXValue = this.xScale(this.data.series[this.data.series.length - 1].name);

      pathSeries.unshift({name: 'start', value: this.data.series[0].value});
      pathSeries.push({name: 'end', value: this.data.series[this.data.series.length - 1].value});
    }

    this.path = lineGen(pathSeries) || '';

    this.halfBarWidth = Math.round(this.halfBarWidth);

    const node = select(this.element.nativeElement).select('.line');

    if (this.animations) {
      node
        .transition().duration(750)
        .attr('d', this.path);
    } else {
      node.attr('d', this.path);
    }
  }

  getLineGenerator(): any {
    return line<any>()
      .x(d => {
          if (d.name === 'start') {
            return this.firstXValue - this.halfBarWidth;
          }
          if (d.name === 'end') {
            return this.lastXValue + this.halfBarWidth;
          }
          return this.xScale(d.name);
        })
      .y(d => this.yScale(d.value))
      .curve(this.curve);
  }
}
