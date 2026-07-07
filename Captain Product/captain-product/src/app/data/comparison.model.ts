export type ChangeType = 'updated' | 'removed' | 'new-component' | 'new-localisation';

export interface CellValue {
  type: 'text' | 'check' | 'list' | 'longtext' | 'dash' | 'change' | 'dropdown';
  text?: string;
  items?: string[];
  change?: ChangeType;
  hasDropdown?: boolean;
}

export interface ComparisonRow {
  label: string;
  v1: CellValue;
  v2: CellValue;
  unchanged?: boolean;
}

export interface SubGroup {
  label: string;
  rows: ComparisonRow[];
  unchanged?: boolean;
}

export interface Section {
  title: string;
  rows?: ComparisonRow[];
  subgroups?: SubGroup[];
}

export interface VersionInfo {
  title: string;
  version: string;
  date: string;
}
