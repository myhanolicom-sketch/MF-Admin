import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface ReportData {
  fechaHora: string;
  archivo: string;
  estado: 'generadoOk' | 'enviado' | 'errorEnviar' | 'errorGenerar';
  acciones?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    FieldsetModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    BadgeModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {


  users = signal<User[]>([
    { id: 1, name: 'MO', email: 'Generado OK', role: 'Admin' },
    { id: 2, name: 'MD', email: 'Error al enviar', role: 'User' },
    { id: 3, name: 'ME', email: 'Enviado', role: 'User' }
  ]);

  editUser(user: User) {
    console.log('Editando usuario:', user);
  }

  deleteUser(id: number) {
    this.users.update((users: User[]) => users.filter((u: User) => u.id !== id));
  }

 filterForm: FormGroup;
  
  // Estados disponibles
  estados = [
    { key: 'generadoOk', label: 'Generado OK', color: 'success', selected: false },
    { key: 'enviado', label: 'Enviado', color: 'info', selected: false },
    { key: 'errorEnviar', label: 'Error al enviar', color: 'danger', selected: false },
    { key: 'errorGenerar', label: 'Error al generar', color: 'danger', selected: false }
  ];

  // Tipos de archivos
  archivos = [
    { id: 'MO', label: 'MO', checked: false },
    { id: 'MD', label: 'MD', checked: false },
    { id: 'ME', label: 'ME', checked: false },
    { id: 'FL', label: 'FL', checked: false }
  ];

  // Datos de la tabla
  reportData: ReportData[] = [
    { fechaHora: '01/02/2026 10:15', archivo: 'MO', estado: 'generadoOk' },
    { fechaHora: '01/02/2026 10:15', archivo: 'MD', estado: 'errorEnviar' },
    { fechaHora: '01/02/2026 10:15', archivo: 'ME', estado: 'enviado' },
    { fechaHora: '01/02/2026 10:15', archivo: 'FL', estado: 'errorGenerar' }
  ];

  // Paginación
  currentPage = 1;
  pageSize = 100;
  totalRecords = 0;
  filteredData: ReportData[] = [];

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get paginatedData(): ReportData[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null]
    });

    this.filteredData = [...this.reportData];
    this.totalRecords = this.filteredData.length;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  private parseFechaHora(fechaHora: string): Date {
    // Formato dd/MM/yyyy HH:mm
    const [fecha, hora] = fechaHora.split(' ');
    const [dia, mes, anio] = fecha.split('/').map(v => parseInt(v, 10));
    const [horaNum, minNum] = hora ? hora.split(':').map(v => parseInt(v, 10)) : [0, 0];
    return new Date(anio, mes - 1, dia, horaNum, minNum);
  }

  private applyFilters(): void {
    const fechaDesde: Date | null = this.filterForm.value.fechaDesde;
    const fechaHasta: Date | null = this.filterForm.value.fechaHasta;
    const estadosSeleccionados = this.estados.filter(e => e.selected).map(e => e.key);
    const archivosSeleccionados = this.archivos.filter(a => a.checked).map(a => a.id);

    this.filteredData = this.reportData.filter(item => {
      const itemDate = this.parseFechaHora(item.fechaHora);

      const matchesDate = (!fechaDesde || itemDate >= fechaDesde) && (!fechaHasta || itemDate <= fechaHasta);
      const matchesEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(item.estado);
      const matchesArchivo = archivosSeleccionados.length === 0 || archivosSeleccionados.includes(item.archivo);

      return matchesDate && matchesEstado && matchesArchivo;
    });

    this.totalRecords = this.filteredData.length;
    this.currentPage = 1;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onClear(): void {
    this.filterForm.reset({
      fechaDesde: null,
      fechaHasta: null
    });
    this.estados.forEach(estado => estado.selected = false);
    this.archivos.forEach(archivo => archivo.checked = false);
    this.applyFilters();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG pages are 0-based
  }

  getEstadoClass(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'generadoOk': 'badge-success',
      'enviado': 'badge-info',
      'errorEnviar': 'badge-danger',
      'errorGenerar': 'badge-danger'
    };
    return estadoMap[estado] || 'badge-secondary';
  }

  getEstadoLabel(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'generadoOk': 'Generado OK',
      'enviado': 'Enviado',
      'errorEnviar': 'Error al enviar',
      'errorGenerar': 'Error al generar'
    };
    return estadoMap[estado] || estado;
  }

  getEstadoSeverity(estado: string): 'success' | 'info' | 'danger' | 'warn' | 'secondary' | 'contrast' {
    const severityMap: { [key: string]: 'success' | 'info' | 'danger' | 'warn' | 'secondary' | 'contrast' } = {
      'generadoOk': 'success',
      'enviado': 'info',
      'errorEnviar': 'danger',
      'errorGenerar': 'danger'
    };
    return severityMap[estado] || 'secondary';
  }

  viewDetail(item: ReportData): void {
    console.log('Ver detalle del item:', item);
    // Implementar lógica para ver detalle
  }

  downloadFile(item: ReportData): void {
    console.log('Descargar archivo:', item);
    // Implementar lógica para descargar archivo
  }
}
