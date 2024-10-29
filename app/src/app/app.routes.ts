import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { FoodSizeComponent } from './food-size/food-size.component';
import { TasteComponent } from './taste/taste.component';
import { FoodComponent } from './food/food.component';
import { SaleComponent } from './sale/sale.component';
import { OrganizationComponent } from './organization/organization.component';
import { BillSaleComponent } from './bill-sale/bill-sale.component';
import { ReportSaleComponent } from './report-sale/report-sale.component';
import { ReportSalePerMonthComponent } from './report-sale-per-month/report-sale-per-month.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
  },
  {
    path: 'foodtype',
    component: FoodTypeComponent,
  },
  {
    path: 'foodsize',
    component: FoodSizeComponent,
  },
  {
    path: 'taste',
    component: TasteComponent,
  },
  {
    path: 'food',
    component: FoodComponent,
  },
  {
    path: 'sale',
    component: SaleComponent,
  },
  {
    path: 'organization',
    component: OrganizationComponent,
  },
  { path: 'bill-sale', component: BillSaleComponent },
  {
    path: 'reportSale',
    component: ReportSaleComponent,
  },
  {
    path: 'reportSalePerMonth',
    component: ReportSalePerMonthComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: UserComponent,
  },
];
