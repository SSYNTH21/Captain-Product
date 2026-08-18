import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DemoModeService {
  private readonly router = inject(Router);

  private readonly currentUrl = signal(this.router.url);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  isDemoMode = computed(() => this.router.parseUrl(this.currentUrl()).queryParams['demo'] === '1');
}
