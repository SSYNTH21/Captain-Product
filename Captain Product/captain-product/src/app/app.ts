import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NxSwitcherModule } from '@allianz/ng-aquila/switcher';
import { NxMessageModule } from '@allianz/ng-aquila/message';
import { NxIconModule } from '@allianz/ng-aquila/icon';
import { NxLinkModule } from '@allianz/ng-aquila/link';
import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxTabsModule } from '@allianz/ng-aquila/tabs';
import { NxRadioToggleModule } from '@allianz/ng-aquila/radio-toggle';
import { NxSignalButtonModule } from '@allianz/ng-aquila/signal-button';
import { HeaderComponent } from './components/header/header.component';
import { VersionHeaderComponent } from './components/version-header/version-header.component';
import { SectionComponent } from './components/section/section.component';
import { DiscardPopoverComponent } from './components/discard-popover/discard-popover.component';
import { FilterService } from './services/filter.service';
import { SECTIONS, VERSION_INFO } from './data/comparison.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  filter = inject(FilterService);

  versions = VERSION_INFO;
  sections = SECTIONS;

  modalOpen = signal(false);
  isDirty = signal(false);
  showDiscard = signal(false);
  bannerVisible = signal(true);
  selectedStatus = signal('published');

  get changesOnly() { return this.filter.changesOnly(); }
  set changesOnly(val: boolean) { this.filter.changesOnly.set(val); }

  openModal() {
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
