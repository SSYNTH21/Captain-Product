import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxContextMenuModule } from '@allianz/ng-aquila/context-menu';
import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { FeatureDemo, ManualStatus } from '../feature-demo.model';

export interface StatusActionMenuCellRendererParams extends ICellRendererParams<FeatureDemo> {
  onSetManualStatus: (data: FeatureDemo, status: ManualStatus) => void;
  onCopyDemoLink: (data: FeatureDemo) => void;
}

@Component({
  selector: 'app-status-action-menu-cell-renderer',
  standalone: true,
  imports: [NxContextMenuModule, NxButtonModule, NxIconModule],
  template: `
    <button
      nxPlainButton
      type="button"
      aria-label="More actions"
      [nxContextMenuTriggerFor]="menu">
      <nx-icon name="ellipsis-h" aria-hidden="true"></nx-icon>
    </button>
    <nx-context-menu #menu="nxContextMenu">
      @if (!isValidated) {
        <button nxContextMenuItem type="button" (click)="setStatus('Pending approval')">Mark as pending approval</button>
      }
      <button nxContextMenuItem type="button" (click)="copyDemoLink()">Copy demo link</button>
    </nx-context-menu>
  `,
})
export class StatusActionMenuCellRendererComponent implements ICellRendererAngularComp {
  private params!: StatusActionMenuCellRendererParams;
  isValidated = false;

  agInit(params: StatusActionMenuCellRendererParams): void {
    this.params = params;
    this.isValidated = params.data?.teamApproved === true && params.data?.stakeholderApproved === true;
  }

  refresh(params: StatusActionMenuCellRendererParams): boolean {
    this.params = params;
    this.isValidated = params.data?.teamApproved === true && params.data?.stakeholderApproved === true;
    return true;
  }

  setStatus(status: ManualStatus): void {
    if (!this.params.data) {
      return;
    }
    this.params.onSetManualStatus(this.params.data, status);
  }

  copyDemoLink(): void {
    if (!this.params.data) {
      return;
    }
    this.params.onCopyDemoLink(this.params.data);
  }
}
