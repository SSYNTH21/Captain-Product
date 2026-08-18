import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxBadgeModule } from '@allianz/ng-aquila/badge';
import { DemoStatus } from '../feature-demo.model';

const BADGE_TYPE: Record<DemoStatus, 'active' | 'negative' | 'positive'> = {
  'In progress': 'active',
  'Pending approval': 'negative',
  Validated: 'positive',
};

@Component({
  selector: 'app-status-badge-cell-renderer',
  standalone: true,
  imports: [NxBadgeModule],
  template: ` <nx-badge [type]="badgeType">{{ status }}</nx-badge> `,
})
export class StatusBadgeCellRendererComponent implements ICellRendererAngularComp {
  status: DemoStatus = 'In progress';
  badgeType: 'active' | 'negative' | 'positive' = 'active';

  agInit(params: ICellRendererParams<unknown, DemoStatus>): void {
    this.status = params.value ?? 'In progress';
    this.badgeType = BADGE_TYPE[this.status];
  }

  refresh(params: ICellRendererParams<unknown, DemoStatus>): boolean {
    this.status = params.value ?? 'In progress';
    this.badgeType = BADGE_TYPE[this.status];
    return true;
  }
}
