import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users">
      <h2>Gestión de Usuarios</h2>
      
      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button (click)="editUser(user)">Editar</button>
                <button (click)="deleteUser(user.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users {
      padding: 1rem;
    }
    
    h2 {
      color: #333;
      margin-bottom: 2rem;
    }
    
    .users-table {
      background: white;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: #f8f9fa;
    }
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    
    tr:hover {
      background: #f8f9fa;
    }
    
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    
    button:hover {
      background: #5568d3;
    }
  `]
})
export class AdminUsersComponent {
  users = signal<User[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User' }
  ]);

  editUser(user: User) {
    console.log('Editando usuario:', user);
  }

  deleteUser(id: number) {
    this.users.update(users => users.filter(u => u.id !== id));
  }
}
