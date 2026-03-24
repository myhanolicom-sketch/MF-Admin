import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin-users/admin-users.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: AdminUsersComponent
  }
];

export const Module = {
  routes: adminRoutes
};
