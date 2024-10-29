import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  token: string = '';
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.token = localStorage.getItem('token')!;
  }

  signIn() {
    if (this.username == '' || this.password == '') {
      Swal.fire({
        title: 'Fail to login',
        text: 'กรุณากรอก username และ password',
        icon: 'info',
      });
    } else {
      const payload = {
        username: this.username,
        password: this.password,
      };

      try {
        this.http.post(config.apiPath + '/api/user/signIn', payload).subscribe(
          (res: any) => {
            this.token = res.token;
            localStorage.setItem('token', this.token);
            localStorage.setItem('name', res.name);
            localStorage.setItem('id', res.id);

            location.reload();
          },
          (err: any) => {
            this.password=''
            Swal.fire({
              title: 'Fail to login',
              text: 'username or password is invalid',
              icon: 'error',
            });
          }
        );
      } catch (err: any) {
        Swal.fire({
          title: 'Fail to login',
          text: err.message,
          icon: 'error',
        });
      }
    }
  }
}
