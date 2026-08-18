import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxLinkModule } from '@allianz/ng-aquila/link';

@Component({
  selector: 'app-name-link-cell-renderer',
  standalone: true,
  imports: [NxLinkModule],
  template: `
    <nx-link>
      <a href="#" onclick="return false;">{{ value }}</a>
    </nx-link>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    nx-link ::ng-deep a {
      white-space: normal;
      word-break: break-word;
    }
  `],
})
export class NameLinkCellRendererComponent implements ICellRendererAngularComp {
  value = '';

  agInit(params: ICellRendererParams<unknown, string>): void {
    this.value = params.value ?? '';
  }

  refresh(params: ICellRendererParams<unknown, string>): boolean {
    this.value = params.value ?? '';
    return true;
  }
}
