import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NxExpertModule } from '@allianz/ng-aquila/config';
import { NxSwitcherModule } from '@allianz/ng-aquila/switcher';
import { NxMessageModule } from '@allianz/ng-aquila/message';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxTabsModule } from '@allianz/ng-aquila/tabs';
import { NxRadioToggleModule } from '@allianz/ng-aquila/radio-toggle';
import { NxSignalButtonModule, NxSignalButtonComponent } from '@allianz/ng-aquila/signal-button';
import { HeaderComponent } from '../../components/header/header.component';
import { VersionHeaderComponent } from '../../components/version-header/version-header.component';
import { SectionComponent } from '../../components/section/section.component';
import { DiscardPopoverComponent } from '../../components/discard-popover/discard-popover.component';
import { FilterService } from '../../services/filter.service';
import { DemoModeService } from '../../services/demo-mode.service';
import { SECTIONS, VERSION_INFO } from '../../data/comparison.data';

@Component({
  selector: 'app-sync-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NxExpertModule,
    NxSwitcherModule,
    NxMessageModule,
    NxIconModule,
    NxLinkModule,
    NxButtonModule,
    NxHeadlineModule,
    NxCopytextModule,
    NxTabsModule,
    NxRadioToggleModule,
    NxSignalButtonModule,
    HeaderComponent,
    VersionHeaderComponent,
    SectionComponent,
    DiscardPopoverComponent
  ],
  templateUrl: './sync-flow.component.html',
  styleUrl: './sync-flow.component.scss'
})
export class SyncFlowComponent {
  filter = inject(FilterService);
  isDemoMode = inject(DemoModeService).isDemoMode;

  @ViewChildren(NxSignalButtonComponent, { read: ElementRef })
  signalButtonElements!: QueryList<ElementRef<HTMLElement>>;

  versions = VERSION_INFO;
  sections = SECTIONS;

  modalOpen = signal(false);
  isDirty = signal(false);
  showDiscard = signal(false);
  bannerVisible = signal(true);
  selectedStatus = signal('published');
  activeSignalButtonIndex = signal<number | null>(null);

  get changesOnly() { return this.filter.changesOnly(); }
  set changesOnly(val: boolean) { this.filter.changesOnly.set(val); }

  openModal() {
    const index = this.activeSignalButtonIndex();
    if (index !== null) {
      const el = this.signalButtonElements.get(index)?.nativeElement;
      el?.querySelector<HTMLButtonElement>('.nx-signal-button__button')?.click();
    }

    this.modalOpen.set(true);
    this.isDirty.set(false);
    this.showDiscard.set(false);
  }

  onCancel() {
    if (this.isDirty()) {
      this.showDiscard.set(true);
    } else {
      this.closeAndReset();
    }
  }

  onUpdate() {
    this.isDirty.set(true);
  }

  onDiscard() {
    this.closeAndReset();
  }

  onKeep() {
    this.showDiscard.set(false);
  }

  closeAndReset() {
    this.modalOpen.set(false);
    this.isDirty.set(false);
    this.showDiscard.set(false);
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('cu-overlay')) {
      this.closeAndReset();
    }
  }

  dismissBanner() {
    this.bannerVisible.set(false);
  }

}
