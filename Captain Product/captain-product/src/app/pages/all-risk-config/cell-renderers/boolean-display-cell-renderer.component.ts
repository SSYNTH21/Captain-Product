import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxIconModule } from '@allianz/ng-aquila/icon';

export interface BooleanDisplayCellRendererParams<TData = unknown> extends ICellRendererParams<TData, boolean | null> {
  trueLabel: string;
  falseLabel: string;
  isEditable: (data: TData | undefined) => boolean;
}

@Component({
  selector: 'app-boolean-display-cell-renderer',
  standalone: true,
  imports: [CommonModule, NxIconModule],
  template: `
    <div class="boolean-display-container">
      @if (value === null) {
        <span class="boolean-display-text">—</span>
      } @else {
        <span class="boolean-display-text">{{ label() }}</span>
      }
      <div class="chevron-icon" [class.chevron-icon--readonly]="!isEditable">
        <nx-icon name="chevron-down" aria-hidden="true" size="s" class="icon-chevron-down"></nx-icon>
      </div>
    </div>
  `,
  styleUrl: './boolean-display-cell-renderer.component.scss',
})
export class BooleanDisplayCellRendererComponent implements ICellRendererAngularComp {
  private params!: BooleanDisplayCellRendererParams;
  value: boolean | null = null;
  trueLabel = '';
  falseLabel = '';
  isEditable = false;

  agInit(params: BooleanDisplayCellRendererParams): void {
    this.params = params;
    this.value = params.value ?? null;
    this.trueLabel = params.trueLabel;
    this.falseLabel = params.falseLabel;
    this.isEditable = params.isEditable(params.data);
  }

  refresh(params: BooleanDisplayCellRendererParams): boolean {
    this.params = params;
    this.value = params.value ?? null;
    this.isEditable = params.isEditable(params.data);
    return true;
  }

  label(): string {
    return this.value ? this.trueLabel : this.falseLabel;
  }
}
