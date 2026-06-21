import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { VacancyService } from '../../services/vacancy.service';

@Component({
  selector: 'app-api-error-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-wrapper" data-cy="api-error-dialog">
      <div class="dialog-header">
        <mat-icon class="error-icon">cloud_off</mat-icon>
        <h2 mat-dialog-title>Verbinding mislukt</h2>
      </div>

      <mat-dialog-content>
        <p class="error-message">{{ data.message }}</p>
        <p class="error-hint">
          Je kunt de applicatie toch gebruiken door de lokale voorbeelddata te laden.
          Let op: dit zijn demo-gegevens, geen actuele vacatures.
        </p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close data-cy="dismiss-error">Sluiten</button>
        <button mat-flat-button color="primary" data-cy="load-mock-data" (click)="loadMockData()">
          <mat-icon>storage</mat-icon>
          Laad mock data
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper {
      padding: 8px;
      max-width: 440px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;
    }

    .error-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #f44336;
      flex-shrink: 0;
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 20px;
    }

    .error-message {
      color: #333;
      margin-bottom: 12px;
    }

    .error-hint {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    mat-dialog-actions {
      gap: 8px;
      padding-top: 8px;
    }
  `],
})
export class ApiErrorDialogComponent {
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ApiErrorDialogComponent>);
  private readonly vacancyService = inject(VacancyService);

  loadMockData(): void {
    this.vacancyService.loadMockData();
    this.dialogRef.close();
  }
}
