import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './app/admin.component';
import { adminRoutes } from './app/admin.routes';
import { providePrimeNG } from 'primeng/config';

bootstrapApplication(AdminComponent, {
  providers: [
    provideRouter(adminRoutes),
    providePrimeNG()
  ]
}).catch(err => console.error(err));
