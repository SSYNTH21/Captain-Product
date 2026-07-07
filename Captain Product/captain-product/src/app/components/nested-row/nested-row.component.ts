import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparisonRow } from '../../data/comparison.model';
import { CellValueComponent } from '../cell-value/cell-value.component';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-nested-row',
  standalone: true,
  imports: [CommonModule, CellValueComponent],
  template: `
    @if (visible()) {
      <div class="cu-nested-head">
        <div class="cu-indent"></div>
        <div class="cu-head-label">{{ row.label }}</div>
      </div>
      <div class="cu-row-nested">
        <div class="cu-indent"></div>
        <div class="cu-cell cu-cell-label">{{ row.label }}</div>
        <div class="cu-cell cu-cell-value">
          <app-cell-value [cell]="row.v1" />
        </div>
        <div class="cu-cell cu-cell-v2">
          <app-cell-value [cell]="row.v2" />
        </div>
        <div class="cu-cell cu-cell-trailing"></div>
      </div>
    }
  `,
  styleUrl: './nested-row.component.scss'
})
export class NestedRowComponent {
  @Input({ required: true }) row!: ComparisonRow;

  private filter = inject(FilterService);

  visible = computed(() => {
    if (!this.row.unchanged) return true;
    return !this.filter.changesOnly();
  });
}
