import { Component, computed, inject, signal } from '@angular/core';
import { NxExpertModule } from '@allianz/ng-aquila/config';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxDataDisplayModule } from '@allianz/ng-aquila/data-display';
import { NxMessageToastService } from '@allianz/ng-aquila/message';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import '../../ag-grid-setup';
import { FeatureDemo, ManualStatus, demoStatus } from './feature-demo.model';
import { FlowTitleLinkCellRendererComponent } from './cell-renderers/flow-title-link-cell-renderer.component';
import { CheckboxCellRendererComponent } from './cell-renderers/checkbox-cell-renderer.component';
import { StatusBadgeCellRendererComponent } from './cell-renderers/status-badge-cell-renderer.component';
import {
  StatusActionMenuCellRendererComponent,
  StatusActionMenuCellRendererParams,
} from './cell-renderers/status-action-menu-cell-renderer.component';

const TODAY = '08/17/2026';

const STATUS_STORAGE_KEY = 'captain-product.directory.demo-status';

type StoredDemoStatus = Pick<FeatureDemo, 'teamApproved' | 'stakeholderApproved' | 'manualStatus'>;

function loadStoredStatuses(): Record<string, StoredDemoStatus> {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredStatuses(statuses: Record<string, StoredDemoStatus>): void {
  localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses));
}

function withStoredStatuses(demos: FeatureDemo[]): FeatureDemo[] {
  const stored = loadStoredStatuses();
  return demos.map(demo => (stored[demo.route] ? { ...demo, ...stored[demo.route] } : demo));
}

const INITIAL_DEMOS: FeatureDemo[] = [
  {
    flowTitle: 'Product synchronisation',
    route: '/sync',
    createdDate: '08/11/2026',
    lastUpdated: TODAY,
    teamApproved: false,
    stakeholderApproved: false,
    manualStatus: 'In progress',
  },
  {
    flowTitle: 'All-risk creation',
    route: '/all-risk',
    createdDate: '08/05/2026',
    lastUpdated: TODAY,
    teamApproved: false,
    stakeholderApproved: false,
    manualStatus: 'In progress',
  },
  {
    flowTitle: 'All-risk configuration',
    route: '/all-risk-config',
    createdDate: '08/15/2026',
    lastUpdated: TODAY,
    teamApproved: false,
    stakeholderApproved: false,
    manualStatus: 'In progress',
  },
];

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [NxExpertModule, NxCardModule, NxDataDisplayModule, AgGridAngular],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss',
})
export class DirectoryComponent {
  private readonly messageToastService = inject(NxMessageToastService);

  demos = signal<FeatureDemo[]>(withStoredStatuses(INITIAL_DEMOS));

  totalCount = computed(() => this.demos().length);
  inProgressCount = computed(() => this.demos().filter(demo => demoStatus(demo) === 'In progress').length);
  pendingApprovalCount = computed(() => this.demos().filter(demo => demoStatus(demo) === 'Pending approval').length);
  validatedCount = computed(() => this.demos().filter(demo => demoStatus(demo) === 'Validated').length);

  getRowId = (params: { data: FeatureDemo }) => params.data.route;

  columnDefs: (ColDef<FeatureDemo> | ColGroupDef<FeatureDemo>)[] = [
    {
      colId: 'flowTitle',
      headerName: 'Flow title',
      field: 'flowTitle',
      flex: 2,
      minWidth: 280,
      cellRenderer: FlowTitleLinkCellRendererComponent,
    },
    {
      colId: 'createdDate',
      headerName: 'Created date',
      field: 'createdDate',
      width: 160,
    },
    {
      colId: 'lastUpdated',
      headerName: 'Last updated',
      field: 'lastUpdated',
      width: 160,
    },
    {
      headerName: 'Validation',
      headerClass: 'col-section-group',
      children: [
        {
          colId: 'teamApproved',
          headerName: 'Team',
          field: 'teamApproved',
          width: 120,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (demo: FeatureDemo, checked: boolean) => this.setTeamApproved(demo, checked),
            ariaLabel: (demo: FeatureDemo) => `Team approval for ${demo.flowTitle}`,
          },
        },
        {
          colId: 'stakeholderApproved',
          headerName: 'Stakeholder',
          field: 'stakeholderApproved',
          width: 140,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (demo: FeatureDemo, checked: boolean) => this.setStakeholderApproved(demo, checked),
            ariaLabel: (demo: FeatureDemo) => `Stakeholder approval for ${demo.flowTitle}`,
          },
        },
      ],
    },
    {
      colId: 'status',
      headerName: 'Status',
      width: 180,
      valueGetter: params => (params.data ? demoStatus(params.data) : null),
      cellRenderer: StatusBadgeCellRendererComponent,
    },
    {
      colId: 'actions',
      headerName: '',
      width: 54,
      pinned: 'right',
      resizable: false,
      sortable: false,
      filter: false,
      cellClass: 'col-actions',
      cellRenderer: StatusActionMenuCellRendererComponent,
      cellRendererParams: {
        onSetManualStatus: (demo: FeatureDemo, status: ManualStatus) => this.setManualStatus(demo, status),
        onCopyDemoLink: (demo: FeatureDemo) => this.copyDemoLink(demo),
      } as StatusActionMenuCellRendererParams,
    },
  ];

  private updateDemo(route: string, patch: Partial<FeatureDemo>): void {
    this.demos.update(demos => demos.map(demo => (demo.route === route ? { ...demo, ...patch } : demo)));
    const updated = this.demos().find(demo => demo.route === route);
    if (!updated) {
      return;
    }
    const stored = loadStoredStatuses();
    stored[route] = {
      teamApproved: updated.teamApproved,
      stakeholderApproved: updated.stakeholderApproved,
      manualStatus: updated.manualStatus,
    };
    saveStoredStatuses(stored);
  }

  setTeamApproved(demo: FeatureDemo, checked: boolean): void {
    this.updateDemo(demo.route, { teamApproved: checked });
  }

  setStakeholderApproved(demo: FeatureDemo, checked: boolean): void {
    this.updateDemo(demo.route, { stakeholderApproved: checked });
  }

  setManualStatus(demo: FeatureDemo, status: ManualStatus): void {
    this.updateDemo(demo.route, { manualStatus: status });
  }

  copyDemoLink(demo: FeatureDemo): void {
    const link = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}${demo.route}?demo=1`;
    navigator.clipboard.writeText(link).then(() => {
      this.messageToastService.open('Link copied to clipboard', { context: 'success' });
    });
  }
}
