import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';

// PrimeNG 21
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DatePicker } from 'primeng/datepicker';
import { PrimeNG } from 'primeng/config';

// Definimos el tipo exacto que acepta p-tag
type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined;

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
    TagModule,
    DatePicker,
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
    { fechaHora: '01/02/2026 10:15', archivo: 'FL', estado: 'errorGenerar' }
  ]);

  filteredData = signal<ReportData[]>([]);

  constructor(private fb: FormBuilder,private primeng: PrimeNG) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.applyFilters();
    this.primeng.setTranslation({
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1 // El lunes como primer día
    });
  
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      estados: this.fb.array(this.estadosList.map(() => false)),
      archivos: this.fb.array(this.archivosList.map(() => false))
    });
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

  // CORRECCIÓN DE TIPADO PARA P-TAG
  getEstadoSeverity(estado: string): TagSeverity {
    const item = this.estadosList.find(e => e.key === estado);
    const severity = item ? item.severity : 'secondary';
    return severity as TagSeverity;
  }

  getEstadoLabel(estado: string): string {
    const item = this.estadosList.find(e => e.key === estado);
    return item ? item.label : estado;
  }

  applyFilters(): void {
    const { fechaDesde, fechaHasta, estados, archivos } = this.filterForm.value;
    const estadosSeleccionados = this.estadosList.filter((_, i) => estados[i]).map(e => e.key);
    const archivosSeleccionados = this.archivosList.filter((_, i) => archivos[i]);

    const result = this.reportData().filter(item => {
      const itemDate = this.parseFechaHora(item.fechaHora);
      const matchesFecha = (!fechaDesde || itemDate >= new Date(fechaDesde)) &&
                           (!fechaHasta || itemDate <= new Date(fechaHasta));
      const matchesEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(item.estado);
      const matchesArchivo = archivosSeleccionados.length === 0 || archivosSeleccionados.includes(item.archivo);
      return matchesFecha && matchesEstado && matchesArchivo;
    });
    this.filteredData.set(result);
  }

  private parseFechaHora(fechaHora: string): Date {
    const [fecha, hora] = fechaHora.split(' ');
    const [dia, mes, anio] = fecha.split('/').map(Number);
    const [h, m] = hora ? hora.split(':').map(Number) : [0, 0];
    return new Date(anio, mes - 1, dia, h, m);
  }

  onClear(): void {
    this.filterForm.patchValue({
      fechaDesde: null,
      fechaHasta: null,
      estados: this.estadosList.map(() => false),
      archivos: this.archivosList.map(() => false)
    });
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
    XLSX.writeFile(wb, 'Reporte_Monitoreo.xlsx');
  }
}