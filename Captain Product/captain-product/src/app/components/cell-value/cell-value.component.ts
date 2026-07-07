import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NxDropdownModule } from '@allianz/ng-aquila/dropdown';
import { NxFormfieldModule } from '@allianz/ng-aquila/formfield';
import { CellValue } from '../../data/comparison.model';

@Component({
  selector: 'app-cell-value',
  standalone: true,
  imports: [CommonModule, FormsModule, NxDropdownModule, NxFormfieldModule],
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
          <svg class="warn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#EFBE25"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6C11.3372 6 10.8 6.44772 10.8 7V13C10.8 13.5523 11.3372 14 12 14C12.6628 14 13.2 13.5523 13.2 13V7C13.2 6.44772 12.6628 6 12 6Z" fill="#414141"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8 17.2C10.8 16.5372 11.3372 16 12 16C12.6628 16 13.2 16.5372 13.2 17.2C13.2 17.8628 12.6628 18.4 12 18.4C11.3372 18.4 10.8 17.8628 10.8 17.2Z" fill="#414141"/>
          </svg>
          <span>{{ changeLabel }}</span>
        </div>
      }
      @if (cell.text && cell.type !== 'change') {
        @for (line of cell.text.split('\\n'); track line) {
          <div>• {{ line }}</div>
        }
      }
      @if (cell.hasDropdown) {
        <div class="dropdown-wrap" [class.has-error]="dropdownError()">
          <nx-formfield appearance="outline" nxFloatLabel="never">
            <nx-dropdown [placeholder]="'Select'" [(ngModel)]="selectedAction" (ngModelChange)="onSelect($event)">
              <nx-dropdown-item value="apply">Apply change</nx-dropdown-item>
              <nx-dropdown-item value="ignore">Ignore change</nx-dropdown-item>
            </nx-dropdown>
          </nx-formfield>
          @if (dropdownError()) {
            <div class="dropdown-error-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC3149"><path fill-rule="evenodd" d="M12,2C12.3955786,2 12.7611083,2.21813636 12.9588976,2.57223923L22.851658,20.2832823C23.0494473,20.6373852 23.0494473,21.0736579 22.851658,21.4277608C22.6538687,21.7818636 22.288339,22 21.8927604,22L2.10723959,22C1.71166099,22 1.34613128,21.7818636 1.14834198,21.4277608C0.950552674,21.0736579 0.950552674,20.6373852 1.14834198,20.2832823L11.0411024,2.57223923C11.2388917,2.21813636 11.6044214,2 12,2Z"/></svg>
              <span>Select an option</span>
            </div>
          }
        </div>
      }
    }
  `,
  styleUrl: './cell-value.component.scss'
})
export class CellValueComponent {
  @Input({ required: true }) cell!: CellValue;
  @Input() showError = false;

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
    this.dropdownError.set(false);
  }

  markError() {
    if (!this.selectedAction) {
      this.dropdownError.set(true);
    }
  }
}
