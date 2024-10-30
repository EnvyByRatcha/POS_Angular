import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import config from '../../config';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css',
})
export class OrganizationComponent {
  constructor(private http: HttpClient) {}

  id: number = 0;
  name: string = '';
  address: String = '';
  phone: String = '';
  email: String = '';
  website: String = '';
  promptPay: String = '';
  logo: String = '';
  taxCode: String = '';

  myFile: any;
  logoPath: string = '';

  ngOnInit() {
    this.fetchDataOrganization();
  }

  fetchDataOrganization() {
    try {
      this.http
        .get(config.apiPath + '/api/organization/info')
        .subscribe((res: any) => {
          this.id = res.id;
          this.name = res.name;
          this.address = res.address;
          this.phone = res.phone;
          this.email = res.email;
          this.website = res.website;
          this.promptPay = res.promptPay;
          this.logo = res.logo;
          this.taxCode = res.taxCode;
          this.logoPath = config.apiPath + '/uploads/' + this.logo;
        });
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error',
      });
    }
  }

  async save() {
    const fileName = await this.upload();
    try {
      const payload = {
        id: this.id,
        name: this.name,
        address: this.address,
        phone: this.phone,
        email: this.email,
        website: this.website,
        promptPay: this.promptPay,
        logo: fileName,
        taxCode: this.taxCode,
      };

      this.http
        .post(config.apiPath + '/api/organization/save', payload)
        .subscribe((res: any) => {
          if (res.message == 'success') {
            Swal.fire({
              title: 'บันทึกข้อมูล',
              text: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success',
              timer: 2000,
            });

            document.getElementById('modalOrganize_btnClose')?.click();
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

  onFileChange(event: any) {
    if (event.target.files != null) {
      if (event.target.files.length > 0) {
        this.myFile = event.target.files[0];
      }
    }
  }

  async upload() {
    if (this.myFile !== undefined) {
      const formData = new FormData();
      formData.append('myFile', this.myFile);
      const url = config.apiPath + '/api/organization/upload';
      const res: any = await firstValueFrom(this.http.post(url, formData));

      return res.fileName;
    }
  }
}
