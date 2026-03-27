import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';

// PrimeNG
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';



interface ReportData {
  fechaHora: string;
  archivo: string;
  estado: 'generadoOk' | 'enviado' | 'errorEnviar' | 'errorGenerar';
  acciones?: string;
}


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    TagModule,
    DatePickerModule,
    TooltipModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  filterForm: FormGroup;

  estadosList = [
    { key: 'generadoOk', label: 'Generado OK' },
    { key: 'enviado', label: 'Enviado' },
    { key: 'errorEnviar', label: 'Error al enviar' },
    { key: 'errorGenerar', label: 'Error al generar' }
  ];

  archivosList = ['MO', 'MD', 'ME', 'FL'];

  reportData = signal<ReportData[]>([
    { fechaHora: '01/02/2026 10:15', archivo: 'MO', estado: 'generadoOk' },
    { fechaHora: '01/02/2026 10:15', archivo: 'MD', estado: 'errorEnviar' },
    { fechaHora: '01/02/2026 10:15', archivo: 'ME', estado: 'enviado' },
    { fechaHora: '01/02/2026 10:15', archivo: 'FL', estado: 'errorGenerar' }
  ]);


  // Paginación
  currentPage = 1;
  pageSize = 100;
  totalRecords = 0;
  filteredData = signal<ReportData[]>([]);

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get paginatedData(): ReportData[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredData().slice(startIndex, startIndex + this.pageSize);
  }

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      estados: this.fb.array(this.estadosList.map(() => false)),
      archivos: this.fb.array(this.archivosList.map(() => false))
    });

    this.filteredData.set(this.reportData());

    // 🔥 efecto reactivo automático
    effect(() => {
      this.filterForm.value;
      this.applyFilters();
    });
  }

  get estadosArray(): FormArray {
    return this.filterForm.get('estados') as FormArray;
  }

  get archivosArray(): FormArray {
    return this.filterForm.get('archivos') as FormArray;
  }

  private parseFechaHora(fechaHora: string): Date {
    const [fecha, hora] = fechaHora.split(' ');
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const [h, m] = hora.split(':').map(Number);
    return new Date(anio, mes - 1, dia, h, m);
  }

  applyFilters() {
    const { fechaDesde, fechaHasta, estados, archivos } = this.filterForm.value;

    const estadosSeleccionados = this.estadosList
      .filter((_, i) => estados[i])
      .map(e => e.key);

    const archivosSeleccionados = this.archivosList
      .filter((_, i) => archivos[i]);

    const result = this.reportData().filter(item => {
      const date = this.parseFechaHora(item.fechaHora);

      return (
        (!fechaDesde || date >= fechaDesde) &&
        (!fechaHasta || date <= fechaHasta) &&
        (estadosSeleccionados.length === 0 || estadosSeleccionados.includes(item.estado)) &&
        (archivosSeleccionados.length === 0 || archivosSeleccionados.includes(item.archivo))
      );
    });

    this.filteredData.set(result);
  }

  onClear() {
    this.filterForm.reset({
      fechaDesde: null,
      fechaHasta: null,
      estados: this.estadosList.map(() => false),
      archivos: this.archivosList.map(() => false)
    });
  }

  exportToExcel() {
    const data = this.filteredData().map(item => ({
      'Fecha/Hora': item.fechaHora,
      'Archivo': item.archivo,
      'Estado': item.estado
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monitoreo');
    XLSX.writeFile(wb, 'Reporte.xlsx');
  }
}