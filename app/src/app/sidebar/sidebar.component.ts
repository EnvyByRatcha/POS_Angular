import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import config from '../../config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private http: HttpClient, private router: Router) {}

  name: string = '';
  level: string = '';

  ngOnInit() {
    this.name = localStorage.getItem('name')!;
    this.getLevelFromToken();
  }

  async signOut() {
    const button = await Swal.fire({
      title: 'ออกจากระบบ',
      text: 'ยืนยันการออกจากระบบใช่หรือไม่',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (button.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');

      this.router.navigate(['/']).then(()=>{
        window.location.reload()
      });
      
     
    }
  }

  getLevelFromToken() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(config.apiPath + '/api/user/getLevelFromToken', {
        headers: headers,
      })
      .subscribe((res: any) => {
        this.level = res.level;
      });
  }
}
