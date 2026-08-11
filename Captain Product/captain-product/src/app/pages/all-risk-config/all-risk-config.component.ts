import { Component, computed, inject, signal } from '@angular/core';
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
import { HeaderComponent } from '../../components/header/header.component';
import { ProductTemplateService, ProductTemplateTeamMember } from '../../services/product-template.service';

const ROLES = ['Owner', 'Underwriter', 'Product Manager'];

type ComponentToggle = 'coverages' | 'exclusions' | 'extensions' | 'writebacks';

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
    NxPlainButtonComponent,
    HeaderComponent,
  ],
  templateUrl: './all-risk-config.component.html',
  styleUrl: './all-risk-config.component.scss',
})
export class AllRiskConfigComponent {
  private readonly productTemplateService = inject(ProductTemplateService);
  private readonly fb = inject(FormBuilder);

  templateInfo = this.productTemplateService.templateInfo;
  teamMembers = this.productTemplateService.teamMembers;
  coverages = this.productTemplateService.coverages;
  exclusions = this.productTemplateService.exclusions;
  extensions = this.productTemplateService.extensions;
  writebacks = this.productTemplateService.writebacks;

  today = new Date().toLocaleDateString();

  ownerName = computed(() => this.teamMembers().find(m => m.role === 'Owner')?.name ?? '');
  ownerEmail = computed(() => this.teamMembers().find(m => m.role === 'Owner')?.email ?? '');

  private readonly lastUpdatedAt = new Date();
  lastUpdatedDisplay = computed(() => {
    const date = this.lastUpdatedAt.toLocaleDateString();
    const time = this.lastUpdatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${date}, ${time} by ${this.ownerEmail()}`;
  });

  activeComponentToggle = signal<ComponentToggle>('coverages');

  setActiveComponentToggle(toggle: ComponentToggle): void {
    this.activeComponentToggle.set(toggle);
  }

  hasInteracted = signal(false);

  markInteracted(): void {
    this.hasInteracted.set(true);
  }

  selectedCoverages = computed(() => this.coverages().filter(c => c.selected));
  selectedExclusions = computed(() => this.exclusions().filter(e => e.selected));
  selectedExtensions = computed(() => this.extensions().filter(e => e.selected));
  selectedWritebacks = computed(() => this.writebacks().filter(w => w.selected));

  operationalEntities = OPERATIONAL_ENTITIES;

  generalInfoForm: FormGroup = this.fb.group({
    templateDescription: [''],
    operationalEntities: [[] as string[], Validators.required],
  });

  constructor() {
    this.resetGeneralInfoForm();
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
  }

  cancelGeneralInfo(): void {
    this.resetGeneralInfoForm();
    this.hasInteracted.set(false);
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
