import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.css',
})
export class PageShellComponent {
  @Input() public title = 'Employee Management System';
}
