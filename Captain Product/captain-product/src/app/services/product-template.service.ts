import { Injectable, signal } from '@angular/core';

export type ProductTemplateStatus = 'Draft' | 'Published';

export interface ProductTemplateInfo {
  templateTypeName: string;
  baseProductName: string;
  name: string;
  lineOfBusinessName: string;
  subLineOfBusinessName: string;
  isAllRiskProduct: boolean;
  operationalEntityNames: string[];
  templateDescription: string;
  status: ProductTemplateStatus;
}

export interface ProductTemplateTeamMember {
  name: string;
  role: string;
  email: string;
}

export type CoveragePricingCategory = 'not-priced' | 'model-priced' | 'free-format';

export interface ProductTemplateCoverage {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  pricingCategory: CoveragePricingCategory;
  isDefaultSelection: boolean | null;
  isStandard: boolean | null;
  propertyDamageApplicable: boolean;
  businessInterruptionApplicable: boolean;
}

export interface ProductTemplateExclusion {
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

export interface ProductTemplateExtension {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

export interface ProductTemplateWriteback {
  id: string;
  name: string;
  linkedExclusions: string[];
  description: string;
  selected: boolean;
}

export interface ProductTemplateSection {
  id: string;
  name: string;
}

export interface ProductTemplateSubmission {
  templateInfo: ProductTemplateInfo;
  teamMembers: ProductTemplateTeamMember[];
  coverages: ProductTemplateCoverage[];
  exclusions: ProductTemplateExclusion[];
  extensions: ProductTemplateExtension[];
  writebacks: ProductTemplateWriteback[];
}

const DEFAULT_TEMPLATE_INFO: ProductTemplateInfo = {
  templateTypeName: 'Product template',
  baseProductName: 'Property Global Master Product',
  name: 'Sub-Product 1 Property',
  lineOfBusinessName: 'Property',
  subLineOfBusinessName: 'Industry property',
  isAllRiskProduct: true,
  operationalEntityNames: ['AGCS Germany'],
  status: 'Draft',
  templateDescription:
    "The AGCS Glocal Property Master product offers comprehensive property insurance solutions that address both global and local needs. It provides a standardized framework while allowing for customization to meet specific client requirements. Key features include core coverages that protect against a wide range of risks, such as fire, natural disasters, and other perils affecting physical assets. The product also allows for customizable extensions to tailor additional coverages to the unique exposures of different industries and geographical locations. Clients benefit from access to risk management services, including risk assessment and mitigation, to help minimize potential losses. Efficient claims support focuses on minimizing business interruption and ensuring quick recovery. By combining Allianz's global network and resources with local market expertise, the Glocal Property Master product delivers effective solutions for businesses seeking robust property insurance adapted to their specific operational and geographical risks. For more detailed information, please refer to the internal product documentation or contact the AGCS underwriting team.",
};

const DEFAULT_TEAM_MEMBERS: ProductTemplateTeamMember[] = [
  { name: 'Mara Musterman', role: 'Owner', email: 'm.musterman@allianz.com' },
];

const DEFAULT_COVERAGES: ProductTemplateCoverage[] = [
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
    isStandard: null,
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
    isStandard: null,
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
    isStandard: null,
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
    isStandard: null,
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
    isStandard: null,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: true,
  },
];

const EXCLUSION_DESCRIPTION =
  'Direct physical loss or direct physical damage to tangible covered property on described premises resulting from a sudden and accidental unnamed peril / event, except as excluded.';

const DEFAULT_EXCLUSIONS: ProductTemplateExclusion[] = [
  {
    id: 'affirmative-cyber',
    name: 'Affirmative CYBER',
    type: 'Mandatory',
    description: EXCLUSION_DESCRIPTION,
    selected: true,
    isDefaultSelection: true,
    isStandard: null,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: false,
  },
  {
    id: 'asbestos',
    name: 'Asbestos',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: null,
    isStandard: null,
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
    isStandard: null,
    propertyDamageApplicable: true,
    businessInterruptionApplicable: false,
  },
  {
    id: 'delay-loss-of-use-loss-of-market',
    name: 'Delay, Loss of Use, Loss of Market',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: null,
    isStandard: null,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
  {
    id: 'disease',
    name: 'Disease',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: null,
    isStandard: null,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
  {
    id: 'faulty-workmanship',
    name: 'Faulty Workmanship',
    type: 'Optional',
    description: EXCLUSION_DESCRIPTION,
    selected: false,
    isDefaultSelection: null,
    isStandard: null,
    propertyDamageApplicable: false,
    businessInterruptionApplicable: false,
  },
];

const DEFAULT_EXTENSIONS: ProductTemplateExtension[] = [];

const DEFAULT_WRITEBACKS: ProductTemplateWriteback[] = [];

const DEFAULT_SECTIONS: ProductTemplateSection[] = [
  { id: 'property-damage', name: 'Property damage' },
  { id: 'business-interruption', name: 'Business interruption' },
];

function normalizeCoverages(coverages: ProductTemplateCoverage[]): ProductTemplateCoverage[] {
  return coverages.map(c =>
    c.id === 'unnamed-perils' ? { ...c, pricingCategory: 'not-priced', isDefaultSelection: true, isStandard: true } : c
  );
}

@Injectable({ providedIn: 'root' })
export class ProductTemplateService {
  readonly templateInfo = signal<ProductTemplateInfo | null>(DEFAULT_TEMPLATE_INFO);
  readonly teamMembers = signal<ProductTemplateTeamMember[]>(DEFAULT_TEAM_MEMBERS);
  readonly coverages = signal<ProductTemplateCoverage[]>(normalizeCoverages(DEFAULT_COVERAGES));
  readonly exclusions = signal<ProductTemplateExclusion[]>(DEFAULT_EXCLUSIONS);
  readonly extensions = signal<ProductTemplateExtension[]>(DEFAULT_EXTENSIONS);
  readonly writebacks = signal<ProductTemplateWriteback[]>(DEFAULT_WRITEBACKS);
  readonly sections = signal<ProductTemplateSection[]>(DEFAULT_SECTIONS);

  submit(submission: ProductTemplateSubmission): void {
    this.templateInfo.set(submission.templateInfo);
    this.teamMembers.set(submission.teamMembers);
    this.coverages.set(normalizeCoverages(submission.coverages));
    this.exclusions.set(submission.exclusions);
    this.extensions.set(submission.extensions);
    this.writebacks.set(submission.writebacks);
  }

  updateTemplateInfo(changes: Partial<Pick<ProductTemplateInfo, 'templateDescription' | 'operationalEntityNames'>>): void {
    const current = this.templateInfo();
    if (!current) return;
    this.templateInfo.set({ ...current, ...changes });
  }

  addTeamMember(member: ProductTemplateTeamMember): void {
    this.teamMembers.set([...this.teamMembers(), member]);
  }

  updateTeamMember(previous: ProductTemplateTeamMember, updated: ProductTemplateTeamMember): void {
    this.teamMembers.set(this.teamMembers().map(m => (m === previous ? updated : m)));
  }

  deleteTeamMember(member: ProductTemplateTeamMember): void {
    this.teamMembers.set(this.teamMembers().filter(m => m !== member));
  }

  updateCoverage(coverage: ProductTemplateCoverage, changes: Partial<ProductTemplateCoverage>): void {
    this.coverages.set(normalizeCoverages(this.coverages().map(c => (c === coverage ? { ...c, ...changes } : c))));
  }

  updateCoverageSelection(selectedIds: Set<string>): void {
    this.coverages.set(this.coverages().map(c => ({ ...c, selected: selectedIds.has(c.id) })));
  }

  updateExclusion(exclusion: ProductTemplateExclusion, changes: Partial<ProductTemplateExclusion>): void {
    this.exclusions.set(this.exclusions().map(e => (e === exclusion ? { ...e, ...changes } : e)));
  }

  updateExclusionSelection(selectedIds: Set<string>): void {
    this.exclusions.set(this.exclusions().map(e => ({ ...e, selected: selectedIds.has(e.id) })));
  }

  addLinkedExclusionFromCoverage(coverage: ProductTemplateCoverage): void {
    const id = `coverage-linked-${coverage.id}`;
    if (this.exclusions().some(e => e.id === id)) return;
    const exclusion: ProductTemplateExclusion = {
      id,
      name: coverage.name,
      type: 'Mandatory',
      description: coverage.description,
      selected: true,
      isDefaultSelection: true,
      isStandard: null,
      propertyDamageApplicable: coverage.propertyDamageApplicable,
      businessInterruptionApplicable: coverage.businessInterruptionApplicable,
    };
    this.exclusions.set([exclusion, ...this.exclusions()]);
  }

  removeExclusions(ids: Set<string>): void {
    const linkedCoverageIds = [...ids]
      .filter(id => id.startsWith('coverage-linked-'))
      .map(id => id.slice('coverage-linked-'.length));
    if (linkedCoverageIds.length > 0) {
      const linkedCoverageIdSet = new Set(linkedCoverageIds);
      this.coverages.set(
        normalizeCoverages(
          this.coverages().map(c => (linkedCoverageIdSet.has(c.id) ? { ...c, isDefaultSelection: true } : c))
        )
      );
    }
    this.exclusions.set(this.exclusions().filter(e => !ids.has(e.id)));
  }

  removeExclusionRows(ids: Set<string>): void {
    this.exclusions.set(this.exclusions().filter(e => !ids.has(e.id)));
  }
}
