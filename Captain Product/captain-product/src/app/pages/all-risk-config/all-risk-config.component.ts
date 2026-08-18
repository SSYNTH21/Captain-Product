import { Component, computed, DestroyRef, ElementRef, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NxExpertModule } from '@allianz/ng-aquila/config';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxDataDisplayModule } from '@allianz/ng-aquila/data-display';
import { NxBadgeModule } from '@allianz/ng-aquila/badge';
import { NxTabsModule } from '@allianz/ng-aquila/tabs';
import { NxRadioToggleModule } from '@allianz/ng-aquila/radio-toggle';
import { NxTableModule } from '@allianz/ng-aquila/table';
import { NxButtonModule, NxPlainButtonComponent } from '@allianz/ng-aquila/button';
import { NxGridModule } from '@allianz/ng-aquila/grid';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxDropdownModule } from '@allianz/ng-aquila/dropdown';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxLabelModule, NxErrorModule } from '@allianz/ng-aquila/base';
import { NxTooltipModule } from '@allianz/ng-aquila/tooltip';
import { NxCheckboxModule } from '@allianz/ng-aquila/checkbox';
import { NxPopoverModule } from '@allianz/ng-aquila/popover';
import { NxModalModule, NxDialogService, NxModalRef } from '@allianz/ng-aquila/modal';
import { NxMessageModule, NxMessageToastService } from '@allianz/ng-aquila/message';
import { AgGridAngular } from 'ag-grid-angular';
import { CellFocusedEvent, ColDef, ColGroupDef, RowSelectionOptions, SelectionChangedEvent, SelectionColumnDef, SideBarDef } from 'ag-grid-community';
import '../../ag-grid-setup';
import { HeaderComponent } from '../../components/header/header.component';
import {
  ProductTemplateService,
  ProductTemplateTeamMember,
  ProductTemplateCoverage,
  ProductTemplateExclusion,
  CoveragePricingCategory,
} from '../../services/product-template.service';
import { DemoModeService } from '../../services/demo-mode.service';
import { CheckboxCellRendererComponent } from './cell-renderers/checkbox-cell-renderer.component';
import {
  PricingCategoryDisplayCellRendererComponent,
  PricingCategoryDisplayCellRendererParams,
} from './cell-renderers/pricing-category-display-cell-renderer.component';
import { PricingCategoryEditCellRendererComponent } from './cell-renderers/pricing-category-edit-cell-renderer.component';
import {
  BooleanDisplayCellRendererComponent,
  BooleanDisplayCellRendererParams,
} from './cell-renderers/boolean-display-cell-renderer.component';
import { BooleanEditCellRendererComponent } from './cell-renderers/boolean-edit-cell-renderer.component';
import { InfoHeaderRendererComponent, InfoHeaderRendererParams } from './cell-renderers/info-header-renderer.component';
import { NameLinkCellRendererComponent } from './cell-renderers/name-link-cell-renderer.component';
import { DamagesDisplayCellRendererComponent } from './cell-renderers/damages-display-cell-renderer.component';

const ROLES = ['Owner', 'Underwriter', 'Product Manager'];

type ComponentToggle = 'sections' | 'coverages' | 'exclusions' | 'extensions' | 'writebacks';

interface OperationalEntity {
  id: string;
  name: string;
}

const OPERATIONAL_ENTITIES: OperationalEntity[] = [
  { id: 'agcs-germany', name: 'AGCS Germany' },
  { id: 'agcs-united-states', name: 'AGCS United States' },
  { id: 'agcs-china', name: 'AGCS China' },
  { id: 'agcs-canada', name: 'AGCS Canada' },
  { id: 'agcs-spain', name: 'AGCS Spain' },
  { id: 'agcs-india', name: 'AGCS India' },
  { id: 'agcs-japan', name: 'AGCS Japan' },
  { id: 'agcs-france', name: 'AGCS France' },
  { id: 'agcs-brazil', name: 'AGCS Brazil' },
  { id: 'agcs-belgium', name: 'AGCS Belgium' },
  { id: 'agcs-hong-kong', name: 'AGCS Hong Kong' },
  { id: 'agcs-denmark', name: 'AGCS Denmark' },
  { id: 'agcs-south-africa', name: 'AGCS South Africa' },
  { id: 'agcs-finland', name: 'AGCS Finland' },
  { id: 'agcs-new-zealand', name: 'AGCS New Zealand' },
  { id: 'agcs-netherlands', name: 'AGCS Netherlands' },
  { id: 'agcs-mexico', name: 'AGCS Mexico' },
  { id: 'agcs-sweden', name: 'AGCS Sweden' },
  { id: 'agcs-south-korea', name: 'AGCS South Korea' },
  { id: 'agcs-norway', name: 'AGCS Norway' },
  { id: 'agcs-portugal', name: 'AGCS Portugal' },
  { id: 'agcs-italy', name: 'AGCS Italy' },
  { id: 'agcs-australia', name: 'AGCS Australia' },
  { id: 'agcs-switzerland', name: 'AGCS Switzerland' },
  { id: 'agcs-singapore', name: 'AGCS Singapore' },
];

