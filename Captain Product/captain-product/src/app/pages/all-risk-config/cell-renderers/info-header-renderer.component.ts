import { Component } from '@angular/core';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxPlainButtonComponent } from '@allianz/ng-aquila/button';
import { NxPopoverModule } from '@allianz/ng-aquila/popover';

export interface InfoHeaderRendererParams extends IHeaderParams {
  infoText: string;
}

@Component({
  selector: 'app-info-header-renderer',
  standalone: true,
  imports: [NxIconModule, NxPlainButtonComponent, NxPopoverModule],
  template: `
    <div class="info-header-container">
      <span class="info-header-label">
        {{ displayName }}
        <button
          nxPlainButton
          type="button"
          class="header-info-icon"
          [attr.aria-label]="'More information about ' + displayName"
          [nxPopoverTriggerFor]="infoPopover"
          nxPopoverTrigger="click">
          <nx-icon name="info-circle-o" size="s"></nx-icon>
        </button>
      </span>
      @if (showFilterButton) {
        <span
          class="ag-header-icon ag-header-cell-filter-button"
          aria-hidden="true"
          (click)="onFilterButtonClick($event)">
          <span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>
        </span>
      }
    </div>
    <nx-popover #infoPopover>{{ infoText }}</nx-popover>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .info-header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .info-header-label {
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .header-info-icon {
      cursor: pointer;
    }
  `],
})
export class InfoHeaderRendererComponent implements IHeaderAngularComp {
  private params!: InfoHeaderRendererParams;
  displayName = '';
  infoText = '';
  showFilterButton = false;

  agInit(params: InfoHeaderRendererParams): void {
    this.params = params;
    this.displayName = params.displayName;
    this.infoText = params.infoText;
    this.showFilterButton = params.enableFilterButton;
  }

  refresh(): boolean {
    return true;
  }

  onFilterButtonClick(event: MouseEvent): void {
    this.params.showFilter(event.currentTarget as HTMLElement);
  }
}
