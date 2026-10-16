import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /*
   * Injecting the service creates it at startup,
   * which applies the saved theme immediately.
   */
  protected readonly themeService = inject(ThemeService);
}
