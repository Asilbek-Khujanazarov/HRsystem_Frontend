import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from '../department.service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'; // Add MatMenuModule

// Dialog component for adding a new department
@Component({
  selector: 'app-add-department-dialog',
  template: `
    <h2 mat-dialog-title>Add New Department</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Department Name</mat-label>
        <input matInput [(ngModel)]="departmentName" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSave()" [disabled]="!departmentName">Save</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AddDepartmentDialogComponent {
  departmentName: string = '';

  constructor(private dialogRef: MatDialogRef<AddDepartmentDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({ departmentName: this.departmentName });
  }
}

// Dialog component for editing a department
@Component({
  selector: 'app-edit-department-dialog',
  template: `
    <h2 mat-dialog-title>Edit Department</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Department Name</mat-label>
        <input matInput [(ngModel)]="departmentName" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSave()" [disabled]="!departmentName">Save</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class EditDepartmentDialogComponent {
  departmentName: string;

  constructor(
    private dialogRef: MatDialogRef<EditDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentName: string }
  ) {
    this.departmentName = data.departmentName;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({ departmentName: this.departmentName });
  }
}

// Dialog component for delete confirmation
@Component({
  selector: 'app-delete-department-dialog',
  template: `
    <h2 mat-dialog-title>Delete Department</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete the department <strong>{{ departmentName }}</strong>?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="warn" (click)="onConfirm()">Delete</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class DeleteDepartmentDialogComponent {
  departmentName: string;

  constructor(
    private dialogRef: MatDialogRef<DeleteDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentName: string }
  ) {
    this.departmentName = data.departmentName;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule // Add MatMenuModule to imports
  ],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  errorMessage: string = '';

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        console.log('API Response:', departments);
        if (departments.length === 0) {
          this.errorMessage = 'No departments found';
        } else {
          this.errorMessage = '';
          this.dataSource.data = departments.map(d => ({
            departmentId: d.departmentId,
            name: d.departmentName
          }));
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load departments';
        console.error('Error fetching departments:', err);
      }
    });
  }

  applySearch(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchString = filter.toLowerCase();
      return data.name?.toLowerCase().includes(searchString);
    };
  }

  openAddDepartmentDialog(): void {
    const dialogRef = this.dialog.open(AddDepartmentDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departmentService.addDepartment(result).subscribe({
          next: () => {
            this.snackBar.open('Department added successfully', 'Close', { duration: 3000 });
            this.loadDepartments();
          },
          error: (err) => {
            this.snackBar.open('Failed to add department: ' + (err.error?.message || err.message), 'Close', { duration: 3000 });
            console.error('Error adding department:', err);
          }
        });
      }
    });
  }

  openEditDepartmentDialog(department: { departmentId: number; name: string }): void {
    const dialogRef = this.dialog.open(EditDepartmentDialogComponent, {
      width: '400px',
      data: { departmentName: department.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedDepartment = {
          departmentId: department.departmentId,
          departmentName: result.departmentName
        };
        this.departmentService.updateDepartment(updatedDepartment).subscribe({
          next: () => {
            this.snackBar.open('Department updated successfully', 'Close', { duration: 3000 });
            this.loadDepartments();
          },
          error: (err) => {
            this.snackBar.open('Failed to update department: ' + (err.error?.message || err.message), 'Close', { duration: 3000 });
            console.error('Error updating department:', err);
          }
        });
      }
    });
  }

  deleteDepartment(department: { departmentId: number; name: string }): void {
    const dialogRef = this.dialog.open(DeleteDepartmentDialogComponent, {
      width: '400px',
      data: { departmentName: department.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.departmentService.deleteDepartment(department.departmentId).subscribe({
          next: () => {
            this.snackBar.open('Department deleted successfully', 'Close', { duration: 3000 });
            this.loadDepartments();
          },
          error: (err) => {
            this.snackBar.open('Failed to delete department: ' + (err.error?.message || err.message), 'Close', { duration: 3000 });
            console.error('Error deleting department:', err);
          }
        });
      }
    });
  }
}