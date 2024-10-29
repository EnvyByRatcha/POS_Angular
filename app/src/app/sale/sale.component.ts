import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import config from '../../config';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent {
  constructor(private http: HttpClient) {}

  foods: any = [];
  saleTemps: any = [];
  foodSizes: any = [];
  serverPath: string = '';

  tableNo: number = 1;
  userId: number = 0;
  amount: number = 0;

  saleTempId: number = 0;
  foodName: string = '';
  saleTempDetail: any = [];
  tastes: any = [];

  foodId: number = 0;
  payType: string = 'cash';

  inputMoney: number = 0;
  returnMoney: number = 0;

  billForPayUrl: string = '';

  ngOnInit() {
    this.fetchDataFood();

    this.serverPath = config.apiPath;

    const userId = localStorage.getItem('id');
    if (userId !== null) {
      this.userId = parseInt(userId);
      this.fetchDataSaleTemp();
    }
  }

  fetchDataFood() {
    try {
      this.http.get(config.apiPath + '/api/food/list').subscribe((res: any) => {
        this.foods = res.results;
      });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSaleTemp() {
    try {
      this.http
        .get(config.apiPath + '/api/saleTemp/list/' + this.userId)
        .subscribe((res: any) => {
          this.saleTemps = res.results;

          for (let i = 0; i < this.saleTemps.length; i++) {
            const item = this.saleTemps[i];

            if (item.SaleTempDetail.length > 0) {
              item.qty = item.SaleTempDetail.length;
              item.disableQtyButton = true;
            }
          }

          this.computeAmount();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  saveSaleTemp(item: any) {
    try {
      const payload = {
        tableNo: this.tableNo,
        foodId: item.id,
        userId: this.userId,
        qty: 1,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/create', payload)
        .subscribe((res: any) => {
          if (res.message == 'success') {
            Swal.fire({
              title: 'เพิ่มอาหารในรายการ',
              text: 'เพิ่มอาหารเสร็จสิ้น',
              icon: 'success',
              timer: 2000,
            });
            this.fetchDataSaleTemp();
          }
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async clearAllSaleTemp() {
    const button = await Swal.fire({
      title: 'ล้างรายการอาหาร',
      text: 'ยืนยันล้างรายการอาหารทั้งหมดใช่ไหรือไม่ ??',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (button.isConfirmed) {
      this.http
        .delete(config.apiPath + '/api/saleTemp/clear/' + this.userId)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
        });
    }
  }

  async removeItem(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบ ' + item.Food.name,
        text: 'คุณต้องการลบรายการใช่หรือไม่',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(
            config.apiPath +
              '/api/saleTemp/remove/' +
              item.foodId +
              '/' +
              this.userId
          )
          .subscribe((res: any) => {
            this.fetchDataSaleTemp();
          });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  changeQty(id: number, style: string) {
    try {
      const payload = {
        id: id,
        style: style,
      };

      this.http
        .put(config.apiPath + '/api/saleTemp/changeQty', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTemp();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  chooseFoodSize(item: any) {
    let foodTypeId: number = item.Food.foodTypeId;
    this.saleTempId = item.id;
    this.foodName = item.Food.name;
    this.foodId = item.Food.id;

    this.fetchDataTaste(foodTypeId);

    try {
      this.http
        .get(config.apiPath + '/api/foodSize/filter/' + foodTypeId)
        .subscribe((res: any) => {
          this.foodSizes = res.results;
        });
      const payload = {
        foodId: item.foodId,
        qty: item.qty,
        saleTempId: item.id,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/createDetail', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSaleTempDetail() {
    this.http
      .get(
        config.apiPath + '/api/saleTemp/listSaleTempDetail/' + this.saleTempId
      )
      .subscribe((res: any) => {
        this.saleTempDetail = res.results;
      });
  }

  fetchDataTaste(foodTypeId: number) {
    try {
      this.http
        .get(config.apiPath + '/api/taste/listByFoodId/' + foodTypeId)
        .subscribe((res: any) => {
          this.tastes = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  selectedFoodSize(saleTempId: number, foodsizeId: number) {
    try {
      const payload = {
        saleTempId: saleTempId,
        foodSizeId: foodsizeId,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/updateFoodSize', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
          this.fetchDataSaleTemp();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  selectedTaste(saletempId: number, tasteId: number) {
    try {
      const payload = {
        saleTempId: saletempId,
        tasteId: tasteId,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/updateTaste', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  newSaleTempDetail() {
    try {
      const payload = {
        saleTempId: this.saleTempId,
        foodId: this.foodId,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/newSaleTempDetail', payload)
        .subscribe((res: any) => {
          this.fetchDataSaleTempDetail();
          this.fetchDataSaleTemp();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async removeSaleTempDetail(id: number) {
    try {
      const button = await Swal.fire({
        title: 'ยกเลิกรายการ',
        text: 'ยินยันยกเลิกรายการใช่หรือไม่',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiPath + '/api/saleTemp/removeSaleTempDetail' + id)
          .subscribe((res: any) => {
            this.fetchDataSaleTempDetail();
            this.fetchDataSaleTemp();
          });
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  computeAmount() {
    this.amount = 0;

    for (let i = 0; i < this.saleTemps.length; i++) {
      const item = this.saleTemps[i];
      const totalPerRow = item.qty * item.price;

      for (let j = 0; j < item.SaleTempDetail.length; j++) {
        this.amount += item.SaleTempDetail[j].addMoney;
      }
      this.amount += totalPerRow;
    }
  }

  filterFood() {
    this.filter('food');
  }
  filterDrink() {
    this.filter('drink');
  }
  filterAll() {
    this.fetchDataFood();
  }

  filter(foodType: string) {
    try {
      this.http
        .get(config.apiPath + '/api/food/filter/' + foodType)
        .subscribe((res: any) => {
          this.foods = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  selectedPayType(payType: string) {
    this.payType = payType;
  }

  getClassName(payType: string) {
    let cssClass = 'btn btn-block btn-lg';

    if (this.payType == payType) {
      cssClass += ' btn-secondary';
    } else {
      cssClass += ' btn-outline-secondary';
    }

    return cssClass;
  }

  getClassNameOfButton(inputMoney: number) {
    let cssClass = 'btn btn-block btn-lg';

    if (this.inputMoney == inputMoney) {
      cssClass += ' btn-secondary';
    } else {
      cssClass += ' btn-outline-secondary';
    }

    return cssClass;
  }

  changeInputMoney(inputMoney: number) {
    this.inputMoney = inputMoney;
    this.returnMoney = this.inputMoney - this.amount;
  }

  async endSale() {
    try {
      const payload = {
        userId: this.userId,
        inputMoney: this.inputMoney,
        amount: this.amount,
        returnMoney: this.returnMoney,
        payType: this.payType,
        tableNo: this.tableNo,
      };

      this.http
        .post(config.apiPath + '/api/saleTemp/endSale', payload)
        .subscribe((res: any) => {
          Swal.fire({
            title: 'จบการขาย',
            text: 'จบการขายสำเร็จ',
            icon: 'success',
            timer: 2000,
          });

          this.fetchDataSaleTemp();
          document.getElementById('modalEndSale_btnClose')?.click();
          this.clearForm();

          const btnPrintBill = document.getElementById(
            'btnPrintBill'
          ) as HTMLButtonElement;
          btnPrintBill.click();

          this.printBillAfterPay();
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  clearForm() {
    this.payType = 'cash';
    this.inputMoney = 0;
    this.returnMoney = 0;
    this.amount = 0;
  }

  async printBillBeforePay() {
    try {
      const payload = {
        userId: this.userId,
        tableNo: this.tableNo,
      };

      const url = config.apiPath + '/api/saleTemp/printBillBeforePay';
      const res: any = await firstValueFrom(this.http.post(url, payload));

      setTimeout(() => {
        this.billForPayUrl = config.apiPath + '/' + res.fileName;
        document
          .getElementById('pdf-frame')
          ?.setAttribute('src', this.billForPayUrl);
      }, 500);
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async printBillAfterPay() {
    try {
      const payload = {
        userId: this.userId,
        tableNo: this.tableNo,
      };

      const url = config.apiPath + '/api/saleTemp/printBillAfterPay';
      const res: any = await firstValueFrom(this.http.post(url, payload));

      setTimeout(() => {
        const iframe = document.getElementById(
          'pdf-frame'
        ) as HTMLIFrameElement;
        iframe?.setAttribute('src', config.apiPath + '/' + res.fileName);
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
