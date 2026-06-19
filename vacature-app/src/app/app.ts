import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VacancyService } from './core/services/vacancy.service';
import { ApiErrorDialogComponent } from './core/components/api-error-dialog/api-error-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  private readonly vacancyService = inject(VacancyService);
  private readonly dialog = inject(MatDialog);
  private dialogRef?: MatDialogRef<ApiErrorDialogComponent>;

  constructor() {
    effect(() => {
      const error = this.vacancyService.loadError();
      if (error && !this.dialogRef) {
        this.dialogRef = this.dialog.open(ApiErrorDialogComponent, {
          data: { message: error },
          disableClose: true,
          width: '480px',
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = undefined;
        });
      }
    });
  }
}
