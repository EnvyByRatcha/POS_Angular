import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-report-sale-per-month',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-sale-per-month.component.html',
  styleUrl: './report-sale-per-month.component.css',
})
export class ReportSalePerMonthComponent {
  constructor(private http: HttpClient) {}

  ddlYear: number[] = [];
  year: number = dayjs().year();
  data: any[] = [];

  ngOnInit() {
    this.ddlYear = Array.from({ length: 10 }, (_, i) => this.year - i);
    this.fetchData();
  }

  fetchData() {
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
          this.data = res.results;
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
