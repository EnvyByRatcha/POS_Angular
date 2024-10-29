import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import dayjs from 'dayjs';
import config from '../../config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-sale',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-sale.component.html',
  styleUrl: './report-sale.component.css',
})
export class ReportSaleComponent {
  constructor(private http: HttpClient) {}

  ddlYear: number[] = [];
  ddlMonth: string[] = [];
  data: any[] = [];
  year: number = dayjs().year();
  month: number = dayjs().month() + 1;
  dayjs: typeof dayjs = dayjs;

  ngOnInit() {
    this.ddlYear = this.getYear();
    this.ddlMonth = this.getMonth();

    this.fetchData();
  }

  fetchData() {
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
        this.data = res.results;
      });
  }

  getYear() {
    const currentYear = dayjs().year();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  getMonth() {
    const months = [
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

    return months;
  }
}
