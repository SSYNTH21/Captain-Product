import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxCheckboxComponent } from '@allianz/ng-aquila/checkbox';

export interface CheckboxCellRendererParams<TData = unknown> extends ICellRendererParams<TData, boolean> {
  onChange: (data: TData, checked: boolean) => void;
  ariaLabel: (data: TData) => string;
}

@Component({
  selector: 'app-directory-checkbox-cell-renderer',
  standalone: true,
  imports: [NxCheckboxComponent],
  template: `
    <nx-checkbox [checked]="checked" (checkedChange)="onCheckedChange($event)" [ariaLabel]="ariaLabel"> </nx-checkbox>
  `,
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  private params!: CheckboxCellRendererParams;
  checked = false;
  ariaLabel = '';

  agInit(params: CheckboxCellRendererParams): void {
    this.params = params;
    this.checked = params.value === true;
    this.ariaLabel = params.ariaLabel(params.data);
  }

  refresh(params: CheckboxCellRendererParams): boolean {
    this.params = params;
    this.checked = params.value === true;
    this.ariaLabel = params.ariaLabel(params.data);
    return true;
  }

  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.params.onChange(this.params.data, checked);
  }
}
