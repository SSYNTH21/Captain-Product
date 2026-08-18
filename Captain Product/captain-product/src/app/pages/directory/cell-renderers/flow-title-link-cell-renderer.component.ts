import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { FeatureDemo } from '../feature-demo.model';

@Component({
  selector: 'app-flow-title-link-cell-renderer',
  standalone: true,
  imports: [RouterLink, NxLinkModule],
  template: `
    <nx-link size="small">
      <a [routerLink]="route">{{ title }}</a>
    </nx-link>
  `,
})
export class FlowTitleLinkCellRendererComponent implements ICellRendererAngularComp {
  title = '';
  route = '/';

  agInit(params: ICellRendererParams<FeatureDemo, string>): void {
    this.title = params.value ?? '';
    this.route = params.data?.route ?? '/';
  }

  refresh(params: ICellRendererParams<FeatureDemo, string>): boolean {
    this.title = params.value ?? '';
    this.route = params.data?.route ?? '/';
    return true;
  }
}
