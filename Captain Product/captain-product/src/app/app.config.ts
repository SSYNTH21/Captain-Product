import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NX_ICON_INITIALIZER } from '@allianz/ng-aquila/icon';

// Multicolor SVG from @allianz/ngx-brand-kit — yellow circle (#efbe25) + dark exclamation (#414141)
// Only this icon deviates from the NDBX monochrome default; all other icons use the standard SVG registry
const EXCLAMATION_CIRCLE_WARNING_SVG = `<svg height="22" viewBox="0 0 22 22" width="22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="translate(-1 -1)"><path d="m23 12c0-6.075-4.924-11-11-11-6.075 0-11 4.925-11 11 0 .38.02.755.057 1.125.376 3.697 2.583 6.854 5.7 8.548.312.169.632.323.962.463.986.417 2.047.695 3.156.807.371.037.746.057 1.125.057.38 0 .755-.02 1.125-.057 1.11-.112 2.17-.39 3.157-.807.33-.14.65-.294.962-.463 3.117-1.694 5.324-4.851 5.7-8.548.037-.37.056-.745.056-1.125z" fill="#efbe25"/><path d="m12.1 15.8c.551 0 1 .45 1 1v.2c0 .55-.449 1-1 1h-.199c-.551 0-1-.45-1-1v-.2c0-.55.449-1 1-1zm.2-9.8c.386 0 .7.315.7.7v6.6c0 .386-.314.7-.7.7h-.599c-.386 0-.701-.314-.701-.7v-6.6c0-.385.315-.7.701-.7z" fill="#414141"/></g></svg>`;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: NX_ICON_INITIALIZER,
      useFactory: (sanitizer: DomSanitizer) => (registry: any) => {
        registry.addSvgIconLiteral('exclamation-circle-warning', sanitizer.bypassSecurityTrustHtml(EXCLAMATION_CIRCLE_WARNING_SVG));
      },
      multi: true,
      deps: [DomSanitizer],
    },
  ]
};
