import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { Router, RouterLink }           from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject }                      from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// Angular Material
import { MatTableModule }    from '@angular/material/table';
import { MatButtonModule }   from '@angular/material/button';
import { MatIconModule }     from '@angular/material/icon';
import { MatInputModule }    from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog }     from '@angular/material/dialog';
import { MatChipsModule }    from '@angular/material/chips';
import { MatTooltipModule }  from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule }    from '@angular/material/badge';

import { Employee }          from '../../models/employee.model';
import { EmployeeService }   from '../../services/employee.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[]   = [];
  isLoading               = false;
  searchControl           = new FormControl('');
  displayedColumns        = ['name', 'email', 'department', 'position', 'salary', 'hire_date', 'status', 'actions'];
  private destroy$        = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private snackBar:        MatSnackBar,
    private dialog:          MatDialog,
    private router:          Router,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    // Real-time search with 400ms debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((term) => this.loadEmployees(term ?? ''));
  }

  loadEmployees(search = ''): void {
    this.isLoading = true;
    this.employeeService.getEmployees(search).subscribe({
      next:  (data) => { this.employees = data; this.isLoading = false; },
      error: (err)  => {
        this.showSnackbar('Failed to load employees: ' + err.message, 'error');
        this.isLoading = false;
      },
    });
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  confirmDelete(employee: Employee): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title:   'Delete Employee',
        message: `Are you sure you want to delete <strong>${employee.first_name} ${employee.last_name}</strong>? This action cannot be undone.`,
      },
      panelClass: 'confirm-dialog-panel',
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) this.deleteEmployee(employee.id!);
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next:  () => {
        this.employees = this.employees.filter((e) => e.id !== id);
        this.showSnackbar('Employee deleted successfully', 'success');
      },
      error: (err) => this.showSnackbar('Delete failed: ' + err.message, 'error'),
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  countByStatus(status: string): number {
    return this.employees.filter((e) => e.status === status).length;
  }

  getAvatarColor(name: string): string {
    const colors = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#3b82f6','#10b981'];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  }

  getStatusClass(status: string): string {
    return {
      'Active':   'status-active',
      'Inactive': 'status-inactive',
      'On Leave': 'status-leave',
    }[status] ?? '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '✕', {
      duration: 4000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
