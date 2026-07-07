import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionInfo } from '../../data/comparison.model';

@Component({
  selector: 'app-version-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vh-row">
      <div class="vh-spacer"></div>
      <div class="vh-label"></div>
      @for (v of versions; track v.version) {
        <div class="vh-cell">
          <div class="vh-title">{{ v.title }}</div>
          <div class="vh-version">{{ v.version }}</div>
          <div class="vh-date">{{ v.date }}&nbsp;</div>
        </div>
      }
      <div class="vh-action"></div>
    </div>
  `,
  styleUrl: './version-header.component.scss'
})
export class VersionHeaderComponent {
  @Input({ required: true }) versions!: VersionInfo[];
}
