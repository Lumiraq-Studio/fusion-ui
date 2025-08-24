import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {AuthenticationService} from "../modules/authentication/service/authentication.service";
import {inject} from "@angular/core";

export const publicGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  try {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      return router.createUrlTree(['/dashboard']);
    }

    return true;
  } catch (error) {
    console.error('Error in public guard:', error);
    return router.createUrlTree(['/dashboard']);
  }
};