import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { NxIconModule } from '@allianz/ng-aquila/icon';

@Component({
  selector: 'app-damages-display-cell-renderer',
  standalone: true,
  imports: [NxIconModule],
  template: `
    <div class="damages-chip-container">
      <div class="damages-text-container">
        @if (value) {
          <span class="damages-text">{{ value }}</span>
        } @else {
          <span>—</span>
        }
      </div>
      <div class="chevron-icon">
        <nx-icon name="chevron-down" aria-hidden="true" size="s" class="icon-chevron-down"></nx-icon>
      </div>
    </div>
  `,
  styleUrl: './damages-display-cell-renderer.component.scss',
})
export class DamagesDisplayCellRendererComponent implements ICellRendererAngularComp {
  value: string | null = null;

  agInit(params: ICellRendererParams<unknown, string>): void {
    this.value = params.value ?? null;
  }

  refresh(params: ICellRendererParams<unknown, string>): boolean {
    this.value = params.value ?? null;
    return true;
  }
}
