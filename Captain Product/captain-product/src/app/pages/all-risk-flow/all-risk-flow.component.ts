import { Component, inject, signal, computed, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { NxProgressStepperModule } from '@allianz/ng-aquila/progress-stepper';
import { NxGridModule } from '@allianz/ng-aquila/grid';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxInputModule } from '@allianz/ng-aquila/input';
import { NxDropdownModule } from '@allianz/ng-aquila/dropdown';
import { NxRadioModule } from '@allianz/ng-aquila/radio-button';
import { NxLabelModule, NxErrorModule } from '@allianz/ng-aquila/base';
import { NxButtonModule, NxPlainButtonComponent } from '@allianz/ng-aquila/button';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxModalModule, NxDialogService, NxModalRef } from '@allianz/ng-aquila/modal';
import { NxExpertModule } from '@allianz/ng-aquila/config';
import { NxTableModule } from '@allianz/ng-aquila/table';
import { NxCheckboxModule } from '@allianz/ng-aquila/checkbox';
import { NxSwitcherModule } from '@allianz/ng-aquila/switcher';
import { NxMessageModule, NxMessageToastService } from '@allianz/ng-aquila/message';
import { NxDataDisplayModule } from '@allianz/ng-aquila/data-display';
import { NxTabsModule } from '@allianz/ng-aquila/tabs';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductTemplateService } from '../../services/product-template.service';
import { DemoModeService } from '../../services/demo-mode.service';

const STEP_LABELS = ['Product information', 'Coverages', 'Exclusions', 'Extensions', 'Writebacks', 'Summary'];

interface TemplateType {
  templateId: string;
  templateName: string;
}

const TEMPLATE_TYPES: TemplateType[] = [
  { templateId: 'product-template', templateName: 'Product template' },
  { templateId: 'multinational-product', templateName: 'Multinational product' },
];

const DISABLED_TEMPLATE_TYPES = ['multinational-product'];

const LINES_OF_BUSINESS: Record<string, string> = { property: 'Property' };
const SUB_LINES_OF_BUSINESS: Record<string, string> = { 'industry-property': 'Industry property' };

