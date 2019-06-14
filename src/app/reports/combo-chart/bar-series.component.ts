import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { formatLabel } from '@swimlane/ngx-charts';

export enum D0Types {
  positive = 'positive',
  negative = 'negative'
}

@Component({
  selector: 'g[app-series-vertical]',
  templateUrl: './bar-series.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BarSeriesComponent implements OnChanges {
  @Input() dims;
  @Input() type = 'standard';
  @Input() series;
  @Input() xScale;
  @Input() yScale;
  @Input() colors;
  @Input() gradient: boolean;
  @Input() activeEntries: any[];
  @Input() seriesName: string;
  @Input() tooltipDisabled = true;
  @Input() animations = true;
  @Input() noBarWhenZero = true;

  @Output() select = new EventEmitter();
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();
  @Output() dataLabelHeightChanged = new EventEmitter();

  tooltipPlacement: string;
  tooltipType: string;

  bars: any;
  x: any;
  y: any;
  barsForDataLabels: Array<{ x: number; y: number; width: number; height: number; total: number; series: string }> = [];

  ngOnChanges(changes): void {
    this.update();
  }

  update(): void {
    this.updateTooltipSettings();
    let width;
    if (this.series.length) {
      width = this.xScale.bandwidth();
    }
    width = Math.round(width);
    const yScaleMin = Math.max(this.yScale.domain()[0], 0);

    const d0 = {
      [D0Types.positive]: 0,
      [D0Types.negative]: 0
    };
    let d0Type = D0Types.positive;

    let total;
    if (this.type === 'normalized') {
      total = this.series.map(d => d.value).reduce((sum, d) => sum + d, 0);
    }

    this.bars = this.series.map((d, index) => {
      let value = d.value;
      const label = d.name;
      const formattedLabel = formatLabel(label);
      d0Type = value > 0 ? D0Types.positive : D0Types.negative;

      const bar: any = {
        value,
        label,
        roundEdges: false,
        data: d,
        width,
        formattedLabel,
        height: 0,
        x: 0,
        y: 0
      };

      if (this.type === 'standard') {
        bar.height = Math.abs(this.yScale(value) - this.yScale(yScaleMin));
        bar.x = this.xScale(label);

        if (value < 0) {
          bar.y = this.yScale(0);
        } else {
          bar.y = this.yScale(value);
        }
      } else if (this.type === 'stacked') {
        const offset0 = d0[d0Type];
        const offset1 = offset0 + value;
        d0[d0Type] += value;

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === 'normalized') {
        let offset0 = d0[d0Type];
        let offset1 = offset0 + value;
        d0[d0Type] += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = (offset1 - offset0).toFixed(2) + '%';
      }

      bar.color = this.colors.getColor(label);

      return bar;
    });

    this.updateDataLabels();
  }

  updateDataLabels() {
    if (this.type === 'stacked') {
      this.barsForDataLabels = [];
      const section: any = {};
      section.series = this.seriesName;
      const totalPositive = this.series.map(d => d.value).reduce((sum, d) => (d > 0 ? sum + d : sum), 0);
      const totalNegative = this.series.map(d => d.value).reduce((sum, d) => (d < 0 ? sum + d : sum), 0);
      section.total = totalPositive + totalNegative;
      section.x = 0;
      section.y = 0;
      if (section.total > 0) {
        section.height = this.yScale(totalPositive);
      } else {
        section.height = this.yScale(totalNegative);
      }
      section.width = this.xScale.bandwidth();
      this.barsForDataLabels.push(section);
    } else {
      this.barsForDataLabels = this.series.map(d => {
        const section: any = {};
        section.series = this.seriesName ? this.seriesName : d.name;
        section.total = d.value;
        section.x = this.xScale(d.name);
        section.y = this.yScale(0);
        section.height = this.yScale(section.total) - this.yScale(0);
        section.width = this.xScale.bandwidth();
        return section;
      });
    }
  }

  updateTooltipSettings() {
    this.tooltipPlacement = this.tooltipDisabled ? undefined : 'top';
    this.tooltipType = this.tooltipDisabled ? undefined : 'tooltip';
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name && entry.series === d.series;
    });
    return item !== undefined;
  }

  onClick(data): void {
    this.select.emit(data);
  }

  trackBy(index, bar): string {
    return bar.label;
  }

  trackDataLabelBy(index, barLabel) {
    return index + '#' + barLabel.series + '#' + barLabel.total;
  }
}
