import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { ModalComponent } from '../modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ModalComponent, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  constructor(private http: HttpClient) {}

  users: any[] = [];

  name: String = '';
  username: string = '';
  password: string = '';
  level: string = 'employee';
  id: number = 0;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    try {
      this.http.get(config.apiPath + '/api/user/list').subscribe((res: any) => {
        this.users = res.results;
      });
    } catch (e: any) {
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
        username: this.username,
        password: this.password,
        level: this.level,
      };

      if (this.id > 0) {
        this.http
          .put(config.apiPath + '/api/user/update/' + this.id, payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'เพิ่มผู้ใช้งาน',
                text: 'เพิ่มผู้ใช้งานสำเร็จ',
                icon: 'success',
                timer: 2000,
              });
              this.fetchData();
              document.getElementById('modalUser_btnClose')?.click();
            }
          });
      } else {
        this.http
          .post(config.apiPath + '/api/user/create', payload)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'เพิ่มผู้ใช้งาน',
                text: 'เพิ่มผู้ใช้งานสำเร็จ',
                icon: 'success',
                timer: 2000,
              });

              this.fetchData();
              document.getElementById('modalUser_btnClose')?.click();
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

  async remove(id: number) {
    try {
      const button = await Swal.fire({
        title: 'ลบผู้ใช้งาน',
        text: 'ยินยันลบผู้ใช้งาน ใช้หรือไม่',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (button.isConfirmed) {
        this.http
          .delete(config.apiPath + '/api/user/remove/' + id)
          .subscribe((res: any) => {
            if (res.message == 'success') {
              Swal.fire({
                title: 'ลบผู้ใช้งาน',
                text: 'ลบผู้ใช้งานสำเร็จ',
                icon: 'success',
                timer: 2000,
              });

              this.fetchData();
              document.getElementById('modalUser_btnClose')?.click();
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

  selectedUser(item: any) {
    this.id = item.id;
    this.name = item.name;
    this.username = item.username;
    this.level = item.level;
  }

  clearForm() {
    this.id = 0;
    this.name = '';
    this.username = '';
    this.level = 'employee';
  }
}
