import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import config from '../../config';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import swal from 'sweetalert';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css',
})
export class FoodComponent {
  constructor(private http: HttpClient) {}

  foods: any[] = [];
  foodTypes: any[] = [];
  foodTypeId: number = 0;

  id: number = 0;
  name: string = '';
  remark: any = '';
  price: number = 0;
  foodType: string = 'food';
  fileName: string = '';
  file: File | undefined = undefined;
  serverPath: string = '';
  img: string = '';

  ngOnInit() {
    this.fetchDataFoodType();
    this.fetchDataFood();
    this.serverPath = config.apiPath;
  }

  fetchDataFoodType() {
    try {
      this.http
        .get(config.apiPath + '/api/foodType/list')
        .subscribe((res: any) => {
          this.foodTypes = res.results;
          this.foodTypeId = this.foodTypes[0].id;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
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

  clearForm() {
    this.foodTypeId = this.foodTypes[0].id;
    this.id = 0;
    this.name = '';
    this.remark = '';
    this.price = 0;
    this.foodType = 'food';
    this.file = undefined;
    this.img = '';

    const img = document.getElementById('img') as HTMLInputElement;
    img.value = '';
  }

  selectId(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.remark = item.remark;
    this.price = item.price;
    this.foodTypeId = item.foodTypeId;
    this.foodType = item.foodType;
    this.img = item.img;

    const img = document.getElementById('img') as HTMLInputElement;
    img.value = '';
  }

  async remove(item: any) {
    try {
      const button = await Swal.fire({
        title: 'ลบรายการอาหาร',
        text: 'ยืนยันลบรายการ ' + item.name + ' ใช่หรือไม่?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiPath + '/api/food/remove/' + item.id)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'ลบรายการอาหาร',
                text: 'ลบรายการอาหารเสร็จสิ้น',
                icon: 'success',
                timer: 2000,
              });
              this.fetchDataFood();
              document.getElementById('modalFood_btnClose')?.click();
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

  async save() {
    try {
      const fileName = await this.uploadFile();

      const payload = {
        id: this.id,
        name: this.name,
        remark: this.remark,
        price: this.price,
        img: fileName,
        foodTypeId: this.foodTypeId,
        foodType: this.foodType,
      };

      if (this.id > 0) {
        this.http
          .put(config.apiPath + '/api/food/update', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'แก้ไขรายการอาหาร',
                text: 'แก้ไขรายการอาหารเสร็จสิ้น',
                icon: 'success',
                timer: 2000,
              });
              this.fetchDataFood();
              document.getElementById('modalFood_btnClose')?.click();
            }
          });
      } else {
        this.http
          .post(config.apiPath + '/api/food/create', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'เพิ่มรายการอาหาร',
                text: 'เพิ่มรายการอาหารเสร็จสิ้น',
                icon: 'success',
                timer: 2000,
              });
              this.fetchDataFood();
              document.getElementById('modalFood_btnClose')?.click();
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

  async uploadFile() {
    try {
      if (this.file !== undefined) {
        const formData = new FormData();
        formData.append('img', this.file);

        const res: any = await firstValueFrom(
          this.http.post(config.apiPath + '/api/food/upload', formData)
        );

        return res.fileName;
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  fileSelect(file: any) {
    if (file.files != undefined) {
      if (file.files.length > 0) {
        this.file = file.files[0];
      }
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
}
