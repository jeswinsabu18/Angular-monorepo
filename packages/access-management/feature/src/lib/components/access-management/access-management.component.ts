import { Component, inject } from '@angular/core';
import { AuthService, RegisteredUser, UserPermissions } from '@employee-management/auth-data';
import { PageShellComponent } from '@employee-management/shared-ui';
import { CustomCheckboxComponent } from '@employee-management/shared-ui';

@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [PageShellComponent, CustomCheckboxComponent],
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.css',
})
export class AccessManagementComponent {
  private readonly authService = inject(AuthService);

  public users: RegisteredUser[] = this.authService.getUsersForAccessManagement();

  public savedMessage = '';

  public permissionValue(user: RegisteredUser, permission: keyof UserPermissions): boolean {
    return user.permissions?.[permission] === true;
  }

  public setPermission(
    user: RegisteredUser,
    permission: keyof UserPermissions,
    checked: boolean,
  ): void {
    const permissions: UserPermissions = {
      add: user.permissions?.add === true,
      edit: user.permissions?.edit === true,
      delete: user.permissions?.delete === true,
    };

    permissions[permission] = checked;

    const saved = this.authService.updateUserPermissions(user.username, permissions);

    if (!saved) {
      this.savedMessage = 'Unable to update permissions.';
      return;
    }

    user.permissions = permissions;
    this.savedMessage = `Permissions updated for ${user.username}.`;
  }
}
