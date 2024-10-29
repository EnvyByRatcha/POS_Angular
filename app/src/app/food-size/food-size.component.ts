import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { HttpClient } from '@angular/common/http';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css',
})
export class FoodSizeComponent {
  constructor(private http: HttpClient) {}

  foodSizes: any = [];
  foodTypes: any = [];
  id: number = 0;
  name: string = '';
  price: number = 0;
  remark: string = '';
  foodTypeId: number = 0;

  ngOnInit() {
    this.fetchDataFoodType();
    this.fetchDataFoodSize();
  }

  fetchDataFoodType() {
    this.http
      .get(config.apiPath + '/api/foodType/list')
      .subscribe((res: any) => {
        this.foodTypes = res.results;
        this.foodTypeId = this.foodTypes[0].id;
      });
  }

  fetchDataFoodSize() {
    try {
      this.http
        .get(config.apiPath + '/api/foodSize/list')
        .subscribe((res: any) => {
          this.foodSizes = res.results;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fetchDataSelectedFoodSize(){
    try {
      this.http.get(config.apiPath+'/api/foodSize/filter/'+this.foodTypeId).subscribe((res:any)=>{
        this.foodSizes = res.results;
      })
    } catch (e:any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  save() {
    try {
      const payload = {
        name: this.name,
        price: this.price,
        remark: this.remark,
        id: this.id,
        foodTypeId: this.foodTypeId,
      };

      if (this.id > 0) {
        this.http
          .put(config.apiPath + '/api/foodSize/update', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'แก้ไขข้อมูล',
                text: 'แก้ไขข้อมูลเสร็จสิ้น',
                icon: 'success',
                timer: 2000,
              });
              this.fetchDataFoodSize();
              document.getElementById('modalFoodSize_btnClose')?.click();
            }
          });
      } else {
        this.http
          .post(config.apiPath + '/api/foodSize/create', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'เพิ่มข้อมูล',
                text: 'เพิ่มข้อมูลเสร็จสิ้น',
                icon: 'success',
                timer: 2000,
              });
              this.fetchDataFoodSize();
              document.getElementById('modalFoodSize_btnClose')?.click();
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

  clearForm() {
    this.id = 0;
    this.name = '';
    this.price = 0;
    this.remark = '';
    this.foodTypeId = this.foodTypes[0].id;
  }

  async remove(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบข้อมูลขนาดอาหาร',
        text: 'ยืนยันลบข้อมูลขนาดอาหารใช่หรือไม่',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiPath + '/api/foodSize/remove/' + item.id)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'ลบข้อมูลขนาดอาหาร',
                text: 'ลบข้อมูลขนาดอาหารสำเร็จ',
                icon: 'success',
                timer: 2000,
              });

              this.fetchDataFoodSize();
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

  selectId(item:any){
    this.id = item.id;
    this.name = item.name;
    this.price = item.addMoney;
    this.remark = item.remark;
    this.foodTypeId = item.foodTypeId;
  }
}
