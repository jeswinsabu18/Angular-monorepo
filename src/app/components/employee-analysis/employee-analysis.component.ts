import { Component, computed, inject } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';

import { EmployeeService } from '../../services/employee.service';
import { ThemeService } from '../../services/theme.service';
import { PageShellComponent } from '../page-shell/page-shell.component';
import { CustomChartComponent } from '../ui-components/custom-chart/custom-chart.component';

interface AgeGroup {
  label: string;
  count: number;
}

@Component({
  selector: 'app-employee-analysis',
  standalone: true,
  imports: [PageShellComponent, CustomChartComponent],
  templateUrl: './employee-analysis.component.html',
  styleUrl: './employee-analysis.component.css',
})
export class EmployeeAnalysisComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly themeService = inject(ThemeService);

  public readonly departmentCounts = computed(() => {
    const counts = new Map<string, number>();

    for (const employee of this.employeeService.employees()) {
      const department = employee.employeeDepartment?.trim() || 'Unassigned';
      counts.set(department, (counts.get(department) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([department, count]) => ({ department, count }));
  });

  public readonly ageGroupCounts = computed<AgeGroup[]>(() => {
    const groups: AgeGroup[] = [
      { label: 'Under 20', count: 0 },
      { label: '20–29', count: 0 },
      { label: '30–39', count: 0 },
      { label: '40–49', count: 0 },
      { label: '50+', count: 0 },
    ];

    for (const employee of this.employeeService.employees()) {
      const age = Number(employee.employeeAge);

      if (!Number.isFinite(age) || age < 0) {
        continue;
      }

      if (age < 20) {
        groups[0].count++;
      } else if (age < 30) {
        groups[1].count++;
      } else if (age < 40) {
        groups[2].count++;
      } else if (age < 50) {
        groups[3].count++;
      } else {
        groups[4].count++;
      }
    }

    return groups.filter((group) => group.count > 0);
  });

  public readonly totalEmployees = computed(
    () => this.employeeService.employees().length,
  );

  private get chartColors() {
    return this.themeService.isDarkMode()
      ? {
          text: '#f1f5f9',
          secondaryText: '#cbd5e1',
          border: '#475569',
          surface: '#1f2937',
        }
      : {
          text: '#334155',
          secondaryText: '#475569',
          border: '#cbd5e1',
          surface: '#ffffff',
        };
  }

  public readonly chartOptions = computed<EChartsCoreOption>(() => {
    const departments = this.departmentCounts();
    const colors = this.chartColors;

    return {
      title: {
        text: 'Employees by Department',
        left: 'center',
        top: 4,
        textStyle: {
          color: colors.text,
          fontSize: 15,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text },
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: 38,
        right: 16,
        top: 55,
        bottom: 55,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: 'Department',
        nameTextStyle: {
          color: colors.secondaryText,
          padding: [8, 0, 0, 0],
        },
        data: departments.map((item) => item.department),
        axisLabel: {
          interval: 0,
          rotate: departments.length > 4 ? 25 : 0,
          color: colors.secondaryText,
          fontSize: 10,
        },
        axisLine: {
          lineStyle: { color: colors.border },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Employees',
        nameTextStyle: { color: colors.secondaryText },
        min: 0,
        minInterval: 1,
        axisLabel: { color: colors.secondaryText },
        axisLine: {
          lineStyle: { color: colors.border },
        },
        splitLine: {
          lineStyle: { color: colors.border },
        },
      },
      series: [
        {
          name: 'Employees',
          type: 'bar',
          data: departments.map((item) => item.count),
          barMaxWidth: 36,
          itemStyle: {
            color: '#007a8c',
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: colors.text,
            fontSize: 10,
          },
        },
      ],
    };
  });

  public readonly ageChartOptions = computed<EChartsCoreOption>(() => {
    const colors = this.chartColors;
    const ageGroups = this.ageGroupCounts();

    return {
      color: ['#007a8c', '#6366f1', '#f59e0b', '#ec4899', '#64748b'],
      title: {
        text: 'Employees by Age Group',
        left: 'center',
        top: 4,
        textStyle: {
          color: colors.text,
          fontSize: 15,
          fontWeight: 600,
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: colors.surface,
        borderColor: colors.border,
        textStyle: { color: colors.text },
        formatter: '{b}: {c} employees ({d}%)',
      },
      legend: {
        bottom: 0,
        left: 'center',
        type: 'scroll',
        textStyle: {
          color: colors.secondaryText,
          fontSize: 11,
        },
      },
      series: [
        {
          name: 'Age group',
          type: 'pie',
          radius: ['0%', '62%'],
          center: ['50%', '49%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: colors.surface,
            borderWidth: 2,
            borderRadius: 4,
          },
          label: {
            show: true,
            color: colors.text,
            formatter: '{d}%',
            fontSize: 11,
          },
          labelLine: {
            show: true,
            length: 8,
            length2: 6,
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          data: ageGroups.map((group) => ({
            name: group.label,
            value: group.count,
          })),
        },
      ],
    };
  });
}