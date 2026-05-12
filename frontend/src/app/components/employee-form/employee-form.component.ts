import { Component, OnInit }   from '@angular/core';
import { CommonModule }          from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule }       from '@angular/material/progress-spinner';
import { MatDividerModule }    from '@angular/material/divider';

import { Employee, DEPARTMENTS, EMPLOYEE_STATUSES } from '../../models/employee.model';
import { EmployeeService }     from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './employee-form.component.html',
  styleUrls:  ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode    = false;
  employeeId?: number;
  isLoading     = false;
  isSaving      = false;

  departments   = DEPARTMENTS;
  statuses      = EMPLOYEE_STATUSES;
  maxDate       = new Date();

  constructor(
    private fb:              FormBuilder,
    private employeeService: EmployeeService,
    private route:           ActivatedRoute,
    private router:          Router,
    private snackBar:        MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.employeeId = this.route.snapshot.params['id']
      ? +this.route.snapshot.params['id']
      : undefined;

    this.isEditMode = !!this.employeeId;

    if (this.isEditMode && this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  buildForm(): void {
    this.employeeForm = this.fb.group({
      first_name:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      last_name:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email:       ['', [Validators.required, Validators.email]],
      phone:       ['', [Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
      department:  ['', Validators.required],
      position:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      salary:      [0, [Validators.required, Validators.min(0), Validators.max(99999999)]],
      hire_date:   ['', Validators.required],
      status:      ['Active', Validators.required],
    });
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (emp) => {
        const hireDate = emp.hire_date ? new Date(emp.hire_date) : '';
        this.employeeForm.patchValue({ ...emp, hire_date: hireDate });
        this.isLoading = false;
      },
      error: (err) => {
        this.showSnackbar('Failed to load employee: ' + err.message, 'error');
        this.isLoading = false;
        this.router.navigate(['/employees']);
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = { ...this.employeeForm.value };

    // Format date to YYYY-MM-DD
    if (formValue.hire_date instanceof Date) {
      const d = formValue.hire_date;
      formValue.hire_date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, formValue)
      : this.employeeService.createEmployee(formValue);

    request$.subscribe({
      next: () => {
        this.showSnackbar(
          this.isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!',
          'success'
        );
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.showSnackbar(err.message, 'error');
        this.isSaving = false;
      },
    });
  }

  // ── Form helpers ──────────────────────────────────────────────────────────
  getError(field: string): string {
    const ctrl = this.employeeForm.get(field);
    if (!ctrl || !ctrl.touched || !ctrl.errors) return '';
    if (ctrl.errors['required'])   return 'This field is required';
    if (ctrl.errors['email'])      return 'Enter a valid email address';
    if (ctrl.errors['minlength'])  return `Minimum ${ctrl.errors['minlength'].requiredLength} characters`;
    if (ctrl.errors['maxlength'])  return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters`;
    if (ctrl.errors['min'])        return 'Value cannot be negative';
    if (ctrl.errors['pattern'])    return 'Enter a valid phone number';
    return 'Invalid value';
  }

  isInvalid(field: string): boolean {
    const ctrl = this.employeeForm.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '✕', {
      duration: 4000,
      panelClass: type === 'success' ? ['snack-success'] : ['snack-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
