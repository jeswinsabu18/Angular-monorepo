
import { Component, Input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-custom-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './custom-chart.component.html',
  styleUrl: './custom-chart.component.css',
})
export class CustomChartComponent {
  @Input({ required: true })
  public options!: EChartsCoreOption;

  @Input()
  public height = '380px';

  @Input()
  public ariaLabel = 'Data visualization';
}
