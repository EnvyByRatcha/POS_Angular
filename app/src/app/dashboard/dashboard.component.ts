import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private http: HttpClient) {}

  incomePerDays: any[] = [];
  incomePerMonths: any[] = [];
  years: number[] = [];
  monthsName: string[] = [];
  days: number[] = [];
  dayjs: typeof dayjs = dayjs;
  year: number = dayjs().year();
  month: number = dayjs().month() + 1;
  chartDay: any;
  chartMonth: any;

  ngOnInit() {
    const totalDayInMonth = dayjs().daysInMonth();

    this.days = Array.from({ length: totalDayInMonth }, (_, i) => i + 1);
    this.years = Array.from({ length: 20 }, (_, i) => dayjs().year() - i);
    this.monthsName = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    this.fetchData();
  }

  fetchData() {
    this.fetchDataSumPerDayInYearAndMonth();
    this.fetchDataSumPerMonthInYear();
  }

  createBarChartDays() {
    let labels: number[] = [];
    let datas: number[] = [];

    for (let i = 0; i < this.incomePerDays.length; i++) {
      const item = this.incomePerDays[i];
      labels.push(i + 1);
      datas.push(item.amount);
    }

    if (this.chartDay) {
      this.chartDay.destroy();
    }

    const ctx = document.getElementById('chartPerDay') as HTMLCanvasElement;
    this.chartDay = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'รายรับต่อวัน',
            data: datas,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createBarChartMonths() {
    let datas: number[] = [];

    for (let i = 0; i < this.incomePerMonths.length; i++) {
      const item = this.incomePerMonths[i];
      datas.push(item.amount);
    }

    if (this.chartMonth) {
      this.chartMonth.destroy();
    }

    const ctx = document.getElementById('chartPerMonth') as HTMLCanvasElement;
    this.chartMonth = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthsName,
        datasets: [
          {
            label: 'รายรับต่อเดือน',
            data: datas,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  fetchDataSumPerDayInYearAndMonth() {
    try {
      const payload = {
        year: this.year,
        month: this.month,
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post(config.apiPath + '/api/report/sumPerDay', payload, {
          headers: headers,
        })
        .subscribe((res: any) => {
          this.incomePerDays = res.results;
          this.createBarChartDays();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSumPerMonthInYear() {
    try {
      const payload = {
        year: this.year,
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http
        .post(config.apiPath + '/api/report/sumPerMonth', payload, {
          headers: headers,
        })
        .subscribe((res: any) => {
          this.incomePerMonths = res.results;
          this.createBarChartMonths();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }
}
