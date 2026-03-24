import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './app/admin.component';
import { adminRoutes } from './app/admin.routes';

bootstrapApplication(AdminComponent, {
  providers: [
    provideRouter(adminRoutes)
  ]
}).catch(err => console.error(err));
