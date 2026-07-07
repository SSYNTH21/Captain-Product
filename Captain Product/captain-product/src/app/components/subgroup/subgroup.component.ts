import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubGroup } from '../../data/comparison.model';
import { NestedRowComponent } from '../nested-row/nested-row.component';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-subgroup',
  standalone: true,
  imports: [CommonModule, NestedRowComponent],
  template: `
    @if (visible()) {
      <div class="cu-subgroup-header" (click)="toggle()">
        <div class="chevron-wrap">
          <svg [class.rotated]="!expanded()" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 15l6-6 6 6" stroke="#414141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="sg-label">{{ subgroup.label }}</div>
        <div class="sg-spacer"></div>
        <div class="sg-spacer"></div>
        <div class="sg-spacer"></div>
      </div>
      @if (expanded()) {
        <div class="cu-subgroup-body">
          @for (row of subgroup.rows; track row.label + $index) {
            <app-nested-row [row]="row" />
          }
        </div>
      }
    }
  `,
  styleUrl: './subgroup.component.scss'
})
export class SubgroupComponent {
  @Input({ required: true }) subgroup!: SubGroup;

  private filter = inject(FilterService);
  expanded = signal(true);

  visible = computed(() => {
    if (!this.subgroup.unchanged) return true;
    return !this.filter.changesOnly();
  });

  toggle() { this.expanded.update(v => !v); }
}
