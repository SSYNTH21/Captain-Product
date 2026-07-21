import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxHeaderModule } from '@allianz/ng-aquila/header';
import { NxToolbarModule } from '@allianz/ng-aquila/toolbar';
import { NxBreadcrumbModule } from '@allianz/ng-aquila/breadcrumb';
import { NxIconModule } from '@allianz/ng-aquila/icon';

export interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NxHeaderModule, NxToolbarModule, NxBreadcrumbModule, NxIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() activeNav: string = '';
}
