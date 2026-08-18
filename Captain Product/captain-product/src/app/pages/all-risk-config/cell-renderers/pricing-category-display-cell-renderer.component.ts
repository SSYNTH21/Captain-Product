import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxBadgeModule } from '@allianz/ng-aquila/badge';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { CoveragePricingCategory } from '../../../services/product-template.service';

export interface PricingCategoryDisplayCellRendererParams<TData = unknown>
  extends ICellRendererParams<TData, CoveragePricingCategory> {
  isEditable: (data: TData | undefined) => boolean;
  label: (value: CoveragePricingCategory) => string;
  badgeType: (value: CoveragePricingCategory) => 'active' | 'negative' | undefined;
}

@Component({
  selector: 'app-pricing-category-display-cell-renderer',
  standalone: true,
  imports: [CommonModule, NxBadgeModule, NxIconModule],
  template: `
    <div class="pricing-category-chip-container">
      <div class="badge-container">
        @if (value) {
          <nx-badge [type]="badgeType()" class="wrap-badge-text">{{ label() }}</nx-badge>
        } @else {
          <span>—</span>
        }
      </div>
      <div class="chevron-icon" [class.chevron-icon--readonly]="!isEditable">
        <nx-icon name="chevron-down" aria-hidden="true" size="s" class="icon-chevron-down"></nx-icon>
      </div>
    </div>
  `,
  styleUrl: './pricing-category-display-cell-renderer.component.scss',
})
export class PricingCategoryDisplayCellRendererComponent implements ICellRendererAngularComp {
  private params!: PricingCategoryDisplayCellRendererParams;
  value: CoveragePricingCategory | null = null;
  isEditable = false;

  agInit(params: PricingCategoryDisplayCellRendererParams): void {
    this.params = params;
    this.value = params.value ?? null;
    this.isEditable = params.isEditable(params.data);
  }

  refresh(params: PricingCategoryDisplayCellRendererParams): boolean {
    this.params = params;
    this.value = params.value ?? null;
    this.isEditable = params.isEditable(params.data);
    return true;
  }

  label(): string {
    return this.value ? this.params.label(this.value) : '';
  }

  badgeType(): 'active' | 'negative' | undefined {
    return this.value ? this.params.badgeType(this.value) : undefined;
  }
}