@Component({
  selector: 'app-all-risk-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NxExpertModule,
    NxLinkModule,
    NxHeadlineModule,
    NxIconModule,
    NxDataDisplayModule,
    NxBadgeModule,
    NxTabsModule,
    NxRadioToggleModule,
    NxTableModule,
    NxButtonModule,
    NxGridModule,
    NxFormfieldModule,
    NxDropdownModule,
    NxInputModule,
    NxCardModule,
    NxCopytextModule,
    NxLabelModule,
    NxErrorModule,
    NxTooltipModule,
    NxCheckboxModule,
    NxPopoverModule,
    NxModalModule,
    NxMessageModule,
    NxPlainButtonComponent,
    AgGridAngular,
    HeaderComponent,
  ],
  templateUrl: './all-risk-config.component.html',
  styleUrl: './all-risk-config.component.scss',
})
export class AllRiskConfigComponent {
  private readonly productTemplateService = inject(ProductTemplateService);
  private readonly fb = inject(FormBuilder);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly dialogService = inject(NxDialogService);
  private readonly messageToastService = inject(NxMessageToastService);
  private readonly demoModeService = inject(DemoModeService);

  isDemoMode = this.demoModeService.isDemoMode;

  templateInfo = this.productTemplateService.templateInfo;
  teamMembers = this.productTemplateService.teamMembers;
  coverages = this.productTemplateService.coverages;
  exclusions = this.productTemplateService.exclusions;
  extensions = this.productTemplateService.extensions;
  writebacks = this.productTemplateService.writebacks;
  sections = this.productTemplateService.sections;

  today = new Date().toLocaleDateString();

  isDraft = computed(() => this.templateInfo()?.status === 'Draft');

  ownerName = computed(() => this.teamMembers().find(m => m.role === 'Owner')?.name ?? '');
  ownerEmail = computed(() => this.teamMembers().find(m => m.role === 'Owner')?.email ?? '');

