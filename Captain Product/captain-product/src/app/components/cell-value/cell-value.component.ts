import { Component, Input, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NxDropdownComponent, NxDropdownModule } from '@allianz/ng-aquila/dropdown';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { CellValue } from '../../data/comparison.model';

@Component({
  selector: 'app-cell-value',
  standalone: true,
  imports: [CommonModule, FormsModule, NxDropdownModule, NxFormfieldModule, NxIconModule],
  template: `
    @if (cell.type === 'text') {
      <span>{{ cell.text }}</span>
    }
    @if (cell.type === 'dash') {
      <span class="dash">—</span>
    }
    @if (cell.type === 'check') {
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L9.5 17L19 8" stroke="#414141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    }
    @if (cell.type === 'list') {
      <div class="list-wrap">
        @for (item of visibleItems(); track item; let i = $index) {
          <div>• {{ item }}</div>
        }
        @if ((cell.items?.length ?? 0) > 5) {
          <button class="show-more-btn" (click)="toggleExpanded()">
            <svg viewBox="0 0 24 24" fill="none" [class.rotated]="expanded()">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ expanded() ? 'Show less' : 'Show more' }}</span>
          </button>
        }
      </div>
    }
    @if (cell.type === 'longtext') {
      <div class="longtext-wrap">
        <span [class.clamped]="!textExpanded()">{{ cell.text }}</span>
        <button class="show-more-btn" (click)="toggleTextExpanded()">
          <svg viewBox="0 0 24 24" fill="none" [class.rotated]="textExpanded()">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ textExpanded() ? 'Show less' : 'Show more' }}</span>
        </button>
      </div>
    }
    @if (cell.type === 'change' || (cell.change && cell.type !== 'longtext')) {
      @if (cell.change) {
        <div class="change-badge">
          <nx-status-icon type="warning"></nx-status-icon>
          <span>{{ changeLabel }}</span>
        </div>
      }
      @if (cell.text && cell.type !== 'change') {
        @for (line of cell.text.split('\\n'); track line) {
          <div>• {{ line }}</div>
        }
      }
      @if (cell.hasDropdown) {
        <div class="dropdown-wrap">
          <nx-formfield appearance="outline" nxFloatLabel="never">
            <nx-dropdown
              #dropdown
              [placeholder]="'Select'"
              [(ngModel)]="selectedAction"
              (ngModelChange)="onSelect($event)">
              <nx-dropdown-item value="apply">Apply change</nx-dropdown-item>
              <nx-dropdown-item value="ignore">Ignore change</nx-dropdown-item>
            </nx-dropdown>
            <span nxFormfieldError>Select an option</span>
          </nx-formfield>
        </div>
      }
    }
  `,
  styleUrl: './cell-value.component.scss'
})
export class CellValueComponent {
  @Input({ required: true }) cell!: CellValue;
  @Input() showError = false;
  @ViewChild('dropdown') dropdown?: NxDropdownComponent;

  expanded = signal(false);
  textExpanded = signal(false);
  dropdownError = signal(false);
  selectedAction: string | null = null;

  get visibleItems(): () => string[] {
    return () => {
      const items = this.cell.items ?? [];
      return this.expanded() ? items : items.slice(0, 5);
    };
  }

  get changeLabel(): string {
    const map: Record<string, string> = {
      updated: 'Updated value',
      removed: 'Removed',
      'new-component': 'New component',
      'new-localisation': 'New localisation'
    };
    return this.cell.change ? map[this.cell.change] ?? this.cell.change : '';
  }

  toggleExpanded() { this.expanded.update(v => !v); }
  toggleTextExpanded() { this.textExpanded.update(v => !v); }

  onSelect(_val: string) {
    this.setDropdownError(false);
  }

  markError() {
    if (!this.selectedAction) {
      this.setDropdownError(true);
    }
  }

  private setDropdownError(hasError: boolean) {
    this.dropdownError.set(hasError);
    if (this.dropdown) {
      this.dropdown.errorState = hasError;
    }
  }
}
