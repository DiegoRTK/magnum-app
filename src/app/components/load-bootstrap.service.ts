// load-bootstrap.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoadBootstrapService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadBootstrap(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('bootstrap').then((bootstrap) => {
        // Bootstrap is now loaded
      });
    }
  }
}
