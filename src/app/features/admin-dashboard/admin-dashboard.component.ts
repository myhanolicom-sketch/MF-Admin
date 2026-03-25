import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Panel de Administración</h2>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">120</div>
          <div class="stat-label">Archivos hoy</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">5/div>
          <div class="stat-label">Errores</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">15</div>
          <div class="stat-label">Reenviados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">15</div>
          <div class="stat-label">Regenerados</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
    }
    
    h2 {
      color: #333;
      margin-bottom: 2rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background: white;
      border-left: 4px solid #667eea;
      padding: 1.5rem;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class AdminDashboardComponent {}
