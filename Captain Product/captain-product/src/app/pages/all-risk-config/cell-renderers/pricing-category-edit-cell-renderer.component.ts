import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellEditorParams } from 'ag-grid-community';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxDropdownModule, NxDropdownComponent } from '@allianz/ng-aquila/dropdown';
import { CoveragePricingCategory } from '../../../services/product-template.service';

export interface PricingCategoryEditCellRendererParams<TData = unknown>
  extends ICellEditorParams<TData, CoveragePricingCategory> {
  options: { value: CoveragePricingCategory; label: string }[];
}

@Component({
  selector: 'app-pricing-category-edit-cell-renderer',
  standalone: true,
  imports: [FormsModule, NxFormfieldModule, NxDropdownModule],
  template: `
    <div class="pricing-category-edit-container">
      <nx-formfield appearance="outline" nxFloatLabel="never">
        <nx-dropdown
          [showFilter]="false"
          [panelGrow]="true"
          [(ngModel)]="value"
          (openedChange)="onOpenedChange($event)"
        >
          @for (option of options; track option.value) {
            <nx-dropdown-item [value]="option.value">{{ option.label }}</nx-dropdown-item>
          }
        </nx-dropdown>
      </nx-formfield>
    </div>
  `,
  styleUrl: './pricing-category-edit-cell-renderer.component.scss',
})
export class PricingCategoryEditCellRendererComponent implements ICellEditorAngularComp, AfterViewInit {
  private params!: PricingCategoryEditCellRendererParams;
  value: CoveragePricingCategory = 'not-priced';
  options: { value: CoveragePricingCategory; label: string }[] = [];

  @ViewChild(NxDropdownComponent) dropdown!: NxDropdownComponent;

  agInit(params: PricingCategoryEditCellRendererParams): void {
    this.params = params;
    this.value = params.value ?? 'not-priced';
    this.options = params.options;
  }

  ngAfterViewInit(): void {
    globalThis.setTimeout(() => this.dropdown.openPanel({ preventDefault: () => {} } as unknown as Event));
  }

  onOpenedChange(opened: boolean): void {
    if (opened) return;
    this.params.stopEditing();
    this.params.api.clearFocusedCell();
  }

  getValue(): CoveragePricingCategory {
    return this.value;
  }

  isPopup(): boolean {
    return false;
  }
}