interface TeamMember {
  name: string;
  role: string;
  email: string;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [{ name: 'Mara Musterman', role: 'Owner', email: 'm.musterman@allianz.com' }];

const ROLES = ['Owner', 'Underwriter', 'Product Manager'];

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

type CoveragePricingCategory = 'not-priced' | 'model-priced' | 'free-format';

interface Coverage {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  pricingCategory: CoveragePricingCategory;
  isDefaultSelection: boolean;
  isStandard: boolean;
  propertyDamageApplicable: boolean;
  businessInterruptionApplicable: boolean;
}

const MOCK_COVERAGES: Coverage[] = [
  {
    id: 'unnamed-perils',
    name: 'Unnamed Perils',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.',
    selected: true,
    pricingCategory: 'not-priced',
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: true,
  },
  {
    id: 'flexa',
    name: 'FLEXA',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.',
    selected: true,
    pricingCategory: 'not-priced',
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: true,
  },
  {
    id: 'theft-burglary-and-robbery',
    name: 'Theft, Burglary and Robbery',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.',
    selected: true,
    pricingCategory: 'not-priced',
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: true,
  },
  {
    id: 'sprinkler-leakage',
    name: 'Sprinkler Leakage',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from sprinkler leakage which refers to the accidental leakage of water and other substances like foam or gas from automatic sprinkler and deluge systems',
    selected: true,
    pricingCategory: 'model-priced',
    isDefaultSelection: true,
    isStandard: false,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: true,
  },
  {
    id: 'water',
    name: 'Water',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from water coverage which includes water steam and burst of pipe',
    selected: true,
    pricingCategory: 'free-format',
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: true,
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description:
      'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from physical loss or physical damage to property insured caused by any ensuing fire or explosion or other enumerated peril which directly results from a cyber incident',
    selected: true,
    pricingCategory: 'model-priced',
    isDefaultSelection: true,
    isStandard: false,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: true,
  },
];

interface Exclusion {
  id: string;
  name: string;
  type: 'Mandatory' | 'Optional';
  description: string;
  selected: boolean;
  isDefaultSelection: boolean | null;
  isStandard: boolean | null;
  propertyDamageApplicable: boolean;
  businessInterruptionApplicable: boolean;
}

const EXCLUSION_DESCRIPTION =
  'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.';

const MOCK_EXCLUSIONS: Exclusion[] = [
  {
    id: 'affirmative-cyber',
    name: 'Affirmative CYBER',
    type: 'Mandatory',
    description: EXCLUSION_DESCRIPTION,
    selected: true,
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: false,
  },
  {
    id: 'asbestos',
    name: 'Asbestos',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: false,
    isStandard: false,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
  {
    id: 'crime-fidelity',
    name: 'Crime, Fidelity',
    type: 'Mandatory',
    description: EXCLUSION_DESCRIPTION,
    selected: true,
    isDefaultSelection: true,
    isStandard: true,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: false,
  },
  {
    id: 'delay-loss-of-use-loss-of-market',
    name: 'Delay, Loss of Use, Loss of Market',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: false,
    isStandard: false,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
  {
    id: 'disease',
    name: 'Disease',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: false,
    isStandard: false,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
  {
    id: 'faulty-workmanship',
    name: 'Faulty Workmanship',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: false,
    isStandard: false,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
];

interface Extension {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

const EXTENSION_DESCRIPTION =
  'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.';

const MOCK_EXTENSIONS: Extension[] = [
  { id: 'accidental-leakage-or-spillage', name: 'Accidental Leakage or Spillage', description: EXTENSION_DESCRIPTION, selected: false },
  { id: 'accumulated-stocks', name: 'Accumulated Stocks', description: EXTENSION_DESCRIPTION, selected: false },
  { id: 'advanced-business-interruption-profit-or-rent', name: 'Advanced Business Interruption (Profit or Rent)', description: EXTENSION_DESCRIPTION, selected: false },
  { id: 'contract-site', name: 'Contract Site', description: EXTENSION_DESCRIPTION, selected: false },
  { id: 'builders-risk', name: 'Builders Risk', description: EXTENSION_DESCRIPTION, selected: false },
  { id: 'contract-works', name: 'Contract Works', description: EXTENSION_DESCRIPTION, selected: false },
];

interface Writeback {
  id: string;
  name: string;
  linkedExclusions: string[];
  description: string;
  selected: boolean;
}

const WRITEBACK_DESCRIPTION =
  'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.';

const MOCK_WRITEBACKS: Writeback[] = [
  {
    id: 'cbi-digital-supplier-extension-write-back',
    name: 'CBI Digital Supplier Extension Write-back',
    linkedExclusions: ['Asbestos', 'Disease'],
    description: WRITEBACK_DESCRIPTION,
    selected: false,
  },
  {
    id: 'cbi-accidental-failure-of-supply-write-back',
    name: 'CBI - Accidental Failure Of Supply Write-back',
    linkedExclusions: ['Faulty Workmanship'],
    description: WRITEBACK_DESCRIPTION,
    selected: false,
  },
  {
    id: 'digital-business-interruption-write-back',
    name: 'Digital Business Interruption_Write-back',
    linkedExclusions: ['Affirmative CYBER', 'Crime, Fidelity'],
    description: WRITEBACK_DESCRIPTION,
    selected: false,
  },
  {
    id: 'flood-write-back',
    name: 'Flood_Write-back',
    linkedExclusions: ['Delay, Loss of Use, Loss of Market', 'Asbestos'],
    description: WRITEBACK_DESCRIPTION,
    selected: false,
  },
  {
    id: 'infrastructure-system-coverage-write-back',
    name: 'Infrastructure System Coverage Write-back',
    linkedExclusions: ['Disease'],
    description: WRITEBACK_DESCRIPTION,
    selected: false,
  },
];

@Component({
  selector: 'app-all-risk-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NxLinkModule,
    NxIconModule,
    NxHeadlineModule,
    NxProgressStepperModule,
    NxGridModule,
    NxFormfieldModule,
    NxInputModule,
    NxDropdownModule,
    NxRadioModule,
    NxLabelModule,
    NxErrorModule,
    NxButtonModule,
    NxPlainButtonComponent,
    NxCardModule,
    NxCopytextModule,
    NxModalModule,
    NxExpertModule,
    NxTableModule,
    NxCheckboxModule,
    NxSwitcherModule,
    NxMessageModule,
    NxDataDisplayModule,
    NxTabsModule,
    HeaderComponent,
  ],
  templateUrl: './all-risk-flow.component.html',
  styleUrl: './all-risk-flow.component.scss',
})
export class AllRiskFlowComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogService = inject(NxDialogService);
  private readonly router = inject(Router);
  private readonly messageToastService = inject(NxMessageToastService);
  private readonly productTemplateService = inject(ProductTemplateService);
  private readonly demoModeService = inject(DemoModeService);

  isDemoMode = this.demoModeService.isDemoMode;

  stepLabels = STEP_LABELS;
  currentStep = signal(0);
  // Tracks which step indices have actually been completed (moved past).
  // Not derived from currentStep: nx-multi-stepper's [selectedIndex] input
  // is evaluated before its projected nx-step [completed] bindings update
  // in the same change-detection pass, so a reactive `i < currentStep()`
  // read is stale by one tick and desyncs the stepper's internal selection
  // from currentStep. Updating this set imperatively, before currentStep
  // changes, avoids that stale read entirely.
  completedSteps = signal<ReadonlySet<number>>(new Set());
  templateTypes = TEMPLATE_TYPES;
  roles = ROLES;
  operationalEntities = OPERATIONAL_ENTITIES;

  templateInfoForm: FormGroup = this.fb.group({
    templateType: ['product-template', Validators.required],
    baseProduct: ['property-global-master-product', Validators.required],
    name: ['Sub-Product 1 Property', Validators.required],
    lineOfBusiness: ['property', Validators.required],
    subLineOfBusiness: ['industry-property', Validators.required],
    operationalEntities: [['agcs-germany'], Validators.required],
    isAllRiskProduct: [true, Validators.required],
    templateDescription: [
      "The AGCS Glocal Property Master product offers comprehensive property insurance solutions that address both global and local needs. It provides a standardized framework while allowing for customization to meet specific client requirements. Key features include core coverages that protect against a wide range of risks, such as fire, natural disasters, and other perils affecting physical assets. The product also allows for customizable extensions to tailor additional coverages to the unique exposures of different industries and geographical locations. Clients benefit from access to risk management services, including risk assessment and mitigation, to help minimize potential losses. Efficient claims support focuses on minimizing business interruption and ensuring quick recovery. By combining Allianz's global network and resources with local market expertise, the Glocal Property Master product delivers effective solutions for businesses seeking robust property insurance adapted to their specific operational and geographical risks. For more detailed information, please refer to the internal product documentation or contact the AGCS underwriting team.",
    ],
  });

  isTemplateTypeDisabled(value: string): boolean {
    return DISABLED_TEMPLATE_TYPES.includes(value);
  }

  // ── Team member table ──────────────────────────────────────
  teamMembers = signal<TeamMember[]>(MOCK_TEAM_MEMBERS);
  showAddMember = signal(false);
  showTeamError = signal(false);
  isEditingTeamMember = false;
  editingMember: TeamMember | null = null;

  addMemberForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  get hasOwner(): boolean {
    return this.teamMembers().some(m => m.role === 'Owner');
  }

  get ownerCount(): number {
    return this.teamMembers().filter(m => m.role === 'Owner').length;
  }

  showAddMemberCard(): void {
    this.showAddMember.set(true);
    this.addMemberForm.reset();
    this.isEditingTeamMember = false;
    this.editingMember = null;
    this.showTeamError.set(false);
  }

  closeAddMemberPanel(): void {
    this.showAddMember.set(false);
  }

  editMember(member: TeamMember): void {
    this.addMemberForm.patchValue(member);
    this.showAddMember.set(true);
    this.isEditingTeamMember = true;
    this.editingMember = member;
  }

  deleteMember(member: TeamMember): void {
    this.teamMembers.set(this.teamMembers().filter(m => m !== member));
  }

  saveMember(): void {
    if (!this.addMemberForm.valid) {
      Object.values(this.addMemberForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const newMember = this.addMemberForm.value as TeamMember;

    if (this.isEditingTeamMember && this.editingMember) {
      this.teamMembers.set(this.teamMembers().map(m => (m === this.editingMember ? newMember : m)));
    } else {
      this.teamMembers.set([...this.teamMembers(), newMember]);
    }

    this.isEditingTeamMember = false;
    this.editingMember = null;
    this.closeAddMemberPanel();
  }

  // ── All-risk warning dialog ────────────────────────────────
  @ViewChild('allRiskDialogTemplate', { static: true })
  private allRiskDialogTemplate!: TemplateRef<unknown>;
  private allRiskDialogRef?: NxModalRef<unknown>;
  private confirmedIsAllRisk: boolean | null = null;

  get allRiskDialogTitle(): string {
    return this.templateInfoForm.get('isAllRiskProduct')?.value === true
      ? 'Adjusting components for all-risk'
      : 'Adjusting components for named perils';
  }

  get allRiskDialogMessage(): string {
    return this.templateInfoForm.get('isAllRiskProduct')?.value === true
      ? 'Selection of an all-risk product type will automatically include required components, such as unnamed perils. These can be reviewed in the next steps.'
      : 'Selection of a Named Perils product type will automatically remove Unnamed Perils coverage. This can be reviewed in the next steps.';
  }

  onNext(): void {
    this.templateInfoForm.markAllAsTouched();

    if (this.showAddMember() && this.addMemberForm.invalid) {
      this.showTeamError.set(true);
      Object.values(this.addMemberForm.controls).forEach(control => control.markAsTouched());
      return;
    }
    this.showTeamError.set(false);

    if (this.templateInfoForm.valid && !this.showAddMember()) {
      const isAllRisk = this.templateInfoForm.get('isAllRiskProduct')?.value === true;
      if (isAllRisk !== this.confirmedIsAllRisk) {
        this.allRiskDialogRef = this.dialogService.open(this.allRiskDialogTemplate, {
          showCloseIcon: true,
          appearance: 'expert',
        });
      } else if (this.stepLabels[this.currentStep()] === 'Writebacks' && this.missingLinkedExclusions().length > 0) {
        this.missingExclusionsDialogRef = this.dialogService.open(this.missingExclusionsDialogTemplate, {
          showCloseIcon: true,
          appearance: 'expert',
        });
      } else {
        this.goToNextStep();
      }
    }
  }

  onConfirmAllRiskPopup(): void {
    const isAllRisk = this.templateInfoForm.get('isAllRiskProduct')?.value === true;
    this.confirmedIsAllRisk = isAllRisk;
    this.resetCoveragesForRiskType(isAllRisk);
    this.allRiskDialogRef?.close();
    this.goToNextStep();
  }

  onCancelAllRiskPopup(): void {
    this.allRiskDialogRef?.close();
  }

  @ViewChild('pageBody') private pageBody!: ElementRef<HTMLElement>;

  private resetScroll(): void {
    this.pageBody?.nativeElement.scrollTo({ top: 0 });
  }

  private goToNextStep(): void {
    if (this.currentStep() < this.stepLabels.length - 1) {
      const next = this.currentStep() + 1;
      this.markStepCompleted(this.currentStep());
      // nx-multi-stepper's [selectedIndex] input (on the parent element) is
      // applied by Angular before nx-step's [completed] input (on projected
      // content children) within the same change-detection pass. If both
      // signals change in the same tick, CDK's internal guard
      // (_anyControlsInvalidOrPending) reads the OLD "not completed" value
      // for the step just finished and silently rejects the index change,
      // permanently desyncing the stepper's internal selectedIndex from
      // currentStep. setTimeout forces a real macrotask boundary so the
      // `completed` binding commits in its own CD cycle first.
      setTimeout(() => {
        this.currentStep.set(next);
        this.resetScroll();
      });
    }
  }

  onPrevious(): void {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
      this.resetScroll();
    }
  }

  private markStepCompleted(index: number): void {
    if (!this.completedSteps().has(index)) {
      this.completedSteps.set(new Set([...this.completedSteps(), index]));
    }
  }

  // nx-multi-stepper's `linear` mode already blocks clicks on steps beyond
  // the first not-yet-visited one — this just syncs its internal selection
  // back into currentStep so clicking a completed step actually switches
  // the visible content (the [selectedIndex] input alone is one-way).
  onStepSelected(index: number): void {
    if (index !== this.currentStep()) {
      this.currentStep.set(index);
      this.resetScroll();
    }
  }

  // ── Coverages step ─────────────────────────────────────────
  coverages = signal<Coverage[]>(MOCK_COVERAGES);
  showSelectedOnly = signal(false);

  get isAllRisk(): boolean {
    return this.templateInfoForm.get('isAllRiskProduct')?.value === true;
  }

  visibleCoverages = computed(() =>
    this.isAllRisk ? this.coverages() : this.coverages().filter(c => c.id !== 'unnamed-perils'),
  );

  selectedCount = computed(() => this.visibleCoverages().filter(c => c.selected).length);

  filteredCoverages = computed(() =>
    this.showSelectedOnly() ? this.visibleCoverages().filter(c => c.selected) : this.visibleCoverages(),
  );

  allCoveragesSelected = computed(() => this.visibleCoverages().every(c => c.selected));
  someCoveragesSelected = computed(() => this.selectedCount() > 0 && !this.allCoveragesSelected());

  toggleCoverage(coverage: Coverage): void {
    if (this.isAllRisk) {
      return;
    }
    this.coverages.set(
      this.coverages().map(c => (c.id === coverage.id ? { ...c, selected: !c.selected } : c)),
    );
  }

  toggleAllCoverages(checked: boolean): void {
    if (this.isAllRisk) {
      return;
    }
    const visibleIds = new Set(this.visibleCoverages().map(c => c.id));
    this.coverages.set(
      this.coverages().map(c => (visibleIds.has(c.id) ? { ...c, selected: checked } : c)),
    );
  }

  private resetCoveragesForRiskType(isAllRisk: boolean): void {
    this.coverages.set(this.coverages().map(c => ({ ...c, selected: isAllRisk })));
  }

  // ── Exclusions step ────────────────────────────────────────
  exclusions = signal<Exclusion[]>(MOCK_EXCLUSIONS);
  showSelectedExclusionsOnly = signal(false);
  exclusionsBannerVisible = signal(true);

  selectedExclusionsCount = computed(() => this.exclusions().filter(e => e.selected).length);

  filteredExclusions = computed(() =>
    this.showSelectedExclusionsOnly() ? this.exclusions().filter(e => e.selected) : this.exclusions(),
  );

  allExclusionsSelected = computed(() => this.exclusions().every(e => e.selected));
  someExclusionsSelected = computed(() => this.selectedExclusionsCount() > 0 && !this.allExclusionsSelected());

  toggleExclusion(exclusion: Exclusion): void {
    if (exclusion.type === 'Mandatory') {
      return;
    }
    this.exclusions.set(
      this.exclusions().map(e => (e.id === exclusion.id ? { ...e, selected: !e.selected } : e)),
    );
  }

  toggleAllExclusions(checked: boolean): void {
    const optionalIds = new Set(this.exclusions().filter(e => e.type === 'Optional').map(e => e.id));
    this.exclusions.set(
      this.exclusions().map(e => (optionalIds.has(e.id) ? { ...e, selected: checked } : e)),
    );
  }

  // ── Extensions step ────────────────────────────────────────
  extensions = signal<Extension[]>(MOCK_EXTENSIONS);
  showSelectedExtensionsOnly = signal(false);

  selectedExtensionsCount = computed(() => this.extensions().filter(e => e.selected).length);

  filteredExtensions = computed(() =>
    this.showSelectedExtensionsOnly() ? this.extensions().filter(e => e.selected) : this.extensions(),
  );

  allExtensionsSelected = computed(() => this.extensions().every(e => e.selected));
  someExtensionsSelected = computed(() => this.selectedExtensionsCount() > 0 && !this.allExtensionsSelected());

  toggleExtension(extension: Extension): void {
    this.extensions.set(
      this.extensions().map(e => (e.id === extension.id ? { ...e, selected: !e.selected } : e)),
    );
  }

  toggleAllExtensions(checked: boolean): void {
    this.extensions.set(this.extensions().map(e => ({ ...e, selected: checked })));
  }

  // ── Writebacks step ────────────────────────────────────────
  writebacks = signal<Writeback[]>(MOCK_WRITEBACKS);
  showSelectedWritebacksOnly = signal(false);
  writebacksBannerVisible = signal(true);

  selectedWritebacksCount = computed(() => this.writebacks().filter(w => w.selected).length);

  filteredWritebacks = computed(() =>
    this.showSelectedWritebacksOnly() ? this.writebacks().filter(w => w.selected) : this.writebacks(),
  );

  allWritebacksSelected = computed(() => this.writebacks().every(w => w.selected));
  someWritebacksSelected = computed(() => this.selectedWritebacksCount() > 0 && !this.allWritebacksSelected());

  toggleWriteback(writeback: Writeback): void {
    this.writebacks.set(
      this.writebacks().map(w => (w.id === writeback.id ? { ...w, selected: !w.selected } : w)),
    );
  }

  toggleAllWritebacks(checked: boolean): void {
    this.writebacks.set(this.writebacks().map(w => ({ ...w, selected: checked })));
  }

  // Every selected writeback whose linkedExclusions aren't ALL selected in the
  // Exclusions step. Empty linkedExclusions (e.g. after "Reconfigure later")
  // trivially passes since there's nothing left to require.
  missingLinkedExclusions = computed(() => {
    const selectedExclusionNames = new Set(this.exclusions().filter(e => e.selected).map(e => e.name));
    return this.writebacks()
      .filter(w => w.selected)
      .map(w => ({ writeback: w, missing: w.linkedExclusions.filter(name => !selectedExclusionNames.has(name)) }))
      .filter(entry => entry.missing.length > 0);
  });

  @ViewChild('missingExclusionsDialogTemplate', { static: true })
  private missingExclusionsDialogTemplate!: TemplateRef<unknown>;
  private missingExclusionsDialogRef?: NxModalRef<unknown>;

  onAddMissingLinkedExclusions(): void {
    const missingNames = new Set(this.missingLinkedExclusions().flatMap(entry => entry.missing));
    this.exclusions.set(
      this.exclusions().map(e => (missingNames.has(e.name) ? { ...e, selected: true } : e)),
    );
    this.missingExclusionsDialogRef?.close();
    this.goToNextStep();
  }

  onReconfigureLinkedExclusionsLater(): void {
    const missingByWritebackId = new Map(
      this.missingLinkedExclusions().map(entry => [entry.writeback.id, new Set(entry.missing)]),
    );
    this.writebacks.set(
      this.writebacks().map(w => {
        const missing = missingByWritebackId.get(w.id);
        return missing ? { ...w, linkedExclusions: w.linkedExclusions.filter(name => !missing.has(name)) } : w;
      }),
    );
    this.missingExclusionsDialogRef?.close();
    this.goToNextStep();
  }

  // ── Summary step ───────────────────────────────────────────
  summaryTabIndex = signal(0);
  operationalEntitiesExpanded = signal(false);

  get selectedTemplateTypeName(): string {
    const id = this.templateInfoForm.get('templateType')?.value;
    return this.templateTypes.find(t => t.templateId === id)?.templateName ?? '';
  }

  get selectedLineOfBusinessName(): string {
    const id = this.templateInfoForm.get('lineOfBusiness')?.value;
    return LINES_OF_BUSINESS[id] ?? '';
  }

  get selectedSubLineOfBusinessName(): string {
    const id = this.templateInfoForm.get('subLineOfBusiness')?.value;
    return SUB_LINES_OF_BUSINESS[id] ?? '';
  }

  get selectedOperationalEntityNames(): string[] {
    const ids: string[] = this.templateInfoForm.get('operationalEntities')?.value ?? [];
    const idSet = new Set(ids);
    return this.operationalEntities.filter(e => idSet.has(e.id)).map(e => e.name);
  }

  visibleOperationalEntityNames = computed(() => {
    const names = this.selectedOperationalEntityNames;
    return this.operationalEntitiesExpanded() ? names : names.slice(0, 5);
  });

  toggleOperationalEntitiesExpanded(): void {
    this.operationalEntitiesExpanded.update(v => !v);
  }

  onSubmit(): void {
    this.productTemplateService.submit({
      templateInfo: {
        templateTypeName: this.selectedTemplateTypeName,
        baseProductName: 'Property Global Master Product',
        name: this.templateInfoForm.get('name')?.value,
        lineOfBusinessName: this.selectedLineOfBusinessName,
        subLineOfBusinessName: this.selectedSubLineOfBusinessName,
        isAllRiskProduct: this.templateInfoForm.get('isAllRiskProduct')?.value === true,
        operationalEntityNames: this.selectedOperationalEntityNames,
        templateDescription: this.templateInfoForm.get('templateDescription')?.value,
        status: 'Draft',
      },
      teamMembers: this.teamMembers(),
      coverages: this.visibleCoverages(),
      exclusions: this.exclusions(),
      extensions: this.extensions(),
      writebacks: this.writebacks(),
    });

    this.messageToastService.open('New product template created successfully', { context: 'success' });
    this.router.navigate(['/product-details']);
  }
}
