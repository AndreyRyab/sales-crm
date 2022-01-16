import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

import { MaterialService } from '../shared/classes/material.service';
import { AnalyticsPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('revenue') revenueRef!: ElementRef
  @ViewChild('orders') ordersRef!: ElementRef

  aSub!: Subscription;
  avarage!: number;
  pending = true;

  constructor(private service: AnalyticsService) { };

  ngAfterViewInit() {
    const revenueConfig: any = {
      label: 'Revenue',
      color: 'rgb(255, 99, 132)',
    };

    const ordersConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)',
    };

    this.aSub = this.service.getAnalytics().subscribe({
      next: (data: AnalyticsPage) => {
        console.log(data);

        this.avarage = data.avarage;

        revenueConfig.labels = data.chart.map(item => item.label);
        revenueConfig.data = data.chart.map(item => item.revenue);


        const revenueContext = this.revenueRef.nativeElement.getContext('2d');
        revenueContext.canvas.height = '300px';

        new Chart(revenueContext, createChartConfig(revenueConfig));

        ordersConfig.labels = data.chart.map(item => item.label);
        ordersConfig.data = data.chart.map(item => item.revenue);

        const ordersContext = this.ordersRef.nativeElement.getContext('2d');
        ordersContext.canvas.height = '300px';

        new Chart(ordersContext, createChartConfig(ordersConfig));
      },
      error: error => MaterialService.toast(error.message),
      complete: () => {
        this.pending = false;
      },
    })
  };

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
};

function createChartConfig({ label, color, labels, data }: any): any {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        }
      ]
    },
  };
};
