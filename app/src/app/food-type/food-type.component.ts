import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css',
})
export class FoodTypeComponent {
  name: string = '';
  remark: string = '';
  foodTypes: any = [];
  id: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http
      .get(config.apiPath + '/api/foodType/list')
      .subscribe((res: any) => {
        this.foodTypes = res.results;
      });
  }

  clearForm() {
    this.name = '';
    this.remark = '';
    this.id = 0;
  }

  save() {
    try {
      const payload = {
        name: this.name,
        remark: this.remark,
        id: 0,
      };

      if (this.id > 0) {
        payload.id = this.id;
        this.http
          .put(config.apiPath + '/api/foodType/update', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'แก้ไขประเภทอาหาร',
                text: 'แก้ไขประเภทอาหารสำเร็จ',
                icon: 'success',
                timer: 2000,
              });
            }
            this.fetchData();
            this.id = 0;
            document.getElementById('modalFoodType_btnClose')?.click();
          });
      } else {
        this.http
          .post(config.apiPath + '/api/foodType/create', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'เพิ่มประเภทอาหาร',
                text: 'เพิ่มประเภทอาหารสำเร็จ',
                icon: 'success',
                timer: 2000,
              });

              this.fetchData();
              document.getElementById('modalFoodType_btnClose')?.click();
            }
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

  async remove(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบประเภทสินค้า',
        text: 'ยืนยันต้องการลบประเภทอาหาร ' + item.name + ' ใช่หรือไม่',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiPath + '/api/foodType/remove/' + item.id)
          .subscribe((res: any) => {
            Swal.fire({
              title: 'ลบประเภทสินค้า',
              text: 'ลบประเภทสินค้าเสร็จสิ้น',
              icon: 'success',
              timer: 2000,
            });

            this.fetchData();
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

  selectItem(item: any) {
    this.name = item.name;
    this.remark = item.remark;
    this.id = item.id;
  }
}
