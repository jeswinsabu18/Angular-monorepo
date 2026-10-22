import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './employee-sidebar.component.html',
  styleUrl: './employee-sidebar.component.css',
})
export class EmployeeSidebarComponent {
  private readonly storageKey = 'sidebarExpanded';

  public isExpanded = this.readSavedState();

  public toggle(): void {
    this.isExpanded = !this.isExpanded;

    try {
      localStorage.setItem(this.storageKey, String(this.isExpanded));
    } catch {
      /* storage unavailable - the sidebar still works for this visit */
    }
  }

  private readSavedState(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === 'true';
    } catch {
      return false;
    }
  }
}
