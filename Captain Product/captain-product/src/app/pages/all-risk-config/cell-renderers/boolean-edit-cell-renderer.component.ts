import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellEditorParams } from 'ag-grid-community';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxDropdownModule, NxDropdownComponent } from '@allianz/ng-aquila/dropdown';

export interface BooleanEditCellRendererParams<TData = unknown> extends ICellEditorParams<TData, boolean | null> {
  trueLabel: string;
  falseLabel: string;
}

@Component({
  selector: 'app-boolean-edit-cell-renderer',
  standalone: true,
  imports: [FormsModule, NxFormfieldModule, NxDropdownModule],
  template: `
    <div class="boolean-edit-container">
      <nx-formfield appearance="outline" nxFloatLabel="never">
        <nx-dropdown
          [showFilter]="false"
          [panelGrow]="true"
          [(ngModel)]="value"
          (openedChange)="onOpenedChange($event)"
        >
          <nx-dropdown-item [value]="true">{{ trueLabel }}</nx-dropdown-item>
          <nx-dropdown-item [value]="false">{{ falseLabel }}</nx-dropdown-item>
        </nx-dropdown>
      </nx-formfield>
    </div>
  `,
  styleUrl: './boolean-edit-cell-renderer.component.scss',
})
export class BooleanEditCellRendererComponent implements ICellEditorAngularComp, AfterViewInit {
  private params!: BooleanEditCellRendererParams;
  value: boolean | null = null;
  trueLabel = '';
  falseLabel = '';

  @ViewChild(NxDropdownComponent) dropdown!: NxDropdownComponent;

  agInit(params: BooleanEditCellRendererParams): void {
    this.params = params;
    this.value = params.value ?? null;
    this.trueLabel = params.trueLabel;
    this.falseLabel = params.falseLabel;
  }

  ngAfterViewInit(): void {
    globalThis.setTimeout(() => this.dropdown.openPanel({ preventDefault: () => {} } as unknown as Event));
  }

  onOpenedChange(opened: boolean): void {
    if (opened) return;
    this.params.stopEditing();
    this.params.api.clearFocusedCell();
  }

  getValue(): boolean | null {
    return this.value;
  }

  isPopup(): boolean {
    return false;
  }
}