  private readonly lastUpdatedAt = new Date();
  lastUpdatedDisplay = computed(() => {
    const date = this.lastUpdatedAt.toLocaleDateString();
    const time = this.lastUpdatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${date}, ${time} by ${this.ownerEmail()}`;
  });

  activeComponentToggle = signal<ComponentToggle>('sections');

  sectionIds = computed(() => this.sections().map(s => s.id));
  sectionsTooltip = computed(() => this.sections().map(s => s.name).join(', '));

  private lastPageBodyScrollTop = 0;
  private suppressPageBodyScrollTracking = false;

  onPageBodyScroll(event: Event): void {
    if (this.suppressPageBodyScrollTracking) return;
    this.lastPageBodyScrollTop = (event.target as HTMLElement).scrollTop;
  }

  setActiveComponentToggle(toggle: ComponentToggle): void {
    this.suppressPageBodyScrollTracking = true;
    this.activeComponentToggle.set(toggle);
    const scrollContainer = this.elementRef.nativeElement.querySelector('.page-body');
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = this.lastPageBodyScrollTop;
      }
      setTimeout(() => {
        this.suppressPageBodyScrollTracking = false;
      }, 100);
    });
  }

  hasInteracted = signal(false);

  markInteracted(): void {
    this.hasInteracted.set(true);
  }

  selectedCoverages = computed(() => this.coverages().filter(c => c.selected));
  selectedExclusions = computed(() => this.exclusions().filter(e => e.selected));
  selectedExtensions = computed(() => this.extensions().filter(e => e.selected));
  selectedWritebacks = computed(() => this.writebacks().filter(w => w.selected));

  pricingCategoryOptions: { value: CoveragePricingCategory; label: string }[] = [
    { value: 'not-priced', label: 'Not priced' },
    { value: 'model-priced', label: 'Model priced' },
    { value: 'free-format', label: 'Free format pricing' },
  ];

  pricingCategoryLabel(category: CoveragePricingCategory): string {
    return this.pricingCategoryOptions.find(o => o.value === category)?.label ?? '';
  }

  pricingCategoryBadgeType(category: CoveragePricingCategory): 'active' | 'negative' | undefined {
    if (category === 'model-priced') return 'active';
    if (category === 'free-format') return 'negative';
    return undefined;
  }

  // Checkbox-renderer columns only — pricingCategory/isDefaultSelection/isStandard
  // (Coverages) and type/isDefaultSelection/isStandard (Exclusions) are real AG
  // Grid cell editors and arm/disarm "Apply to all" via cellEditingStarted/Stopped
  // instead (see onCoverageCellEditingStarted/Stopped below).
  private static readonly APPLY_TO_ALL_TRIGGER_COL_IDS = new Set([
    'propertyDamageApplicable',
    'businessInterruptionApplicable',
    'propertyDamageDamages',
    'businessInterruptionDamages',
  ]);

  coverageCellEdited = signal(false);

  private setCoverageCellEdited(colId: string | null): void {
    const isTriggerCol = !!colId && AllRiskConfigComponent.APPLY_TO_ALL_TRIGGER_COL_IDS.has(colId);
    this.coverageCellEdited.set(isTriggerCol);
    if (isTriggerCol) this.markInteracted();
  }

  private onDocumentClickCapture = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const cellEl = target.closest('[col-id]');
    const colId = cellEl?.getAttribute('col-id') ?? null;
    // Coverages and Exclusions share several colIds (propertyDamage/
    // businessInterruption*), but only one grid is ever mounted at a time
    // (@switch). A real cell click is always inside its own grid's
    // container, so scope by container when we have a colId; a null colId
    // (background click) safely resets both trackers since the inactive
    // one is already a no-op.
    if (colId === null || target.closest('.coverages-ag-grid-container')) {
      this.setCoverageCellEdited(colId);
    }
    if (colId === null || target.closest('.exclusions-ag-grid-container')) {
      this.setExclusionCellEdited(colId);
    }
  };

  // Keyboard navigation (Tab/arrow keys) moves focus between cells without
  // dispatching a document click, so the click-capture listener alone misses it.
  onCoverageCellFocused(event: CellFocusedEvent<ProductTemplateCoverage>): void {
    const colId = typeof event.column === 'string' ? event.column : (event.column?.getColId() ?? null);
    this.setCoverageCellEdited(colId);
  }

  updateCoveragePricingCategory(coverage: ProductTemplateCoverage, pricingCategory: CoveragePricingCategory): void {
    this.productTemplateService.updateCoverage(coverage, { pricingCategory });
    this.markInteracted();
  }

  updateCoverageDefaultSelection(coverage: ProductTemplateCoverage, isDefaultSelection: boolean | null): void {
    this.productTemplateService.updateCoverage(coverage, { isDefaultSelection });
    this.markInteracted();
  }

  updateCoverageStandard(coverage: ProductTemplateCoverage, isStandard: boolean | null): void {
    this.productTemplateService.updateCoverage(coverage, { isStandard });
    this.markInteracted();
  }

  updateCoveragePropertyDamageApplicable(coverage: ProductTemplateCoverage, propertyDamageApplicable: boolean): void {
    this.productTemplateService.updateCoverage(coverage, { propertyDamageApplicable });
    this.markInteracted();
    this.coverageCellEdited.set(true);
  }

  updateCoverageBusinessInterruptionApplicable(coverage: ProductTemplateCoverage, businessInterruptionApplicable: boolean): void {
    this.productTemplateService.updateCoverage(coverage, { businessInterruptionApplicable });
    this.markInteracted();
    this.coverageCellEdited.set(true);
  }

  coveragesGridSelectionCount = signal(0);

  deleteCoverageRow(): void {
    // No-op for this table; real delete behavior lands with the next table.
  }

  coveragesRowSelection: RowSelectionOptions<ProductTemplateCoverage> = {
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: false,
    isRowSelectable: () => false,
  };

  coveragesSelectionColumnDef: SelectionColumnDef = { pinned: 'left' };

  coveragesSideBar: SideBarDef = { toolPanels: ['columns'] };

  getCoverageRowId = (params: { data: ProductTemplateCoverage }): string => params.data.id;

  onCoverageCellEditingStarted(): void {
    this.markInteracted();
    this.coverageCellEdited.set(true);
  }

  onCoverageCellEditingStopped(): void {
    this.coverageCellEdited.set(false);
  }

  onCoverageSelectionChanged(event: SelectionChangedEvent<ProductTemplateCoverage>): void {
    const selectedRows = event.api.getSelectedRows();
    this.coveragesGridSelectionCount.set(selectedRows.length);
    const selectedIds = new Set(selectedRows.map(row => row.id));
    this.productTemplateService.updateCoverageSelection(selectedIds);
    this.markInteracted();
  }

  coveragesColumnDefs: (ColDef<ProductTemplateCoverage> | ColGroupDef<ProductTemplateCoverage>)[] = [
    {
      colId: 'name',
      field: 'name',
      headerName: 'Name',
      width: 240,
      minWidth: 140,
      filter: true,
      pinned: 'left',
      wrapText: true,
      autoHeight: true,
      cellRenderer: NameLinkCellRendererComponent,
    },
    {
      colId: 'pricingCategory',
      headerName: 'Pricing category',
      width: 180,
      minWidth: 180,
      filter: true,
      editable: params => this.isDraft() && params.data?.id !== 'unnamed-perils',
      cellRenderer: PricingCategoryDisplayCellRendererComponent,
      cellRendererParams: {
        isEditable: (data?: ProductTemplateCoverage) => this.isDraft() && data?.id !== 'unnamed-perils',
        label: (value: CoveragePricingCategory) => this.pricingCategoryLabel(value),
        badgeType: (value: CoveragePricingCategory) => this.pricingCategoryBadgeType(value),
      } as Partial<PricingCategoryDisplayCellRendererParams>,
      cellEditor: PricingCategoryEditCellRendererComponent,
      cellEditorParams: {
        options: this.pricingCategoryOptions,
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.pricingCategory,
      valueSetter: params => {
        if (!params.data || params.newValue === params.oldValue) return false;
        this.updateCoveragePricingCategory(params.data, params.newValue);
        return true;
      },
    },
    {
      colId: 'isDefaultSelection',
      headerName: 'Default selection',
      width: 210,
      minWidth: 210,
      filter: true,
      editable: params => this.isDraft() && params.data?.id !== 'unnamed-perils',
      headerComponent: InfoHeaderRendererComponent,
      headerComponentParams: {
        infoText: 'Indicates that the element is selected as default in the template.',
      } as Partial<InfoHeaderRendererParams>,
      cellRenderer: BooleanDisplayCellRendererComponent,
      cellRendererParams: {
        trueLabel: 'Defaulted',
        falseLabel: 'Not defaulted',
        isEditable: (data?: ProductTemplateCoverage) => this.isDraft() && data?.id !== 'unnamed-perils',
      } as Partial<BooleanDisplayCellRendererParams>,
      cellEditor: BooleanEditCellRendererComponent,
      cellEditorParams: {
        trueLabel: 'Defaulted',
        falseLabel: 'Not defaulted',
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.isDefaultSelection,
      valueSetter: params => {
        if (!params.data || params.newValue === params.oldValue) return false;
        this.updateCoverageDefaultSelection(params.data, params.newValue);
        return true;
      },
    },
    {
      colId: 'isStandard',
      headerName: 'Standard',
      width: 210,
      minWidth: 210,
      filter: true,
      editable: params => this.isDraft() && params.data?.id !== 'unnamed-perils',
      headerComponent: InfoHeaderRendererComponent,
      headerComponentParams: {
        infoText: 'Guides the visibility setting in Insurance Coverage screen.',
      } as Partial<InfoHeaderRendererParams>,
      cellRenderer: BooleanDisplayCellRendererComponent,
      cellRendererParams: {
        trueLabel: 'Standard',
        falseLabel: 'Not standard',
        isEditable: (data?: ProductTemplateCoverage) => this.isDraft() && data?.id !== 'unnamed-perils',
      } as Partial<BooleanDisplayCellRendererParams>,
      cellEditor: BooleanEditCellRendererComponent,
      cellEditorParams: {
        trueLabel: 'Standard',
        falseLabel: 'Not standard',
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.isStandard,
      valueSetter: params => {
        if (!params.data || params.newValue === params.oldValue) return false;
        this.updateCoverageStandard(params.data, params.newValue);
        return true;
      },
    },
    {
      headerName: 'Property Damage section',
      headerClass: 'col-section-group',
      children: [
        {
          colId: 'propertyDamageApplicable',
          headerName: 'Applicability',
          width: 150,
          minWidth: 150,
          filter: true,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (coverage: ProductTemplateCoverage, checked: boolean) =>
              this.updateCoveragePropertyDamageApplicable(coverage, checked),
            ariaLabel: (coverage: ProductTemplateCoverage) => `Property Damage applicability for ${coverage.name}`,
            readonly: () => this.templateInfo()?.isAllRiskProduct === true,
          },
          valueGetter: params => params.data?.propertyDamageApplicable,
        },
        {
          colId: 'propertyDamageDamages',
          headerName: 'Damages',
          width: 300,
          minWidth: 240,
          filter: true,
          cellRenderer: DamagesDisplayCellRendererComponent,
          valueGetter: () => null,
        },
      ],
    },
    {
      headerName: 'Business interruption section',
      headerClass: 'col-section-group',
      children: [
        {
          colId: 'businessInterruptionApplicable',
          headerName: 'Applicability',
          width: 150,
          minWidth: 150,
          filter: true,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (coverage: ProductTemplateCoverage, checked: boolean) =>
              this.updateCoverageBusinessInterruptionApplicable(coverage, checked),
            ariaLabel: (coverage: ProductTemplateCoverage) => `Business interruption applicability for ${coverage.name}`,
            readonly: () => this.templateInfo()?.isAllRiskProduct === true,
          },
          valueGetter: params => params.data?.businessInterruptionApplicable,
        },
        {
          colId: 'businessInterruptionDamages',
          headerName: 'Damages',
          width: 300,
          minWidth: 240,
          filter: true,
          cellRenderer: DamagesDisplayCellRendererComponent,
          valueGetter: () => null,
        },
      ],
    },
    {
      colId: 'description',
      field: 'description',
      headerName: 'Description',
      width: 540,
      minWidth: 312,
      wrapText: true,
      autoHeight: true,
      filter: true,
    },
  ];

  // ── Exclusions AG Grid table ──────────────────────────────────
  // Checkbox-renderer columns only — type/isDefaultSelection/isStandard are
  // real AG Grid cell editors and arm/disarm "Apply to all" via
  // cellEditingStarted/Stopped instead (see onExclusionCellEditingStarted/Stopped).
  private static readonly EXCLUSIONS_APPLY_TO_ALL_TRIGGER_COL_IDS = new Set([
    'propertyDamageApplicable',
    'businessInterruptionApplicable',
    'propertyDamageDamages',
    'businessInterruptionDamages',
  ]);

  exclusionCellEdited = signal(false);

  private setExclusionCellEdited(colId: string | null): void {
    const isTriggerCol = !!colId && AllRiskConfigComponent.EXCLUSIONS_APPLY_TO_ALL_TRIGGER_COL_IDS.has(colId);
    this.exclusionCellEdited.set(isTriggerCol);
    if (isTriggerCol) this.markInteracted();
  }

  onExclusionCellFocused(event: CellFocusedEvent<ProductTemplateExclusion>): void {
    const colId = typeof event.column === 'string' ? event.column : (event.column?.getColId() ?? null);
    this.setExclusionCellEdited(colId);
  }

  updateExclusionType(exclusion: ProductTemplateExclusion, type: ProductTemplateExclusion['type']): void {
    this.productTemplateService.updateExclusion(exclusion, { type });
    this.markInteracted();
  }

  updateExclusionDefaultSelection(exclusion: ProductTemplateExclusion, isDefaultSelection: boolean | null): void {
    this.productTemplateService.updateExclusion(exclusion, { isDefaultSelection });
    this.markInteracted();
  }

  updateExclusionStandard(exclusion: ProductTemplateExclusion, isStandard: boolean | null): void {
    this.productTemplateService.updateExclusion(exclusion, { isStandard });
    this.markInteracted();
  }

  updateExclusionPropertyDamageApplicable(exclusion: ProductTemplateExclusion, propertyDamageApplicable: boolean): void {
    this.productTemplateService.updateExclusion(exclusion, { propertyDamageApplicable });
    this.markInteracted();
  }

  updateExclusionBusinessInterruptionApplicable(
    exclusion: ProductTemplateExclusion,
    businessInterruptionApplicable: boolean
  ): void {
    this.productTemplateService.updateExclusion(exclusion, { businessInterruptionApplicable });
    this.markInteracted();
  }

  exclusionsGridSelectionCount = signal(0);

  @ViewChild('deleteLinkedExclusionDialogTemplate', { static: true })
  private deleteLinkedExclusionDialogTemplate!: TemplateRef<unknown>;
  private deleteLinkedExclusionDialogRef?: NxModalRef<unknown>;
  private pendingExclusionDeletion: ProductTemplateExclusion[] = [];
  private pendingCoverageDefaultSelectionRevertIds = new Set<string>();

  deleteExclusionRow(): void {
    const selected = this.exclusions().filter(e => e.selected);
    if (selected.length === 0) return;
    this.pendingExclusionDeletion = selected;
    if (selected.some(e => this.isCoverageLinkedExclusion(e))) {
      this.deleteLinkedExclusionDialogRef = this.dialogService.open(this.deleteLinkedExclusionDialogTemplate, {
        showCloseIcon: true,
        appearance: 'expert',
      });
      return;
    }
    this.confirmExclusionDeletion();
  }

  onConfirmDeleteLinkedExclusion(): void {
    this.confirmExclusionDeletion();
    this.deleteLinkedExclusionDialogRef?.close();
  }

  onCancelDeleteLinkedExclusion(): void {
    this.pendingExclusionDeletion = [];
    this.deleteLinkedExclusionDialogRef?.close();
  }

  private confirmExclusionDeletion(): void {
    const ids = new Set(this.pendingExclusionDeletion.map(e => e.id));
    for (const exclusion of this.pendingExclusionDeletion) {
      if (this.isCoverageLinkedExclusion(exclusion)) {
        this.pendingCoverageDefaultSelectionRevertIds.add(exclusion.id.slice('coverage-linked-'.length));
      }
    }
    this.productTemplateService.removeExclusionRows(ids);
    this.pendingExclusionDeletion = [];
    this.exclusionsGridSelectionCount.set(0);
    this.messageToastService.open('Removed successfully', { context: 'success' });
  }

  // Coverage-linked exclusions are Mandatory but still removable (unlike
  // seed-data Mandatory exclusions), identified by the `coverage-linked-`
  // id prefix set in ProductTemplateService.addLinkedExclusionFromCoverage.
  private isCoverageLinkedExclusion(data?: ProductTemplateExclusion): boolean {
    return data?.id.startsWith('coverage-linked-') === true;
  }

  exclusionsRowSelection: RowSelectionOptions<ProductTemplateExclusion> = {
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: false,
    isRowSelectable: params => params.data?.type !== 'Mandatory' || this.isCoverageLinkedExclusion(params.data),
  };

  exclusionsSelectionColumnDef: SelectionColumnDef = { pinned: 'left' };

  exclusionsSideBar: SideBarDef = { toolPanels: ['columns'] };

  getExclusionRowId = (params: { data: ProductTemplateExclusion }): string => params.data.id;

  onExclusionCellEditingStarted(): void {
    this.markInteracted();
    this.exclusionCellEdited.set(true);
  }

  onExclusionCellEditingStopped(): void {
    this.exclusionCellEdited.set(false);
  }

  onExclusionSelectionChanged(event: SelectionChangedEvent<ProductTemplateExclusion>): void {
    const selectedRows = event.api.getSelectedRows();
    this.exclusionsGridSelectionCount.set(selectedRows.length);
    const selectedIds = new Set(selectedRows.map(row => row.id));
    this.productTemplateService.updateExclusionSelection(selectedIds);
    this.markInteracted();
  }

  exclusionsColumnDefs: (ColDef<ProductTemplateExclusion> | ColGroupDef<ProductTemplateExclusion>)[] = [
    {
      colId: 'name',
      field: 'name',
      headerName: 'Name',
      width: 240,
      minWidth: 140,
      filter: true,
      pinned: 'left',
      wrapText: true,
      autoHeight: true,
    },
    {
      colId: 'type',
      headerName: 'Type',
      width: 180,
      minWidth: 180,
      filter: true,
      editable: params => this.isDraft() && params.data?.type !== 'Mandatory',
      cellRenderer: BooleanDisplayCellRendererComponent,
      cellRendererParams: {
        trueLabel: 'Mandatory',
        falseLabel: 'Optional',
        isEditable: (data?: ProductTemplateExclusion) => this.isDraft() && data?.type !== 'Mandatory',
      } as Partial<BooleanDisplayCellRendererParams>,
      cellEditor: BooleanEditCellRendererComponent,
      cellEditorParams: {
        trueLabel: 'Mandatory',
        falseLabel: 'Optional',
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.type === 'Mandatory',
      valueSetter: params => {
        if (!params.data || params.newValue === (params.oldValue as boolean)) return false;
        this.updateExclusionType(params.data, params.newValue ? 'Mandatory' : 'Optional');
        return true;
      },
    },
    {
      colId: 'isDefaultSelection',
      headerName: 'Default selection',
      width: 210,
      minWidth: 210,
      filter: true,
      editable: params => this.isDraft(),
      headerComponent: InfoHeaderRendererComponent,
      headerComponentParams: {
        infoText: 'Indicates that the element is selected as default in the template.',
      } as Partial<InfoHeaderRendererParams>,
      cellRenderer: BooleanDisplayCellRendererComponent,
      cellRendererParams: {
        trueLabel: 'Defaulted',
        falseLabel: 'Not defaulted',
        isEditable: (data?: ProductTemplateExclusion) => this.isDraft(),
      } as Partial<BooleanDisplayCellRendererParams>,
      cellEditor: BooleanEditCellRendererComponent,
      cellEditorParams: {
        trueLabel: 'Defaulted',
        falseLabel: 'Not defaulted',
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.isDefaultSelection,
      valueSetter: params => {
        if (!params.data || params.newValue === params.oldValue) return false;
        this.updateExclusionDefaultSelection(params.data, params.newValue);
        return true;
      },
    },
    {
      colId: 'isStandard',
      headerName: 'Standard',
      width: 210,
      minWidth: 210,
      filter: true,
      editable: params => this.isDraft(),
      headerComponent: InfoHeaderRendererComponent,
      headerComponentParams: {
        infoText: 'Guides the visibility setting in Insurance Coverage screen.',
      } as Partial<InfoHeaderRendererParams>,
      cellRenderer: BooleanDisplayCellRendererComponent,
      cellRendererParams: {
        trueLabel: 'Standard',
        falseLabel: 'Not standard',
        isEditable: (data?: ProductTemplateExclusion) => this.isDraft(),
      } as Partial<BooleanDisplayCellRendererParams>,
      cellEditor: BooleanEditCellRendererComponent,
      cellEditorParams: {
        trueLabel: 'Standard',
        falseLabel: 'Not standard',
      },
      cellEditorPopup: false,
      cellEditorPopupPosition: 'under',
      valueGetter: params => params.data?.isStandard,
      valueSetter: params => {
        if (!params.data || params.newValue === params.oldValue) return false;
        this.updateExclusionStandard(params.data, params.newValue);
        return true;
      },
    },
    {
      headerName: 'Property Damage section',
      headerClass: 'col-section-group',
      children: [
        {
          colId: 'propertyDamageApplicable',
          headerName: 'Applicability',
          width: 150,
          minWidth: 150,
          filter: true,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (exclusion: ProductTemplateExclusion, checked: boolean) =>
              this.updateExclusionPropertyDamageApplicable(exclusion, checked),
            ariaLabel: (exclusion: ProductTemplateExclusion) => `Property Damage applicability for ${exclusion.name}`,
            readonly: () => true,
          },
          valueGetter: params => params.data?.propertyDamageApplicable,
        },
        {
          colId: 'propertyDamageDamages',
          headerName: 'Damages',
          width: 300,
          minWidth: 240,
          filter: true,
          cellRenderer: DamagesDisplayCellRendererComponent,
          valueGetter: () => null,
        },
      ],
    },
    {
      headerName: 'Business interruption section',
      headerClass: 'col-section-group',
      children: [
        {
          colId: 'businessInterruptionApplicable',
          headerName: 'Applicability',
          width: 150,
          minWidth: 150,
          filter: true,
          cellClass: 'col-applicability',
          cellRenderer: CheckboxCellRendererComponent,
          cellRendererParams: {
            onChange: (exclusion: ProductTemplateExclusion, checked: boolean) =>
              this.updateExclusionBusinessInterruptionApplicable(exclusion, checked),
            ariaLabel: (exclusion: ProductTemplateExclusion) =>
              `Business interruption applicability for ${exclusion.name}`,
            readonly: () => true,
          },
          valueGetter: params => params.data?.businessInterruptionApplicable,
        },
        {
          colId: 'businessInterruptionDamages',
          headerName: 'Damages',
          width: 300,
          minWidth: 240,
          filter: true,
          cellRenderer: DamagesDisplayCellRendererComponent,
          valueGetter: () => null,
        },
      ],
    },
    {
      colId: 'description',
      field: 'description',
      headerName: 'Description',
      width: 540,
      minWidth: 312,
      wrapText: true,
      autoHeight: true,
      filter: true,
    },
  ];

  operationalEntities = OPERATIONAL_ENTITIES;

  generalInfoForm: FormGroup = this.fb.group({
    templateDescription: [''],
    operationalEntities: [[] as string[], Validators.required],
  });

  constructor() {
    this.resetGeneralInfoForm();
    this.refreshCoveragesDefaultSelectionBaseline();
    document.addEventListener('click', this.onDocumentClickCapture, { capture: true });
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('click', this.onDocumentClickCapture, { capture: true });
    });
  }

  private resetGeneralInfoForm(): void {
    const info = this.templateInfo();
    this.generalInfoForm.setValue({
      templateDescription: info?.templateDescription ?? '',
      operationalEntities: this.operationalEntities
        .filter(entity => (info?.operationalEntityNames ?? []).includes(entity.name))
        .map(entity => entity.id),
    });
  }

  saveGeneralInfo(): void {
    const value = this.generalInfoForm.value;
    const selectedNames = this.operationalEntities
      .filter(entity => (value.operationalEntities ?? []).includes(entity.id))
      .map(entity => entity.name);
    this.productTemplateService.updateTemplateInfo({
      templateDescription: value.templateDescription,
      operationalEntityNames: selectedNames,
    });
    this.hasInteracted.set(false);
    this.messageToastService.open('Saved successfully', { context: 'success' });
  }

  @ViewChild('discardChangesDialogTemplate', { static: true })
  private discardChangesDialogTemplate!: TemplateRef<unknown>;
  private discardChangesDialogRef?: NxModalRef<unknown>;

  cancelGeneralInfo(): void {
    this.discardChangesDialogRef = this.dialogService.open(this.discardChangesDialogTemplate, {
      showCloseIcon: true,
      appearance: 'expert',
    });
  }

  onConfirmDiscard(): void {
    this.resetGeneralInfoForm();
    this.hasInteracted.set(false);
    this.discardChangesDialogRef?.close();
  }

  onCancelDiscard(): void {
    this.discardChangesDialogRef?.close();
  }

  // ── Components overview: Coverage default-selection confirmation modal ──
  private coveragesDefaultSelectionBaseline = new Map<string, boolean | null>();

  private refreshCoveragesDefaultSelectionBaseline(): void {
    this.coveragesDefaultSelectionBaseline = new Map(this.coverages().map(c => [c.id, c.isDefaultSelection]));
  }

  @ViewChild('defaultSelectionConfirmDialogTemplate', { static: true })
  private defaultSelectionConfirmDialogTemplate!: TemplateRef<unknown>;
  private defaultSelectionConfirmDialogRef?: NxModalRef<unknown>;
  private pendingDefaultSelectionChanges: ProductTemplateCoverage[] = [];

  @ViewChild('revertDefaultSelectionConfirmDialogTemplate', { static: true })
  private revertDefaultSelectionConfirmDialogTemplate!: TemplateRef<unknown>;
  private revertDefaultSelectionConfirmDialogRef?: NxModalRef<unknown>;
  private pendingRevertDefaultSelectionChanges: ProductTemplateCoverage[] = [];

  saveComponentsOverview(): void {
    if (this.pendingCoverageDefaultSelectionRevertIds.size > 0) {
      const revertIds = this.pendingCoverageDefaultSelectionRevertIds;
      for (const coverage of this.coverages()) {
        if (revertIds.has(coverage.id)) {
          this.productTemplateService.updateCoverage(coverage, { isDefaultSelection: true });
        }
      }
      this.pendingCoverageDefaultSelectionRevertIds = new Set();
    }
    const flagged = this.coverages().filter(
      c => this.coveragesDefaultSelectionBaseline.get(c.id) === true && c.isDefaultSelection === false
    );
    if (flagged.length > 0) {
      this.pendingDefaultSelectionChanges = flagged;
      this.defaultSelectionConfirmDialogRef = this.dialogService.open(this.defaultSelectionConfirmDialogTemplate, {
        showCloseIcon: true,
        appearance: 'expert',
      });
      return;
    }
    this.proceedToRevertCheckOrFinalize();
  }

  private proceedToRevertCheckOrFinalize(): void {
    const linkedExclusionCoverageIds = new Set(
      this.exclusions()
        .filter(e => e.id.startsWith('coverage-linked-'))
        .map(e => e.id.slice('coverage-linked-'.length))
    );
    const reverted = this.coverages().filter(
      c =>
        this.coveragesDefaultSelectionBaseline.get(c.id) === false &&
        c.isDefaultSelection === true &&
        linkedExclusionCoverageIds.has(c.id)
    );
    if (reverted.length > 0) {
      this.pendingRevertDefaultSelectionChanges = reverted;
      this.revertDefaultSelectionConfirmDialogRef = this.dialogService.open(this.revertDefaultSelectionConfirmDialogTemplate, {
        showCloseIcon: true,
        appearance: 'expert',
      });
      return;
    }
    this.finalizeComponentsOverviewSave();
  }

  private finalizeComponentsOverviewSave(): void {
    this.hasInteracted.set(false);
    this.refreshCoveragesDefaultSelectionBaseline();
    this.messageToastService.open('Saved successfully', { context: 'success' });
  }

  onCancelDefaultSelectionChange(): void {
    for (const coverage of this.pendingDefaultSelectionChanges) {
      this.productTemplateService.updateCoverage(coverage, { isDefaultSelection: true });
    }
    this.pendingDefaultSelectionChanges = [];
    this.defaultSelectionConfirmDialogRef?.close();
  }

  onConfirmDefaultSelectionChange(): void {
    for (const coverage of this.pendingDefaultSelectionChanges) {
      this.productTemplateService.addLinkedExclusionFromCoverage(coverage);
    }
    this.pendingDefaultSelectionChanges = [];
    this.defaultSelectionConfirmDialogRef?.close();
    this.proceedToRevertCheckOrFinalize();
  }

  onCancelRevertDefaultSelectionChange(): void {
    for (const coverage of this.pendingRevertDefaultSelectionChanges) {
      this.productTemplateService.updateCoverage(coverage, { isDefaultSelection: false });
    }
    this.pendingRevertDefaultSelectionChanges = [];
    this.revertDefaultSelectionConfirmDialogRef?.close();
  }

  onConfirmRevertDefaultSelectionChange(): void {
    const ids = new Set(this.pendingRevertDefaultSelectionChanges.map(c => `coverage-linked-${c.id}`));
    this.productTemplateService.removeExclusions(ids);
    this.pendingRevertDefaultSelectionChanges = [];
    this.revertDefaultSelectionConfirmDialogRef?.close();
    this.finalizeComponentsOverviewSave();
  }

  // ── Components overview: Add coverages component (always-empty) modal ──
  @ViewChild('addCoverageComponentDialogTemplate', { static: true })
  private addCoverageComponentDialogTemplate!: TemplateRef<unknown>;
  private addCoverageComponentDialogRef?: NxModalRef<unknown>;

  openAddCoverageComponentModal(): void {
    this.addCoverageComponentDialogRef = this.dialogService.open(this.addCoverageComponentDialogTemplate, {
      fullscreen: true,
      showCloseIcon: true,
      appearance: 'expert',
    });
  }

  closeAddCoverageComponentModal(): void {
    this.addCoverageComponentDialogRef?.close();
  }

  // ── Team member table ──────────────────────────────────────
  roles = ROLES;
  showAddMember = signal(false);
  showTeamError = signal(false);
  isEditingTeamMember = false;
  editingMember: ProductTemplateTeamMember | null = null;

  addMemberForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  get ownerCount(): number {
    return this.teamMembers().filter(m => m.role === 'Owner').length;
  }

  showAddMemberCard(): void {
    this.showAddMember.set(true);
    this.addMemberForm.reset();
    this.isEditingTeamMember = false;
    this.editingMember = null;
    this.showTeamError.set(false);
    this.markInteracted();
  }

  closeAddMemberPanel(): void {
    this.showAddMember.set(false);
  }

  editMember(member: ProductTemplateTeamMember): void {
    this.addMemberForm.patchValue(member);
    this.showAddMember.set(true);
    this.isEditingTeamMember = true;
    this.editingMember = member;
    this.markInteracted();
  }

  deleteMember(member: ProductTemplateTeamMember): void {
    this.productTemplateService.deleteTeamMember(member);
    this.markInteracted();
  }

  saveMember(): void {
    if (!this.addMemberForm.valid) {
      Object.values(this.addMemberForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const newMember = this.addMemberForm.value as ProductTemplateTeamMember;

    if (this.isEditingTeamMember && this.editingMember) {
      this.productTemplateService.updateTeamMember(this.editingMember, newMember);
    } else {
      this.productTemplateService.addTeamMember(newMember);
    }

    this.isEditingTeamMember = false;
    this.editingMember = null;
    this.closeAddMemberPanel();
    this.markInteracted();
  }
}
