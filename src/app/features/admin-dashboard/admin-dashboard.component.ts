import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { signal } from '@angular/core';
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
export class AdminDashboardComponent implements OnInit {
  filterForm!: FormGroup;

  estadosList = [
    { key: 'generadoOk', label: 'Generado OK', severity: 'success' },
    { key: 'enviado', label: 'Enviado', severity: 'info' },
    { key: 'errorEnviar', label: 'Error al enviar', severity: 'danger' },
    { key: 'errorGenerar', label: 'Error al generar', severity: 'danger' }
  ];

  archivosList = ['MO', 'MD', 'ME', 'FL'];

  reportData = signal<ReportData[]>([
    { fechaHora: '01/02/2026 10:15', archivo: 'MO', estado: 'generadoOk' },
    { fechaHora: '01/02/2026 10:15', archivo: 'MD', estado: 'errorEnviar' },
    { fechaHora: '01/02/2026 10:15', archivo: 'ME', estado: 'enviado' },
    { fechaHora: '01/02/2026 10:15', archivo: 'FL', estado: 'errorGenerar' },
    { fechaHora: '02/02/2026 11:30', archivo: 'MO', estado: 'generadoOk' },
    { fechaHora: '02/02/2026 12:45', archivo: 'MD', estado: 'enviado' }
  ]);

  filteredData = signal<ReportData[]>([]);

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      estados: this.fb.array(this.estadosList.map(() => false)),
      archivos: this.fb.array(this.archivosList.map(() => false))
    });

    // Subscribe a cambios de formulario
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
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
    const [h, m] = hora ? hora.split(':').map(Number) : [0, 0];
    return new Date(anio, mes - 1, dia, h, m);
  }

  applyFilters(): void {
    const { fechaDesde, fechaHasta, estados, archivos } = this.filterForm.value;

    const estadosSeleccionados = this.estadosList
      .filter((_, i) => estados[i])
      .map(e => e.key);

    const archivosSeleccionados = this.archivosList
      .filter((_, i) => archivos[i]);

    const result = this.reportData().filter(item => {
      const itemDate = this.parseFechaHora(item.fechaHora);
      const matchesFecha = 
        (!fechaDesde || itemDate >= new Date(fechaDesde)) &&
        (!fechaHasta || itemDate <= new Date(fechaHasta));
      
      const matchesEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(item.estado);
      const matchesArchivo = archivosSeleccionados.length === 0 || archivosSeleccionados.includes(item.archivo);
      
      return matchesFecha && matchesEstado && matchesArchivo;
    });

    this.filteredData.set(result);
  }

  onClear(): void {
    this.filterForm.reset({
      fechaDesde: null,
      fechaHasta: null,
      estados: this.estadosList.map(() => false),
      archivos: this.archivosList.map(() => false)
    });
  }

  getEstadoLabel(estado: string): string {
    const item = this.estadosList.find(e => e.key === estado);
    return item ? item.label : estado;
  }

  getEstadoSeverity(estado: string): string {
    const item = this.estadosList.find(e => e.key === estado);
    return item ? item.severity : 'secondary';
  }

  exportToExcel(): void {
    const data = this.filteredData().map(item => ({
      'Fecha/Hora': item.fechaHora,
      'Archivo': item.archivo,
      'Estado': this.getEstadoLabel(item.estado)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monitoreo');
    
    // Ajustar ancho de columnas
    ws['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 20 }];
    
    XLSX.writeFile(wb, 'Reporte_Monitoreo.xlsx');
  }
}
