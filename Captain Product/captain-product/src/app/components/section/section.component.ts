import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../data/comparison.model';
import { ComparisonRowComponent } from '../comparison-row/comparison-row.component';
import { SubgroupComponent } from '../subgroup/subgroup.component';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, ComparisonRowComponent, SubgroupComponent],
  template: `
    <div class="cu-section-header" (click)="toggle()">
      <span>{{ section.title }}</span>
      <svg [class.up]="expanded()" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 15l6-6 6 6" stroke="#414141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    @if (expanded()) {
      <div class="cu-section-body">
        @if (section.rows) {
          @for (row of section.rows; track row.label + $index) {
            <app-comparison-row [row]="row" />
          }
        }
        @if (section.subgroups) {
          @for (sg of section.subgroups; track sg.label) {
            <app-subgroup [subgroup]="sg" />
          }
        }
      </div>
    }
  `,
  styleUrl: './section.component.scss'
})
export class SectionComponent {
  @Input({ required: true }) section!: Section;
  expanded = signal(true);
  toggle() { this.expanded.update(v => !v); }
}
