import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@employee-management/auth-data';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  /*
   * isAuthenticated()
   *
   * - checks whether user is logged in
   * - checks the 10-minute timeout
   * - clears sessionStorage if expired
   */
  if (authService.isAuthenticated()) {
    return true;
  }

  /*
   * Session expired or
   * user is not logged in
   */
  return router.createUrlTree(['/login']);
};
