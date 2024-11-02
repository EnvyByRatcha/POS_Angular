import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import config from '../../config';
import Swal from 'sweetalert2';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-bill-sale',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './bill-sale.component.html',
  styleUrl: './bill-sale.component.css',
})
export class BillSaleComponent {
  constructor(private http: HttpClient) {}

  billSales: any[] = [];
  startDate: string = dayjs().startOf('month').format('YYYY-MM-DD');
  endDate: string = dayjs().endOf('month').add(1, 'day').format('YYYY-MM-DD');
  dayjs = dayjs;
  fileName: string = '';

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const payload = {
      startDate: new Date(this.startDate),
      endDate: new Date(this.endDate),
    };

    this.http
      .post(config.apiPath + '/api/billSale/list', payload)
      .subscribe((res: any) => {
        this.billSales = res.results;
      });
  }

  async remove(id: number) {
    const button = await Swal.fire({
      title: 'ลบรายการ',
      text: 'ต้องการลบรายการนี้ใช่หรือไม่',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (button.isConfirmed) {
      this.http
        .delete(config.apiPath + '/api/billSale/remove/' + id)
        .subscribe((res: any) => {
          this.fetchData();
        });
    }
  }

  selectInvoice(item: any) {
    this.fileName = item.invoice;

    const btnPrintBill = document.getElementById(
      'btnPrintBill'
    ) as HTMLButtonElement;
    btnPrintBill.click();
    
    this.printBill();
  }

  printBill() {
    try {
      console.log(this.fileName);
      setTimeout(() => {
        const iframe = document.getElementById(
          'pdf-frame'
        ) as HTMLIFrameElement;
        iframe?.setAttribute('src', config.apiPath + '/' + this.fileName);
      }, 500);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }
}
