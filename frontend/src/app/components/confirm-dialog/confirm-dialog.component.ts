import { Component, Inject }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { MatButtonModule }      from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule }        from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-icon">⚠️</div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button mat-dialog-close id="btn-cancel-delete" class="btn-cancel">Cancel</button>
        <button mat-raised-button [mat-dialog-close]="true" id="btn-confirm-delete" class="btn-confirm">
          <mat-icon>delete_outline</mat-icon> Delete
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper { padding: 1.5rem; background: #1e1e2e; border-radius: 16px; }
    .dialog-icon { font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; }
    h2 { color: #f1f5f9; text-align: center; margin: 0 0 1rem; font-size: 1.2rem; }
    p  { color: #94a3b8; text-align: center; line-height: 1.6; }
    mat-dialog-actions { gap: 0.75rem; padding-top: 1rem; }
    .btn-cancel  { color: #94a3b8 !important; border-color: #334155 !important; border-radius: 8px !important; }
    .btn-confirm { background: #ef4444 !important; color: #fff !important; border-radius: 8px !important; }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
}
