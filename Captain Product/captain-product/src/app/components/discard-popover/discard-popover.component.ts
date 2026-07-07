import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discard-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="discard-popover">
        <span class="pointer-arrow"></span>
        <div class="discard-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#EFBE25"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6C11.3372 6 10.8 6.44772 10.8 7V13C10.8 13.5523 11.3372 14 12 14C12.6628 14 13.2 13.5523 13.2 13V7C13.2 6.44772 12.6628 6 12 6Z" fill="#414141"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8 17.2C10.8 16.5372 11.3372 16 12 16C12.6628 16 13.2 16.5372 13.2 17.2C13.2 17.8628 12.6628 18.4 12 18.4C11.3372 18.4 10.8 17.8628 10.8 17.2Z" fill="#414141"/>
          </svg>
          <span class="discard-title">Unsaved changes</span>
        </div>
        <div class="discard-body">Are you sure you want to discard your changes?</div>
        <div class="discard-footer">
          <button class="btn-discard" (click)="discard.emit()">Discard</button>
          <button class="btn-keep" (click)="keep.emit()">Keep editing</button>
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
