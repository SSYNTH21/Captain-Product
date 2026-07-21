import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxButtonModule } from '@allianz/ng-aquila/button';

@Component({
  selector: 'app-discard-popover',
  standalone: true,
  imports: [CommonModule, NxIconModule, NxButtonModule],
  template: `
    @if (visible) {
      <div class="discard-popover">
        <span class="pointer-arrow"></span>
        <div class="discard-header">
          <nx-status-icon type="warning"></nx-status-icon>
          <span class="discard-title">Unsaved changes</span>
        </div>
        <div class="discard-body">Are you sure you want to discard your changes?</div>
        <div class="discard-footer">
          <button nxButton="secondary small" (click)="keep.emit()">Keep editing</button>
          <button nxButton="primary small" (click)="discard.emit()">Discard</button>
        </div>
      </div>
    }
  `,
  styleUrl: './discard-popover.component.scss'
})
export class DiscardPopoverComponent {
  @Input() visible = false;
  @Output() discard = new EventEmitter<void>();
  @Output() keep = new EventEmitter<void>();
}
