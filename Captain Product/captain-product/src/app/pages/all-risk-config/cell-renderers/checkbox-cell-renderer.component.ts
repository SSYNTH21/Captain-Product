import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxCheckboxComponent } from '@allianz/ng-aquila/checkbox';

export interface CheckboxCellRendererParams<TData = unknown> extends ICellRendererParams<TData, boolean> {
  onChange: (data: TData, checked: boolean) => void;
  ariaLabel: (data: TData) => string;
  readonly?: (data: TData) => boolean;
}

@Component({
  selector: 'app-checkbox-cell-renderer',
  standalone: true,
  imports: [NxCheckboxComponent],
  template: `
    <nx-checkbox
      [checked]="checked"
      [readonly]="readonly"
      (checkedChange)="onCheckedChange($event)"
      [ariaLabel]="ariaLabel">
    </nx-checkbox>
  `,
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  private params!: CheckboxCellRendererParams;
  checked = false;
  ariaLabel = '';
  readonly = false;

  agInit(params: CheckboxCellRendererParams): void {
    this.params = params;
    this.checked = params.value === true;
    this.ariaLabel = params.ariaLabel(params.data);
    this.readonly = params.readonly?.(params.data) === true;
  }

  refresh(params: CheckboxCellRendererParams): boolean {
    this.params = params;
    this.checked = params.value === true;
    this.ariaLabel = params.ariaLabel(params.data);
    this.readonly = params.readonly?.(params.data) === true;
    return true;
  }

  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.params.onChange(this.params.data, checked);
  }
}
