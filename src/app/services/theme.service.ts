import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  /*
   * Separate key - never touches registeredUsers
   * or any of the session keys used by AuthService.
   */
  private readonly storageKey = 'theme';

  private readonly currentTheme = signal<Theme>(this.readSavedTheme());

  /*
   * True while the application is in dark mode
   */
  public readonly isDarkMode = computed(() => this.currentTheme() === 'dark');

  public constructor() {
    effect(() => {
      this.document.documentElement.setAttribute('data-theme', this.currentTheme());
    });
  }

  /*
   * Switch between light and dark mode
   */
  public toggleTheme(): void {
    this.currentTheme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
    this.saveTheme();
  }

  private readSavedTheme(): Theme {
    try {
      const saved = localStorage.getItem(this.storageKey);

      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  private saveTheme(): void {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme());
    } catch {
      // Storage unavailable (private mode / blocked) - theme still applies for this session
    }
  }
}
