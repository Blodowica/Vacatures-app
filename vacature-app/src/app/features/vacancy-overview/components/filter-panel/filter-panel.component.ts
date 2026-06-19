import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatBadge } from '@angular/material/badge';
import { FilterService } from '../../../../core/services/filter.service';
import { PersonnelTypeFilterComponent } from '../personnel-type-filter/personnel-type-filter.component';
import { RankFilterComponent } from '../rank-filter/rank-filter.component';
import { ScaleFilterComponent } from '../scale-filter/scale-filter.component';
import { FunctionDomainFilterComponent } from '../function-domain-filter/function-domain-filter.component';
import { LocationFilterComponent } from '../location-filter/location-filter.component';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    MatButton, MatIcon, MatDivider, MatBadge,
    PersonnelTypeFilterComponent,
    RankFilterComponent,
    ScaleFilterComponent,
    FunctionDomainFilterComponent,
    LocationFilterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
})
export class FilterPanelComponent {
  readonly filterService = inject(FilterService);
  readonly close = output<void>();
}
