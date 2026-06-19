import { Component, inject, effect, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatIcon, MatIconButton, MatPrefix, MatSuffix],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private readonly filterService = inject(FilterService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => this.filterService.searchQuery.set(val ?? ''));

    effect(() => {
      const q = this.filterService.searchQuery();
      if (q !== this.searchControl.value) {
        this.searchControl.setValue(q, { emitEvent: false });
      }
    });
  }

  clear(): void {
    this.searchControl.setValue('');
    this.filterService.searchQuery.set('');
  }
}
