import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './app/admin.component';
import { adminRoutes } from './app/admin.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AdminComponent, {
  providers: [
    provideRouter(adminRoutes),
      provideAnimations(), 
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
}).catch(err => console.error(err));
